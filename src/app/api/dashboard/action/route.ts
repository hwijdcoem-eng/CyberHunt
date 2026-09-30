import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAuthUser } from "@/lib/auth";
import { submitRatelimit, hintRatelimit, checkRateLimit } from "@/lib/rate-limit";


export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await request.formData();
    const action = formData.get("action");

    // ── save_fragments ─────────────────────────────────────────────────────
    if (action === "save_fragments") {
      const fragmentsStr = formData.get("fragments") as string;
      const fragments = JSON.parse(fragmentsStr);
      await supabase.from("teams").update({ fragments }).eq("team_id", user.team_id);
      return NextResponse.json({ success: true });
    }

    // ── hint ───────────────────────────────────────────────────────────────
    if (action === "hint") {
      // Rate-limit hints per team_id: prevents spam-clicking during the event
      const hintLimited = await checkRateLimit(hintRatelimit, `hint:${user.team_id}`);
      if (hintLimited) {
        console.warn(`[hint] rate-limited team_id=${user.team_id}`);
        return hintLimited;
      }

      const level_id = formData.get("level_id") || "1";
      const hint_num_str = formData.get("hint_num") || "1";
      const hint_num = parseInt(hint_num_str.toString(), 10);
      const lvl = parseInt(level_id.toString(), 10);

      const { data: team } = await supabase.from("teams").select("*").eq("team_id", user.team_id).single();
      if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });

       const HINTS: Record<string, Record<string, string>> = {
        "1": {
          "1": "Explore the repository files. The secret isn't in plain sight on the main page.",
          "2": "Look closely at the source code comments across the C files."
        },
        "2": {
          "1": "Every request receives a response.",
          "2": "Disable cache, then refresh the page."
        },
        "3": {
          "1": "A perfect page isn't always a silent one.",
          "2": "Your browser records more than what it displays."
        },
        "4": {
          "1": "Look beyond the pages made for visitors.",
          "2": "Some secrets become easier to notice when you Ctrl + A."
        },
        "5": {
          "1": "Compute the four trials systematically. When their solutions are stitched together sequentially, they will form a pathway to a professional network.",
          "2": "Once you reach the destination, look back at the very beginning of this journey. Find the professional announcement for this exact operation; the secret is buried in its text."
        },
        "6": {
          "1": "A repository contains more than source files.",
          "2": "Think about where developers share important milestones with users."
        },
        "7": {
          "1": "Not every cipher replaces letters. Some transform them using mathematics.",
          "2": "Rows and columns hold the secret. Classical cryptography has used this language for decades."
        },
        "8": {
          "1": "A website often leaves a small souvenir behind after every visit.",
          "2": "Isolate the target. atob(decodeURIComponent(\"\"))"
        },
        "9": {
          "1": "Not everything disappears after it's loaded. Some traces are kept for another visit.",
          "2": "(async () => {\n  const cache = await caches.open('__vercel_speed_insights');"
        }
      };


      const hintText = HINTS[lvl.toString()]?.[hint_num.toString()] || "Hint not found.";

      // Track hints per level
      const levelHints = team.level_hints || {};
      const currentHintsForLevel = levelHints[lvl.toString()] || 0;
      let globalHints = team.global_hints_used || 0;

      // Only increment if they haven't already taken this hint number
      if (hint_num > currentHintsForLevel) {
        levelHints[lvl.toString()] = hint_num;
        globalHints += 1;
      }

      await supabase.from("teams").update({
        level_hints: levelHints,
        global_hints_used: globalHints
      }).eq("team_id", user.team_id);

      // Log activity
      await supabase.from("activity_logs").insert({
        message: `${team.team_name} decrypted Hint ${hint_num} for Level ${lvl} (-${hint_num === 1 ? '20' : '30'}% score penalty)`
      });

      console.log(`[hint] team_id=${user.team_id} level=${lvl} hint=${hint_num} total_hints=${globalHints}`);
      return NextResponse.json({ success: true, hint: hintText });
    }

    // ── submit ─────────────────────────────────────────────────────────────
    if (action === "submit") {
      // Rate-limit submissions per team_id: stops retry-storms during slowdowns
      const submitLimited = await checkRateLimit(submitRatelimit, `submit:${user.team_id}`);
      if (submitLimited) {
        console.warn(`[submit] rate-limited team_id=${user.team_id}`);
        return submitLimited;
      }

       const rawAnswer = formData.get("answer") as string;
       const rawProofUrl = formData.get("proofUrl") as string;
       const level_id_str = formData.get("level_id") as string;
       const level_id = parseInt(level_id_str, 10) || 1;
 
       const answer = (rawAnswer || "").trim();
       const proofUrl = (rawProofUrl || "").trim();
 
       if (!answer || !proofUrl) {
         return NextResponse.json({ error: "Answer and proof are required" }, { status: 400 });
       }
 
       const { data: teamData } = await supabase.from("teams").select("*").eq("team_id", user.team_id).single();
       if (!teamData) return NextResponse.json({ error: "Team not found" }, { status: 404 });
  
       // Prevent duplicate submission for levels 1-9
       if (level_id >= 1 && level_id <= 9) {
         const { data: existingSub } = await supabase
           .from("submissions")
           .select("id")
           .eq("team_id", user.team_id)
           .eq("level_id", level_id)
           .maybeSingle();

         if (existingSub) {
           console.warn(`[submit] duplicate submission blocked for team_id=${user.team_id} level=${level_id}`);
           return NextResponse.json({ error: "Mission already attempted. Action locked." }, { status: 400 });
         }
       }
 
       if (level_id === 10) {
         const attempts = teamData.level10_attempts || 0;
         if (attempts >= 2) {
           return NextResponse.json({ error: "MAXIMUM ATTEMPTS REACHED. MISSION LOCKED." }, { status: 403 });
         }
         if (answer.toUpperCase().trim() !== "ARCHLINUX") {
           await supabase.from("teams").update({ level10_attempts: attempts + 1 }).eq("team_id", user.team_id);
           const remaining = 2 - (attempts + 1);
           console.warn(`[submit] wrong level-10 answer team_id=${user.team_id} attempts=${attempts + 1}`);
           if (remaining <= 0) {
             return NextResponse.json({ error: "INCORRECT KEY. Maximum attempts reached. Mission locked." }, { status: 403 });
           } else {
             return NextResponse.json({ error: `INCORRECT KEY. You have ${remaining} chance(s) remaining.` }, { status: 400 });
           }
         }
       }
 
       // Store the submission for Admin review
       await supabase.from("submissions").insert({
         team_id: user.team_id,
         team_name: teamData.team_name,
         level_id: level_id,
         answer: answer.toUpperCase().trim(),
         proof_url: proofUrl,
         status: "pending"
       });

      // INSTANT ADVANCEMENT: User unlocks fragment immediately
      const POINTS_MAP = [100, 150, 220, 320, 450, 600, 800, 1050, 1350, 2000];
      const basePoints = POINTS_MAP[level_id - 1] || 1000;

      // Apply point penalty based on hints used for THIS level
      const hintsUsed = teamData.level_hints?.[level_id.toString()] || 0;
      let multiplier = 1.0;
      if (hintsUsed === 1) multiplier = 0.8; // -20%
      else if (hintsUsed >= 2) multiplier = 0.5; // -50%

      const scoreInc = Math.floor(basePoints * multiplier);
      const newScore = (teamData.score || 0) + scoreInc;

      // Fetch all non-rejected submissions for the team to dynamically compute fragments and avoid race conditions
      const { data: subs } = await supabase
        .from("submissions")
        .select("level_id, answer")
        .eq("team_id", user.team_id)
        .neq("status", "rejected");

      const fragments = Array(9).fill("");
      if (subs) {
        for (const s of subs) {
          const idx = s.level_id - 1;
          if (idx >= 0 && idx < 9) {
            const ARCH_FRAGS = ["A", "R", "C", "H", "L", "I", "N", "U", "X"];
            fragments[idx] = ARCH_FRAGS[idx];
          }
        }
      }

      const updatePayload: Record<string, unknown> = {
        score: newScore,
        last_submission_at: new Date().toISOString(),
        fragments,
        current_level: Math.max(teamData.current_level || 1, level_id + 1)
      };

      if (level_id === 9) {
        updatePayload.level10_started_at = new Date().toISOString();
      }

      await supabase.from("teams").update(updatePayload).eq("team_id", user.team_id);

      await supabase.from("activity_logs").insert({
        message: `${teamData.team_name} uploaded Intel for Level ${level_id}.`
      });

      console.log(
        `[submit] success team_id=${user.team_id} level=${level_id} ` +
        `score_delta=+${scoreInc} new_score=${newScore}`
      );
      return NextResponse.json({ success: true, message: `Submission for Level ${level_id} sent!` });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (error) {
    console.error("[dashboard/action] internal error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
