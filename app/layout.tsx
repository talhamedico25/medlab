
import React from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-rose-500/30">
      {children}
    </div>
  );
}
