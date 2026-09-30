"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LandingPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", team_id: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    const teamIdParam = params.get("team_id");
    if (emailParam && teamIdParam) {
      const cleanEmail = decodeURIComponent(emailParam);
      const cleanTeamId = decodeURIComponent(teamIdParam);
      setForm({ email: cleanEmail, team_id: cleanTeamId });

      const autoLogin = async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: cleanEmail, team_id: cleanTeamId })
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Login failed");
          router.push("/rules");
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      autoLogin();
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      router.push("/rules");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg bg-grid-pattern flex flex-col font-sans relative overflow-hidden">
      
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 relative z-10">
        <Link href="/admin/login" className="font-display text-xl font-bold tracking-widest text-accent hover:text-white transition-colors cursor-pointer">
          <span className="text-white mr-2">O</span>HWIJDCOEM
        </Link>
        <Link href="/leaderboard" className="text-text2 hover:text-white text-sm tracking-widest uppercase transition-colors">
          Leaderboard
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left Column (Hero text) */}
        <div>
          <div className="inline-flex items-center gap-2 border border-amber/50 bg-amber/10 px-3 py-1 mb-8">
            <span className="text-amber">⚡</span>
            <span className="text-amber text-xs font-bold tracking-widest uppercase">Classified</span>
          </div>
          
          <h1 className="font-display flex flex-col gap-1 mb-6">
            <span className="text-6xl md:text-7xl font-black text-neon text-glow-green uppercase leading-none">
              Operation
            </span>
            <span className="text-5xl md:text-6xl font-bold text-white text-glow-white uppercase leading-none">
              HWIJDCOEM Vault
            </span>
          </h1>
          
          <p className="text-text2 text-lg md:text-xl max-w-md leading-relaxed mb-12">
            An online cybersecurity treasure hunt. Solve challenges across the web, outsmart the system, and unlock the vault. You have 90 minutes.
          </p>

          <div className="flex items-center gap-10">
            <div>
              <div className="text-3xl font-display font-bold text-accent text-glow mb-1">10</div>
              <div className="text-text3 text-xs tracking-widest">LEVELS</div>
            </div>
            <div className="w-px h-10 bg-surface2"></div>
            <div>
              <div className="text-3xl font-display font-bold text-accent text-glow mb-1">90</div>
              <div className="text-text3 text-xs tracking-widest">MINUTES</div>
            </div>
            <div className="w-px h-10 bg-surface2"></div>
            <div>
              <div className="text-3xl font-display font-bold text-accent text-glow mb-1">7040</div>
              <div className="text-text3 text-xs tracking-widest">MAX SCORE</div>
            </div>
          </div>
        </div>

        {/* Right Column (Form Card) */}
        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-md bg-surface border border-surface2 rounded-xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-sm">
            {/* Soft background glow inside card */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-accent/5 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="mb-8">
              <div className="text-accent text-xs font-mono mb-2">// AGENT ONBOARDING</div>
              <h2 className="text-3xl font-display font-bold text-white">Join the Mission</h2>
              <p className="text-text3 text-sm mt-2">Fill in your team credentials to begin.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red/10 border border-red/20 text-red text-sm rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              <div>
                <label className="block text-text2 text-xs mb-2 tracking-widest">Leader Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="agent@hwijdcoem.com"
                  className="w-full bg-surface2/50 border border-border/20 rounded-lg px-4 py-3 text-white placeholder-text3 focus:outline-none focus:border-accent transition-colors font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-text2 text-xs mb-2 tracking-widest">Team ID</label>
                <input
                  type="text"
                  name="team_id"
                  value={form.team_id}
                  onChange={handleChange}
                  required
                  placeholder="TEAM-XXXXX"
                  className="w-full bg-surface2/50 border border-border/20 rounded-lg px-4 py-3 text-white placeholder-text3 focus:outline-none focus:border-accent transition-colors font-mono text-sm uppercase"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-bg font-bold tracking-widest uppercase py-4 rounded-lg mt-4 hover:bg-[#00e67a] hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] transition-all flex justify-center items-center gap-2"
              >
                {loading ? "Authenticating..." : "Start Mission ►"}
              </button>
            </form>

            <div className="text-center mt-6">
              <p className="text-text3 text-xs tracking-widest">SYSTEM LOCKED & SECURE</p>
            </div>
          </div>
        </div>

      </main>

      {/* Decorative gradient orb behind everything */}
      <div className="fixed top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[150px] pointer-events-none z-0"></div>

    </div>
  );
}
