import "./globals.css";

// Avoid importing Next internal metadata types on build servers where
// type resolution can fail. Export untyped metadata so `next build`
// doesn't pull in internal type declarations.
export const metadata = {
  title: "Operation Vault | CyberHunt",
  description: "A cybersecurity CTF event by HWIJDCOEM. 10 levels. 90 minutes. Can you crack the code?",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Orbitron:wght@400;500;700;900&family=Share+Tech+Mono&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
