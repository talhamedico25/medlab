import React from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>MedBuddie | AI Health Assistant</title>
      </head>
      <body>
        <div className="min-h-screen bg-black text-white font-sans selection:bg-rose-500/30">
          {children}
        </div>
      </body>
    </html>
  );
}
