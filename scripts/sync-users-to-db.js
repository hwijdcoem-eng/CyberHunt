require('dotenv').config({ path: '.env' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase URL or Key in .env!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function syncUsers() {
  const usersPath = path.join(__dirname, '..', 'users.json');
  if (!fs.existsSync(usersPath)) {
    console.error("users.json not found at:", usersPath);
    process.exit(1);
  }

  const raw = fs.readFileSync(usersPath, 'utf8').replace(/^\uFEFF/, '');
  const users = JSON.parse(raw);
  console.log(`Loaded ${users.length} users from users.json`);

  const teams = users.map(u => ({
    team_id: u.password.trim(),
    team_name: u.name.trim(),
    leader_email: (u.email || u.id).trim().toLowerCase(),
    fragments: ["", "", "", "", "", "", "", "", ""],
    score: 0,
    current_level: 1,
    ai_strikes: 0,
    global_hints_used: 0,
    level_hints: {},
    is_disqualified: false
  }));

  console.log(`Upserting ${teams.length} teams to Supabase teams table...`);
  
  const batchSize = 50;
  for (let i = 0; i < teams.length; i += batchSize) {
    const batch = teams.slice(i, i + batchSize);
    const { error } = await supabase.from('teams').upsert(batch, { onConflict: 'team_id' });
    if (error) {
      console.error(`Error in batch ${i / batchSize + 1}:`, error.message);
    } else {
      console.log(`Batch ${Math.floor(i / batchSize) + 1} (${batch.length} teams) upserted successfully.`);
    }
  }

  console.log("Sync complete!");
}

syncUsers().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
