"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RulesPage() {
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleProceed = () => {
    if (!accepted) return;
    setLoading(true);
    // Add brief artificial delay to simulate secure terminal boot sequence
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-bg bg-grid-pattern flex flex-col font-mono relative overflow-hidden text-sm">
      
      <header className="flex items-center justify-between px-8 py-6 relative z-10 border-b border-surface2">
        <div className="font-display text-xl font-bold tracking-widest text-accent">
          <span className="text-white mr-2">O</span>HWIJDCOEM
        </div>
        <div className="text-text2 tracking-widest text-xs">SECURE ONBOARDING</div>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto px-8 py-12 relative z-10 flex flex-col justify-center">
        
        <div className="bg-surface border border-border/30 rounded-xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-md relative">
          
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50"></div>

          <h1 className="font-display text-3xl font-bold text-white mb-2 uppercase tracking-widest text-glow-white">
            Rules of Engagement
          </h1>
          <p className="text-accent text-xs tracking-widest mb-8 border-b border-surface2 pb-4">
            READ CAREFULLY BEFORE PROCEEDING
          </p>

          <div className="space-y-6 text-text2 leading-relaxed mb-8">
            <div className="flex gap-4">
              <span className="text-accent font-bold mt-0.5">01</span>
              <div>
                <h3 className="text-white font-bold tracking-widest mb-1">AI Strike System</h3>
                <p>You may use any tools at your disposal, including AI. However, if our system detects excessive or direct copy-pasting from AI outputs to bypass the hunt, you will receive a strike. <span className="text-red font-bold">Accumulating 3 AI Strikes results in immediate team elimination.</span></p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="text-accent font-bold mt-0.5">02</span>
              <div>
                <h3 className="text-white font-bold tracking-widest mb-1">Boundary Limits</h3>
                <p>Clues are scattered across the real internet, including HWIJDCOEM social media pages and GitHub repositories. <span className="text-white">Note:</span> The hidden clues will NEVER explicitly mention the word "HWIJDCOEM".</p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="text-accent font-bold mt-0.5">03</span>
              <div>
                <h3 className="text-white font-bold tracking-widest mb-1">Mandatory Proof Upload</h3>
                <p>To successfully clear a level, submitting the correct answer is not enough. You <span className="text-white font-bold uppercase">MUST</span> upload a valid screenshot proving exactly where and how you found the clue. Fake proofs will result in a strike.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="text-amber font-bold mt-0.5">04</span>
              <div>
                <h3 className="text-amber font-bold tracking-widest mb-1">Hint Penalty Policy</h3>
                <p>
                  If your team gets stuck, you may request hints from the Mission Control Dashboard.
                  <br />
                  <br />
                  • Hint 1 deducts 20% from your final score.
                  <br />
                  • Hint 2 deducts 30% from your final score.
                  <br />
                  • If you use both Hint 1 and Hint 2, a total of 50% will be deducted from your final score.
                  <br />
                  <br />
                  Hints are optional but cannot be undone. Use them wisely.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="text-accent font-bold mt-0.5">05</span>
              <div>
                <h3 className="text-white font-bold tracking-widest mb-1">Official Communications</h3>
                <p>Keep the official HWIJDCOEM website handy for potential deep-dives: <Link href="https://techalfa-website-ivory.vercel.app/" target="_blank" className="text-blue hover:text-white transition-colors underline decoration-blue/30 underline-offset-4">techalfa-website-ivory.vercel.app</Link></p>
              </div>
            </div>
          </div>

          <div className="bg-surface2 p-4 rounded-lg border border-border/10 mb-8 flex items-start gap-4 cursor-pointer hover:border-accent/40 transition-colors" onClick={() => setAccepted(!accepted)}>
            <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${accepted ? 'bg-accent border-accent text-bg' : 'border-text3 bg-transparent'}`}>
              {accepted && (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <p className="text-white font-bold uppercase tracking-widest text-xs leading-relaxed select-none">
              I acknowledge the Terms of Engagement. I understand the AI Strike elimination policy and the Hint Score penalties.
            </p>
          </div>

          <button
            onClick={handleProceed}
            disabled={!accepted || loading}
            className={`w-full py-4 rounded-lg font-bold tracking-widest uppercase transition-all flex justify-center items-center gap-2
              ${accepted 
                ? 'bg-accent text-bg hover:bg-[#00e67a] hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] cursor-pointer' 
                : 'bg-surface2 text-text3 cursor-not-allowed border border-surface2'
              }`}
          >
            {loading ? "INITIALIZING DASHBOARD..." : "PROCEED TO DASHBOARD ►"}
          </button>

        </div>

      </main>

    </div>
  );
}
