export const MOCK_TEAM = {
  team_id: "TEAM-X7K92",
  team_name: "Byte Crushers",
  leader_name: "Agent Alpha",
  leader_email: "alpha@test.com",
  college_name: "Tech University",
  member_count: 2,
  members_json: [
    { name: "Agent Alpha", email: "alpha@test.com" },
    { name: "Agent Beta", email: "beta@test.com" },
  ],
  registered_at: "2026-07-01T10:00:00Z",
  is_disqualified: false,
  ai_strikes: 0,
  global_hints_used: 0,
};

export const MOCK_LEVELS = [
  {
    level_id: 1,
    title: "The Hidden Comment",
    challenge_type: "html_source",
    content_html: `<div class="challenge-content">
      <h2>Mission Brief: Operation Silent Echo</h2>
      <p>An anonymous informant has hidden a critical piece of intel somewhere on the CyberHunt platform. The message was never meant to be seen by human eyes — it was written for machines.</p>
      <p>Begin at the CyberHunt landing page. The answer is hidden in plain sight — but only if you know where to look.</p>
      <div class="challenge-instruction">
        <strong>Directive:</strong> The message is embedded in the page's metadata layer, not in the visible content. Use your browser's developer tools to investigate.
      </div>
    </div>`,
    answer_hash: "198245ffa8cfb9b043e0221bcede1275375295011890e992da3f12c70b5e386c",
    answer_salt: "a0a1f44308bd7ef3ef73fad02dbc9600",
    fragment: "CY",
    hint_1: "Every page has secrets. Not everything is meant to be displayed.",
    hint_2: "Look beyond the rendered content. The truth is in the source.",
    hint_3: 'Try View Page Source (Ctrl+U). Search for "CY" in the HTML head section.',
    success_message_html: "<p>ACCESS GRANTED. The next fragment is hidden in the commit history.</p>",
    is_active: true,
  },
  {
    level_id: 2,
    title: "The Dead End That Wasn't",
    challenge_type: "url_discovery",
    content_html: `<div class="challenge-content">
      <h2>Mission Brief: The Vanishing Path</h2>
      <p>A website error page is not always what it seems. Sometimes, the page you were never meant to visit holds the key to the next step.</p>
      <p>Use the pattern from Level 1's fragment to construct the hidden URL.</p>
      <div class="challenge-instruction">
        <strong>Directive:</strong> A 404 page hides more than an error. Follow the breadcrumbs — even the ones that look broken.
      </div>
    </div>`,
    answer_hash: "3b9a5d710324c45c909179c7c5ec138f44ab6a018626fefeb93c324218f1bfee",
    answer_salt: "2041fd79dc5d864a8a184e332dd10171",
    fragment: "BE",
    hint_1: "Not all 404 pages are mistakes. Some are placed there on purpose.",
    hint_2: "Look at the URL bar after the page loads. Did it change? Did it redirect?",
    hint_3: "The answer is on the final destination page after all redirects complete.",
    success_message_html: "<p>ACCESS GRANTED. Move to the dummy portal.</p>",
    is_active: true,
  },
  {
    level_id: 3,
    title: "The Forgotten Commit",
    challenge_type: "github_investigation",
    content_html: `<div class="challenge-content">
      <h2>Mission Brief: Digital Archaeology</h2>
      <p>In the world of version control, nothing is ever truly deleted. Every commit, every message, every change is recorded forever.</p>
      <p>A developer working on the CyberHunt project left a message buried deep in the repository's history.</p>
      <div class="challenge-instruction">
        <strong>Directive:</strong> Visit the @cyberhunt-hwijdcoem GitHub repository. The answer lies in a commit from 2 weeks ago.
      </div>
    </div>`,
    answer_hash: "0926d6ae7b93aa1ffc363db7f27a0dafa9eb91de864b9489f42410556040577a",
    answer_salt: "6ed4a5cf9203b844364e888797802d61",
    fragment: "RH",
    hint_1: "The latest code is not always where the secrets are buried.",
    hint_2: "Check the commit history, not the file browser.",
    hint_3: "Look at commits from 2 weeks ago specifically. Sort by date.",
    success_message_html: "<p>ACCESS GRANTED.</p>",
    is_active: true,
  },
  {
    level_id: 4,
    title: "The Encrypted Log",
    challenge_type: "logic_puzzle",
    content_html: `<div class="challenge-content">
      <h2>Mission Brief: Pattern Recognition</h2>
      <p>We've intercepted an encrypted log file from a classified server.</p>
      <pre class="log-file">LOG-001: X9F2-K3M8-PATTERN-ALPHA
LOG-002: B7N1-Q4R6-SECTOR-DELTA
LOG-003: W2T5-Y8J3-CIPHER-BRAVO
LOG-004: M6H9-L1D4-VECTOR-ECHO
LOG-005: F3K7-G2N5-SIGNAL-FOXTROT
LOG-006: R8V4-C6A1-CHANNEL-GAMMA</pre>
      <div class="challenge-instruction">
        <strong>Directive:</strong> Use the rule hidden in Level 3's fragment to determine which lines to extract.
      </div>
    </div>`,
    answer_hash: "f3c257d05d65c94c9f9e519003e33586df6bcbaf7c0f93d9a33df349048a14b7",
    answer_salt: "15bf474faf51392e5fb22169bf4f5e58",
    fragment: "UN",
    hint_1: "Not every line in the log matters. Some are decoys.",
    hint_2: "The rule is hidden in the fragment you earned from Level 3.",
    hint_3: "Even-numbered lines with a specific prefix. Check Level 3 fragment for the prefix.",
    success_message_html: "<p>ACCESS GRANTED.</p>",
    is_active: true,
  },
  {
    level_id: 5,
    title: "The Broken Code",
    challenge_type: "coding_challenge",
    content_html: `<div class="challenge-content">
      <h2>Mission Brief: Code Forensics</h2>
      <p>Two programs were intercepted. Both are broken — each has one deliberate error.</p>
      <div class="code-section">
        <h3>Program A — Python</h3>
        <pre class="code-block">def greet(name)  # something is missing
    print("Hello", name)

greet("Agent")</pre>
        <h3>Program B — JavaScript</h3>
        <pre class="code-block">const data = {
  mission: "find the key",
  agent: "classified"
  // something is missing

console.log(data.mission);</pre>
      </div>
      <div class="challenge-instruction">
        <strong>Directive:</strong> Fix both programs. Decode the cipher keys from their error output. Combine to form a URL. Visit it to find the answer.
      </div>
    </div>`,
    answer_hash: "f57f447ddc18fcf8c9ae1fa614646e7aad235b74dc4feb70486343e23ba250d5",
    answer_salt: "2061e36e35934543ad60163abaf9e8ed",
    fragment: "T_",
    hint_1: "Both programs are broken. Fix them. But also — read every line of the output carefully.",
    hint_2: "Error messages can carry more than just errors. Decode what you find in Program A's output first.",
    hint_3: "Two fragments, one URL. HWIJDCOEM has a professional presence online. Combine A then B.",
    success_message_html: "<p>ACCESS GRANTED.</p>",
    is_active: true,
  },
  {
    level_id: 6,
    title: "The Vault Package",
    challenge_type: "zip_challenge",
    content_html: `<div class="challenge-content">
      <h2>Mission Brief: Package Intercept</h2>
      <p>A compressed file package has been intercepted. It contains multiple files, but only one holds the real intelligence.</p>
      <p>The package is password-protected. The password is derived from the fragments you've collected in Levels 1-4.</p>
      <div class="challenge-instruction">
        <strong>Directive:</strong> Download the ZIP file. The password is a combination of your collected fragments.
      </div>
    </div>`,
    answer_hash: "dca9c69cc9f9f5adf69dc7ecead4f5703ba8f99adb934c757341ed3e1ce277a7",
    answer_salt: "2b4b22ed002cbdcc9f4012b3f8287866",
    fragment: "HU",
    hint_1: "You need fragments from earlier levels. Collect them first.",
    hint_2: "Combine fragments from Levels 1-4 in a specific order to form the password.",
    hint_3: "The ZIP contains 3 text files and 1 image. Only one file contains the real answer.",
    success_message_html: "<p>ACCESS GRANTED.</p>",
    is_active: true,
  },
  {
    level_id: 7,
    title: "The Hidden Metadata",
    challenge_type: "exif_base64",
    content_html: `<div class="challenge-content">
      <h2>Mission Brief: Digital Forensics</h2>
      <p>This image appears to be a standard CYBER HUNT classified document. But appearances can be deceiving.</p>
      <p>Every digital photograph carries invisible information — metadata that most people never see.</p>
      <div class="challenge-instruction">
        <strong>Directive:</strong> The image on this page contains hidden data in its EXIF metadata. Extract and decode it.
      </div>
    </div>`,
    answer_hash: "9d33355fffa3946dbccf59ab7d2db1a5cd45b26854aa8be5ae55e639345c2dd7",
    answer_salt: "c96d11e5cffbaabd3289cc3254f37923",
    fragment: "NT",
    hint_1: "Every photo remembers more than you see.",
    hint_2: "Metadata is data about data. Images have it too.",
    hint_3: "Try EXIF. Comment field. Then decode what you find. Base64 then ROT13.",
    success_message_html: "<p>ACCESS GRANTED.</p>",
    is_active: true,
  },
  {
    level_id: 8,
    title: "The Leaked Database",
    challenge_type: "db_investigation",
    content_html: `<div class="challenge-content">
      <h2>Mission Brief: Data Breach Analysis</h2>
      <p>We've intercepted a leaked database dump. One record contains a hash that doesn't match any known encryption.</p>
      <pre class="db-dump">{"id":1,"name":"viper","key":"a1b2c3d4e5"}
{"id":2,"name":"shadow","key":"f6g7h8i9j0"}
{"id":3,"name":"phantom","key":"k1l2m3n4o5"}
{"id":4,"name":"cipher","key":"2d4f6a8c1e"}</pre>
      <div class="challenge-instruction">
        <strong>Directive:</strong> Cross-reference the key field with the rainbow table. Find which key is an MD5 hash of a common word.
      </div>
    </div>`,
    answer_hash: "a43d979096c19fd081092374d635f1ebc8b3bf355c022b2bfc9f974a450fa2a9",
    answer_salt: "8f52752b0d9f9e553373239150d01629",
    fragment: "ER",
    hint_1: "Not all records are equal. One stands out from the rest.",
    hint_2: 'The "key" field looks random, but one is actually an MD5 hash.',
    hint_3: "Use an MD5 lookup tool on each key value. One will match a common English word.",
    success_message_html: "<p>ACCESS GRANTED.</p>",
    is_active: true,
  },
  {
    level_id: 9,
    title: "The Silent Function",
    challenge_type: "hidden_function",
    content_html: `<div class="challenge-content">
      <h2>Mission Brief: Code Investigation</h2>
      <p>This page appears to be a static mission briefing. But not everything that exists in code is meant to be called automatically.</p>
      <p>Somewhere in this page's JavaScript, a function waits to be discovered.</p>
      <div class="challenge-instruction">
        <strong>Directive:</strong> Open your browser's Developer Console (F12 then Console). Look for a function that was defined but never invoked.
      </div>
    </div>`,
    answer_hash: "ee51f6295531ce525790434f947197b4bb887113cf2c9df332cbf5d44261ae17",
    answer_salt: "473347b68ab77c7b35c31731f12c5e06",
    fragment: "S_",
    hint_1: "Not every function is called automatically.",
    hint_2: "Check the browser console for something that was defined but never executed.",
    hint_3: "Look for a function called revealMission(). Type revealMission() in the console and press Enter.",
    success_message_html: "<p>ACCESS GRANTED.</p>",
    is_active: true,
  },
  {
    level_id: 10,
    title: "The Final Decryption",
    challenge_type: "final_boss",
    content_html: `<div class="challenge-content">
      <h2>Mission Brief: Operation CYBERHUNT</h2>
      <p>You've collected all the fragments. Now it's time to assemble the final key.</p>
      <div class="cipher-key">
        <h3>Decryption Protocol:</h3>
        <ul>
          <li>Order the fragments by their level number in REVERSE</li>
          <li>Concatenate all fragments in that order</li>
          <li>Remove any underscores (_)</li>
          <li>The result is your final answer</li>
        </ul>
      </div>
    </div>`,
    answer_hash: "654db4a6442afb02d22d17fa4db3ce07664acc47574834ba89e25f60905e7a85",
    answer_salt: "6aac257d350259e73da3a45cfb58422c",
    fragment: "",
    hint_1: "You have all the fragments. Check your inventory.",
    hint_2: "Reverse the level order: Level 10 first, Level 1 last.",
    hint_3: "Assemble: fragment_10 + fragment_9 + ... + fragment_1. Remove underscores.",
    success_message_html: "<p>ACCESS GRANTED. OPERATION BLACKOUT COMPLETE.</p>",
    is_active: true,
  },
];

export const MOCK_PROGRESS = [
  { team_id: "TEAM-X7K92", level_id: 1, started_at: "2026-06-25T10:00:00Z", solved_at: null, attempts: 0, hints_used: [] },
];

export const MOCK_LEADERBOARD = [
  { rank: 1, team_name: "Cyber Wolves", team_id: "TEAM-A92LM", levels_solved: 8 },
  { rank: 2, team_name: "Byte Crushers", team_id: "TEAM-X7K92", levels_solved: 4 },
  { rank: 3, team_name: "Neon Hackers", team_id: "TEAM-Z4KQ8", levels_solved: 4 },
  { rank: 4, team_name: "Pixel Phantoms", team_id: "TEAM-M3N7R", levels_solved: 3 },
  { rank: 5, team_name: "Code Breakers", team_id: "TEAM-B8V2T", levels_solved: 2 },
  { rank: 6, team_name: "Data Drifters", team_id: "TEAM-K5W9P", levels_solved: 1 },
  { rank: 7, team_name: "Binary Bandits", team_id: "TEAM-R6J4H", levels_solved: 0 },
];

export const MOCK_EVENT_SETTINGS = {
  id: 1,
  event_start: "2026-06-20T10:00:00Z",
  event_end: "2026-12-31T11:30:00Z",
  is_paused: false,
  paused_at: null,
  total_paused_ms: 0,
  registration_open: true,
  results_published: false,
};

export const MOCK_HINTS: Record<number, { hint_1: string; hint_2: string; hint_3: string }> = {
  1: { hint_1: "Every page has secrets.", hint_2: "Look beyond the rendered content.", hint_3: 'Try View Page Source (Ctrl+U).' },
  2: { hint_1: "Not all 404 pages are mistakes.", hint_2: "Look at the URL bar after the page loads.", hint_3: "The answer is on the final destination page." },
  3: { hint_1: "The latest code is not always where secrets are.", hint_2: "Check the commit history, not the file browser.", hint_3: "Look at commits from 2 weeks ago." },
  4: { hint_1: "Not every line in the log matters.", hint_2: "The rule is hidden in the fragment from Level 3.", hint_3: "Even-numbered lines with a specific prefix." },
  5: { hint_1: "Both programs are broken. Fix them.", hint_2: "Decode what you find in Program A's output first.", hint_3: "Two fragments, one URL. HWIJDCOEM has a professional presence." },
  6: { hint_1: "You need fragments from earlier levels.", hint_2: "Combine fragments from Levels 1-4.", hint_3: "Only one file in the ZIP is real." },
  7: { hint_1: "Every photo remembers more than you see.", hint_2: "Metadata is data about data.", hint_3: "Try EXIF. Comment field. Base64 then ROT13." },
  8: { hint_1: "Not all records are equal.", hint_2: "One key is actually an MD5 hash.", hint_3: "Use an MD5 lookup tool on each key." },
  9: { hint_1: "Not every function is called automatically.", hint_2: "Check the browser console.", hint_3: "Type revealMission() in the console." },
  10: { hint_1: "You have all the fragments.", hint_2: "Reverse the level order.", hint_3: "Assemble in reverse. Remove underscores." },
};

export const MOCK_FRAGMENTS = [
  { level_id: 1, value: "CY" },
  { level_id: 2, value: "BE" },
  { level_id: 3, value: "RH" },
  { level_id: 4, value: "UN" },
];

export function isMockMode(): boolean {
  return !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === "";
}
