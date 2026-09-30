import React from "react";
import { AlertTriangle } from "lucide-react";

interface SubmissionControlProps {
  selectedMission: number;
  submission: string;
  setSubmission: (val: string) => void;
  proofFile: File | null;
  setProofFile: (file: File | null) => void;
  submitting: boolean;
  timeLeft: string;
  isCurrentMissionSolved: boolean;
  hasAttempted: boolean;
  level10Attempts: number;
  onSubmit: (e: React.FormEvent) => void;
}

export default function SubmissionControl({
  selectedMission,
  submission,
  setSubmission,
  proofFile,
  setProofFile,
  submitting,
  timeLeft,
  isCurrentMissionSolved,
  hasAttempted,
  level10Attempts,
  onSubmit,
}: SubmissionControlProps) {
  return (
    <div className="mt-2 pt-2">
      <div className="font-orb text-[10px] font-bold tracking-[6px] text-text2 text-center p-[8px_0] mb-4 relative">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-border-g2 -z-10"></div>
        <span className="bg-bg0 px-4">— TRANSMIT SOLUTION —</span>
      </div>

      {isCurrentMissionSolved ? (
        <div className="bg-[rgba(0,255,136,0.05)] border border-[rgba(0,255,136,0.3)] p-4 text-center">
          <div className="font-orb text-[12px] text-neon font-bold tracking-[3px] mb-1">
            ✅ MISSION SOLVED
          </div>
          <div className="font-mono text-[10px] text-text2 tracking-[1px]">
            Fragment has been successfully secured for this sector.
          </div>
        </div>
      ) : hasAttempted && selectedMission !== 10 ? (
        <div className="bg-red/5 border border-red/30 p-4 text-center">
          <div className="font-orb text-[12px] text-red font-bold tracking-[3px] mb-1">
            🔒 MISSION LOCKED
          </div>
          <div className="font-mono text-[10px] text-text2 tracking-[1px]">
            You have already exhausted your single attempt for this mission.
          </div>
        </div>
      ) : (
        <>
          {selectedMission === 10 && (
            <div
              className={`font-mono text-[10px] mb-4 text-center p-2 rounded-sm tracking-widest ${
                level10Attempts >= 2
                  ? "bg-red/20 text-red border border-red/30"
                  : "bg-amber/10 text-amber border border-amber/30"
              }`}
            >
              {level10Attempts >= 2
                ? "❌ MAXIMUM ATTEMPTS REACHED. MISSION LOCKED."
                : `⚠️ WARNING: ${2 - level10Attempts} CHANCE(S) REMAINING`}
            </div>
          )}
          <form
            onSubmit={onSubmit}
            className="flex gap-3 items-stretch bg-bg2 p-4 border border-border-g2 shadow-lg"
          >
            <input
              type="text"
              value={submission}
              onChange={(e) => setSubmission(e.target.value)}
              required
              maxLength={selectedMission === 10 ? 20 : 1}
              placeholder={
                selectedMission === 10
                  ? "ENTER MASTER KEY..."
                  : "ENTER SECURED FRAGMENT (1 LETTER)..."
              }
              className="flex-1 bg-bg3 border border-border-g2 text-neon font-mono text-[16px] font-bold p-[12px_16px] outline-none tracking-[2px] placeholder:text-text2 placeholder:opacity-50 focus:border-neon transition-colors uppercase"
              disabled={submitting || (selectedMission === 10 && level10Attempts >= 2)}
            />
            {selectedMission !== 10 && (
              <div className="relative flex items-center justify-center border border-dashed border-border-g2 bg-bg3 px-5 hover:border-neon transition-colors group cursor-pointer overflow-hidden min-w-[160px]">
                <input
                  type="file"
                  required
                  accept="image/png, image/jpeg"
                  onChange={(e) =>
                    setProofFile(e.target.files ? e.target.files[0] : null)
                  }
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  disabled={submitting}
                />
                <div className="flex flex-col items-center justify-center z-0 pointer-events-none">
                  <span className="font-orb text-[10px] font-bold tracking-[2px] text-text2 group-hover:text-white transition-colors">
                    {proofFile
                      ? proofFile.name.substring(0, 15) +
                        (proofFile.name.length > 15 ? "..." : "")
                      : "UPLOAD PROOF"}
                  </span>
                  <span className="font-mono text-[9px] text-text2 opacity-60 mt-1">
                    {proofFile ? "READY" : "JPG / PNG"}
                  </span>
                </div>
              </div>
            )}
            <button
              type="submit"
              disabled={
                submitting ||
                timeLeft === "00:00" ||
                (selectedMission === 10 && level10Attempts >= 2)
              }
              className="bg-neon text-black border-none font-orb text-[12px] font-bold tracking-[3px] p-[0_24px] cursor-pointer transition-colors hover:bg-[#00ffaa] hover:shadow-[0_0_15px_rgba(0,255,136,0.4)] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {submitting ? "TRANSMITTING..." : "SUBMIT"}
            </button>
          </form>
          <div className="mt-3 flex items-center justify-center gap-1.5 text-amber">
            <AlertTriangle size={12} />
            <span className="font-mono text-[10px] tracking-[1px] uppercase">
              {selectedMission === 10
                ? "2 attempts permitted for Master Key — No image proof required"
                : "1 submission per mission — Proof upload required"}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
