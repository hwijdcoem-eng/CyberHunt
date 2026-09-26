import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAuthUser } from "@/lib/auth";
import { redis, TTL, CK } from "@/lib/redis";

// ─── types ─────────────────────────────────────────────────────────────────
interface AgentRow { id: string; name: string; level: number; status: string }
interface FeedRow  { id: string; time: string; text: string }

// ─── Redis-backed shared data fetcher ──────────────────────────────────────
// This replaces the old in-memory globalCache which died on every cold start.
// Now 300 concurrent users share a single cached copy in Upstash Redis.
async function getSharedData(): Promise<{ agents: AgentRow[]; feed: FeedRow[] }> {
  // Try Redis first
  if (redis) {
    try {
      const [cachedAgents, cachedFeed] = await Promise.all([
        redis.get<AgentRow[]>(CK.dashboardAgents),
        redis.get<FeedRow[]>(CK.dashboardFeed),
      ]);

      if (cachedAgents && cachedFeed) {
        return { agents: cachedAgents, feed: cachedFeed };
      }
    } catch (err) {
      console.error("[dashboard] Redis read error:", err);
    }
  }

  // Cache miss — query DB once and write to Redis
  const [{ data: teamsSnapshot }, { data: feedSnapshot }] = await Promise.all([
    supabase
      .from("teams")
      .select("team_id, team_name, current_level, is_disqualified, last_submission_at")
      .order("score", { ascending: false })
      .limit(200),
    supabase
      .from("activity_logs")
      .select("id, message, timestamp")
      .order("timestamp", { ascending: false })
      .limit(10),
  ]);

  const agents: AgentRow[] = (teamsSnapshot ?? []).map((d) => {
    const subTime = d.last_submission_at
      ? new Date(d.last_submission_at).getTime()
      : Date.now();
    return {
      id: d.team_id,
      name: d.team_name,
      level: d.current_level > 10 ? 10 : (d.current_level || 1),
      status: d.is_disqualified
        ? "Disqualified"
        : Date.now() - subTime > 2 * 60 * 60 * 1000
        ? "Stuck"
        : "Active",
    };
  });

  const feed: FeedRow[] = (feedSnapshot ?? []).map((d) => {
    const date = new Date(d.timestamp ?? Date.now());
    return {
      id: d.id,
      time: `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`,
      text: d.message,
    };
  });

  // Write to Redis with TTL (fire-and-forget — don't block the response)
  if (redis) {
    await Promise.all([
      redis.set(CK.dashboardAgents, agents, { ex: TTL.DASHBOARD_SHARED }),
      redis.set(CK.dashboardFeed, feed,   { ex: TTL.DASHBOARD_SHARED }),
    ]).catch((err) => console.error("[dashboard] redis write error:", err));
  }

  return { agents, feed };
}

// ─── Route handler ──────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Team-specific data (always fresh — it's a single-row read, very fast)
    const { data: team, error } = await supabase
      .from("teams")
      .select("*")
      .eq("team_id", user.team_id)
      .single();

    if (error || !team) {
      console.error(`[dashboard] team not found: team_id=${user.team_id}`, error);
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    let teamData = team;

    // Initialize timer on first load
    if (!teamData.started_at) {
      const now = new Date().toISOString();
      const { error: updateError } = await supabase
        .from("teams")
        .update({ started_at: now })
        .eq("team_id", user.team_id);
      if (updateError) {
        console.error(`[dashboard] failed to set started_at for team_id=${user.team_id}:`, updateError);
      } else {
        console.log(`[dashboard] initialized timer for team_id=${user.team_id}`);
      }
      teamData.started_at = now;
    }

    const startTime = new Date(teamData.started_at).getTime();

    // Shared data from Redis cache (agents + feed)
    const { agents, feed } = await getSharedData();

    // Team's own submissions (small query, always fresh)
    const { data: teamSubmissions } = await supabase
      .from("submissions")
      .select("level_id, answer, status")
      .eq("team_id", user.team_id);

    const submitted_levels: number[] = [];
    const fragments = Array(9).fill("");
    if (teamSubmissions) {
      for (const s of teamSubmissions) {
        submitted_levels.push(s.level_id);
        if (s.status !== "rejected") {
          const idx = s.level_id - 1;
          if (idx >= 0 && idx < 9) {
            fragments[idx] = s.answer.substring(0, 1).toUpperCase();
          }
        }
      }
    }

    return NextResponse.json({
      team: {
        id: teamData.team_id,
        name: teamData.team_name,
        current_level: teamData.current_level || 1,
        hints_used: teamData.global_hints_used || 0,
        ai_strikes: teamData.ai_strikes || 0,
        score: teamData.score || 0,
        fragments,
        is_disqualified: teamData.is_disqualified || false,
        startedAt: startTime,
        level10_started_at: teamData.level10_started_at || null,
        level_hints: teamData.level_hints || {},
        level10_attempts: teamData.level10_attempts || 0,
        submitted_levels,
        extra_minutes: teamData.extra_minutes || 0,
      },
      liveFeed: feed,
      activeAgents: agents,
      total_levels: 10,
    });
  } catch (error) {
    console.error("[dashboard] internal error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
