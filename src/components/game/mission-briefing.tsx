import React from "react";

interface MissionBriefingProps {
  missionId: number;
  title: string;
  desc: string;
  link: string;
}

export default function MissionBriefing({
  missionId,
  title,
  desc,
  link,
}: MissionBriefingProps) {
  return (
    <div className="bg-bg2 border border-border-g2 border-l-4 border-l-neon p-6 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <div className="font-orb text-[16px] font-bold text-neon tracking-[3px] mb-4 uppercase">
        {title}
      </div>
      <div className="font-raj text-[16px] leading-[1.7] text-text font-medium mb-6">
        {desc}
      </div>
      {link && link !== "#" && (
        <div className="mt-4">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
          {...(link.startsWith("/") ? { download: true } : {})}
          className="inline-flex items-center gap-2 font-mono text-[13px] text-[#00d4ff] no-underline border-b border-[#00d4ff44] pb-1 tracking-[1px] transition-colors hover:border-[#00d4ff] hover:text-[#00ffff]"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
          </svg>
          {link.startsWith("/") ? "DOWNLOAD CHALLENGE FILE" : link.toUpperCase()}
        </a>
      </div>
      )}
    </div>
  );
}
