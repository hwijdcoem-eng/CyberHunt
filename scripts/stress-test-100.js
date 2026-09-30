require("dotenv").config({ path: ".env" });
const { createClient } = require("@supabase/supabase-js");
const { Redis } = require("@upstash/redis");
const { Ratelimit } = require("@upstash/ratelimit");

const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const redis = new Redis({
  url: redisUrl,
  token: redisToken,
});

function calculateStats(latencies) {
  if (latencies.length === 0) return { min: 0, max: 0, avg: 0, p95: 0, p99: 0 };
  const sorted = [...latencies].sort((a, b) => a - b);
  const sum = sorted.reduce((acc, val) => acc + val, 0);
  const avg = Math.round(sum / sorted.length);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const p95 = sorted[Math.floor(sorted.length * 0.95)] || max;
  const p99 = sorted[Math.floor(sorted.length * 0.99)] || max;
  return { min, max, avg, p95, p99 };
}

async function runTest(name, totalRequests, taskFn) {
  console.log(`\n${CYAN}════════════════════════════════════════════════════════════${RESET}`);
  console.log(`${BOLD}Running Test: ${name} (${totalRequests} concurrent requests)${RESET}`);
  console.log(`${CYAN}════════════════════════════════════════════════════════════${RESET}`);

  const startAll = Date.now();
  const promises = [];
  const latencies = [];
  let successes = 0;
  let failures = 0;
  const errorReasons = new Map();

  for (let i = 0; i < totalRequests; i++) {
    const id = i + 1;
    promises.push(
      (async () => {
        const start = Date.now();
        try {
          await taskFn(id);
          const duration = Date.now() - start;
          latencies.push(duration);
          successes++;
        } catch (err) {
          const duration = Date.now() - start;
          latencies.push(duration);
          failures++;
          const msg = err.message || String(err);
          errorReasons.set(msg, (errorReasons.get(msg) || 0) + 1);
        }
      })()
    );
  }

  await Promise.all(promises);
  const totalDuration = Date.now() - startAll;
  const stats = calculateStats(latencies);
  const reqPerSec = Math.round((totalRequests / (totalDuration / 1000)) * 10) / 10;

  console.log(`Result: ${successes === totalRequests ? GREEN : failures > 0 ? RED : YELLOW}${successes}/${totalRequests} succeeded (${Math.round((successes / totalRequests) * 100)}%)${RESET}`);
  console.log(`Total Time Taken: ${totalDuration} ms (~${reqPerSec} req/sec)`);
  console.log(`Latency — Avg: ${stats.avg}ms | Min: ${stats.min}ms | Max: ${stats.max}ms | P95: ${stats.p95}ms | P99: ${stats.p99}ms`);

  if (failures > 0) {
    console.log(`${RED}Errors encountered:${RESET}`);
    for (const [reason, count] of errorReasons.entries()) {
      console.log(`  - [${count}x]: ${reason}`);
    }
  }

  return { name, totalRequests, successes, failures, totalDuration, stats, reqPerSec };
}

async function main() {
  console.log(`${BOLD}${GREEN}================================================================${RESET}`);
  console.log(`${BOLD}${GREEN}   CYBERHUNT 100 CONCURRENT USERS STRESS & SURVIVAL TEST        ${RESET}`);
  console.log(`${BOLD}${GREEN}================================================================${RESET}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`Supabase URL: ${supabaseUrl}`);
  console.log(`Redis Host: ${redisUrl}`);

  const results = [];

  // =========================================================================
  // TEST 1: 100 CONCURRENT SUPABASE DATABASE QUERIES
  // Simulates 100 users loading their teams & dashboard concurrently
  // =========================================================================
  const dbResult = await runTest("1. Supabase Database: 100 Concurrent Team Queries", 100, async (id) => {
    // Select team or levels
    const teamId = `HWIJDCOEM${String((id % 76) + 1).padStart(3, "0")}`;
    const { data, error } = await supabase
      .from("teams")
      .select("team_id, team_name, score, current_level, leader_email")
      .eq("team_id", teamId)
      .single();

    if (error) throw new Error(error.message);
    if (!data) throw new Error("Team not found");
  });
  results.push(dbResult);

  // =========================================================================
  // TEST 2: 100 CONCURRENT REDIS CACHE & RATE LIMITING CHECKS
  // Simulates 100 users triggering sliding window rate-limiting simultaneously
  // =========================================================================
  const ratelimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(200, "60 s"),
    analytics: false,
  });

  const redisResult = await runTest("2. Upstash Redis: 100 Concurrent Rate-Limit Operations", 100, async (id) => {
    // Check rate limit for user
    const key = `stress_test_user_${id}_${Date.now()}`;
    const { success } = await ratelimiter.limit(key);
    if (!success) {
      throw new Error("Rate limit rejected (unexpected for high limit test)");
    }
  });
  results.push(redisResult);

  // =========================================================================
  // TEST 3: 100 CONCURRENT SUPABASE STORAGE BUCKET UPLOADS
  // Simulates 100 users submitting proof screenshots at the exact same second
  // =========================================================================
  const dummyImage = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    "base64"
  ); // 1x1 valid PNG

  const storageFilesToCleanup = [];

  const storageResult = await runTest("3. Supabase Storage Bucket ('proofs'): 100 Concurrent Image Uploads", 100, async (id) => {
    const fileName = `stress_test/user_${id}_${Date.now()}.png`;
    storageFilesToCleanup.push(fileName);

    const { error: uploadError } = await supabase.storage
      .from("proofs")
      .upload(fileName, dummyImage, {
        contentType: "image/png",
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    const { data: urlData } = supabase.storage.from("proofs").getPublicUrl(fileName);
    if (!urlData?.publicUrl) {
      throw new Error("Failed to get public URL");
    }
  });
  results.push(storageResult);

  // Cleanup uploaded test files
  console.log(`\n${YELLOW}Cleaning up ${storageFilesToCleanup.length} uploaded test files from 'proofs' bucket...${RESET}`);
  try {
    const { error: delError } = await supabase.storage
      .from("proofs")
      .remove(storageFilesToCleanup);
    if (delError) {
      console.warn(`Cleanup notice: ${delError.message}`);
    } else {
      console.log(`${GREEN}Test files cleaned up successfully from storage bucket.${RESET}`);
    }
  } catch (cleanErr) {
    console.warn(`Cleanup error:`, cleanErr.message);
  }

  // =========================================================================
  // TEST 4: 100 CONCURRENT HTTP REQUESTS TO LOCAL NEXT.JS SERVER
  // =========================================================================
  let webServerResult = null;
  try {
    webServerResult = await runTest("4. Next.js Web Server: 100 Concurrent HTTP Requests (/api/leaderboard)", 100, async (id) => {
      const res = await fetch("http://localhost:3000/api/leaderboard", {
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      if (!data.leaderboard) throw new Error("Missing leaderboard data in response");
    });
    results.push(webServerResult);
  } catch (httpErr) {
    console.log(`${YELLOW}Local server test skipped or note: ${httpErr.message}${RESET}`);
  }

  // =========================================================================
  // TEST 5: 100 CONCURRENT REAL USER LOGINS TO /api/auth/login
  // =========================================================================
  const fs = require("fs");
  const path = require("path");
  const usersPath = path.join(__dirname, "..", "users.json");
  const rawUsers = fs.readFileSync(usersPath, "utf8").replace(/^\uFEFF/, "");
  const allUsers = JSON.parse(rawUsers);

  let loginTestResult = null;
  try {
    loginTestResult = await runTest("5. Authentication: 100 Concurrent Real Logins (/api/auth/login)", 100, async (id) => {
      const user = allUsers[(id - 1) % allUsers.length];
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          team_id: user.password,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(`HTTP ${res.status}: ${body.error || res.statusText}`);
      }

      const data = await res.json();
      if (!data.team_name) throw new Error("Missing team_name in login response");
    });
    results.push(loginTestResult);
  } catch (loginErr) {
    console.log(`${YELLOW}Login stress test note: ${loginErr.message}${RESET}`);
  }

  // =========================================================================
  // OVERALL SURVIVAL VERDICT
  // =========================================================================
  console.log(`\n${BOLD}${CYAN}════════════════════════════════════════════════════════════${RESET}`);
  console.log(`${BOLD}${CYAN}               FINAL STRESS TEST SUMMARY SCORECARD          ${RESET}`);
  console.log(`${BOLD}${CYAN}════════════════════════════════════════════════════════════${RESET}`);

  let allPassed = true;
  for (const r of results) {
    const passed = r.failures === 0;
    if (!passed) allPassed = false;
    const icon = passed ? `${GREEN}✔ PASS${RESET}` : `${RED}✘ FAIL${RESET}`;
    console.log(`${icon} | ${r.name.padEnd(55)} | ${r.successes}/${r.totalRequests} ok | Avg: ${r.stats.avg}ms | P95: ${r.stats.p95}ms`);
  }

  console.log(`\n${BOLD}SURVIVAL VERDICT:${RESET} ${allPassed ? `${GREEN}${BOLD}YES, THE SYSTEM SURVIVES 100 CONCURRENT USERS! 🎉${RESET}` : `${YELLOW}${BOLD}PARTIAL BOTTLENECK DETECTED - REVIEW WARNINGS BELOW! ⚠️${RESET}`}\n`);
}

main().catch((err) => {
  console.error("Stress test runner error:", err);
  process.exit(1);
});
