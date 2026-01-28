"use client"; // <--- THIS LINE IS THE FIX

import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

const CONFIG = {
  TITLE: 'Med-Symptom Assistant',
  SUBTITLE: 'Clinical Reasoning & Educational Health Tool',
  AUTHORS: 'Talha & Vareesha',
  INSTITUTION: 'Khyber Medical College, Peshawar',
  BATCH: 'Batch of 2030',
  MOTTO: 'Our Aim Is To Transform Patient Care In Pakistan',
  DISCLAIMER: 'This information is provided for educational and informational purposes only and does not constitute medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare professional with any questions regarding a medical condition. In case of emergency, contact local emergency services immediately.'
};

const Icons = {
  LinkedIn: () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>,
  Twitter: () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  Instagram: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
  Stethoscope: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M4.8 2.3A.3.3 0 1 0 5 2h0a2 2 0 0 0-2 2v12a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h0a.3.3 0 1 0 .2.3M9 16V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v11m-3 3a2 2 0 1 0 4 0 2 2 0 1 0-4 0z"/></svg>,
  Mic: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2m7 9v3m-4 0h8"/></svg>,
  Alert: () => <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
};

const FOUNDERS = [
  {
    name: 'Talha',
    role: 'Medical Lead & Founder',
    image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop',
    bio: 'Second-year medical student at KMC. Talha specializes in integrating AI within clinical workflows and diagnostic reasoning to empower healthcare providers in Pakistan.',
    social: { linkedin: '#', twitter: '#', instagram: '#' }
  },
  {
    name: 'Vareesha',
    role: 'Clinical Educator & Founder',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    bio: 'Second-year medical student at KMC. Vareesha is a public health advocate focused on pediatric health education and clinical awareness.',
    social: { linkedin: '#', twitter: '#', instagram: '#' }
  }
];

export default function Page() {
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
  if (!input.trim()) return;
  setIsAnalyzing(true);
  setError(null);
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ prompt: input }),
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    setResult(data);
  } catch (err) {
    setError("Analysis failed. Please try again.");
  } finally {
    setIsAnalyzing(false);
  }
};
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-16">
      {/* Navbar */}
      <nav className="flex items-center justify-between border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="bg-rose-600 p-2 rounded-xl text-white shadow-xl shadow-rose-900/40">
            <Icons.Stethoscope />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tighter">{CONFIG.TITLE}</h1>
            <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest">{CONFIG.INSTITUTION}</p>
          </div>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-sm font-black uppercase">{CONFIG.AUTHORS}</p>
          <p className="text-[10px] text-white/40 font-bold uppercase">{CONFIG.BATCH}</p>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-white/5 p-12 rounded-[3rem] border border-white/10 relative overflow-hidden">
        <div className="relative z-10">
          <span className="inline-block px-3 py-1 bg-rose-600/20 text-rose-500 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">Educational Reasoning Module</span>
          <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight tracking-tighter">Diagnostic Awareness <br/><span className="text-rose-600">& Clinical Logic.</span></h2>
          <p className="text-white/70 text-lg max-w-2xl leading-relaxed">Bridge clinical education with real-world scenarios. Designed by medical students to transform diagnostic literacy in Peshawar.</p>
        </div>
      </section>

      {/* Input */}
      <div className="bg-white/[0.02] p-10 rounded-[3rem] border border-white/10 shadow-2xl space-y-8">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Symptom & History Terminal</span>
          <Icons.Mic />
        </div>
        <textarea 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 50-year-old male with persistent retrosternal pain for 2 hours, known diabetic..."
          className="w-full bg-black border border-white/10 rounded-[2rem] p-8 text-white text-xl outline-none focus:border-rose-600/50 transition-all min-h-[200px]"
        />
        <div className="flex justify-between items-center">
          <button 
            onClick={handleAnalyze}
            disabled={isAnalyzing || !input.trim()}
            className="bg-rose-600 hover:bg-rose-500 disabled:bg-white/5 text-white font-black uppercase px-12 py-5 rounded-[2rem] transition-all text-xs tracking-widest"
          >
            {isAnalyzing ? 'Processing Logic...' : 'Analyze Pathways'}
          </button>
          {input && <button onClick={() => setInput('')} className="text-[10px] font-black text-white/20 uppercase tracking-widest hover:text-rose-500">Reset</button>}
        </div>
        {error && <p className="text-rose-500 text-xs font-bold text-center">{error}</p>}
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-700 pb-20">
          {result.isEmergencyOverride && (
            <div className="bg-rose-600 p-10 rounded-[3rem] flex gap-8 items-start border-4 border-rose-500/30">
              <Icons.Alert />
              <div>
                <h3 className="text-2xl font-black uppercase text-white mb-2">Emergency Override</h3>
                <p className="text-white font-bold text-lg opacity-90">{result.redFlagDetails}</p>
                <div className="mt-6 inline-block bg-white text-rose-600 px-6 py-3 rounded-2xl font-black text-xs uppercase">Call Emergency (1122) Now</div>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10">
              <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-6">01. Clinical Synthesis</h4>
              <p className="text-2xl font-black mb-8 leading-tight">{result.summary}</p>
              <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-4">02. Academic Considerations</h4>
              <ul className="space-y-3">
                {result.considerations.map((c: string, i: number) => (
                  <li key={i} className="bg-black/40 p-4 rounded-xl border-l-4 border-rose-600 font-bold text-sm text-white/80">{c}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10">
              <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-4">03. Red Flag Status</h4>
              <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${result.redFlagStatus === 'Normal' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                {result.redFlagStatus}
              </span>
              <p className="text-white/60 text-base mt-6 mb-10 font-medium">{result.redFlagDetails || "No acute triggers found."}</p>
              <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-4">04. Triage Steps</h4>
              <div className="bg-rose-600/10 p-8 rounded-[2rem] border border-rose-600/20">
                <p className="text-rose-500 font-black italic text-2xl tracking-tighter">{result.nextSteps}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 p-12 rounded-[4rem] border border-white/10">
            <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.6em] mb-10">05. Educational Context</h4>
            <p className="text-3xl font-serif italic text-white leading-relaxed opacity-95">{result.medicalEducation}</p>
            <div className="mt-16 pt-10 border-t border-white/5">
              <p className="text-[10px] text-white/20 font-bold uppercase max-w-2xl mx-auto italic leading-relaxed text-center">{CONFIG.DISCLAIMER}</p>
            </div>
          </div>
        </div>
      )}

      {/* Founders Section */}
      <section className="py-20 border-t border-white/5">
        <h2 className="text-center text-4xl font-black mb-16 uppercase tracking-tighter">The Visionaries</h2>
        <div className="grid md:grid-cols-2 gap-12">
          {FOUNDERS.map((f, i) => (
            <div key={i} className="bg-white/5 p-12 rounded-[4rem] border border-white/5 flex flex-col items-center text-center group">
              <div className="relative mb-10">
                <div className="w-56 h-56 rounded-full overflow-hidden border-[10px] border-black group-hover:border-rose-600/20 transition-all duration-500">
                  <img src={f.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={f.name} />
                </div>
                <div className="absolute bottom-0 right-0 bg-rose-600 w-16 h-16 rounded-full flex items-center justify-center border-8 border-black font-black text-[10px]">KMC</div>
              </div>
              <h3 className="text-4xl font-black mb-2">{f.name}</h3>
              <p className="text-rose-500 font-black text-[11px] uppercase tracking-widest mb-6">{f.role}</p>
              <p className="text-white/60 text-base leading-relaxed mb-10 font-medium italic opacity-80 max-w-sm">"{f.bio}"</p>
              <div className="flex gap-6">
                <a href={f.social.linkedin} className="p-4 bg-white/5 rounded-2xl text-white/20 hover:bg-rose-600 hover:text-white transition-all"><Icons.LinkedIn /></a>
                <a href={f.social.twitter} className="p-4 bg-white/5 rounded-2xl text-white/20 hover:bg-rose-600 hover:text-white transition-all"><Icons.Twitter /></a>
                <a href={f.social.instagram} className="p-4 bg-white/5 rounded-2xl text-white/20 hover:bg-rose-600 hover:text-white transition-all"><Icons.Instagram /></a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Motto */}
      <footer className="py-20 text-center border-t border-white/5">
        <h2 className="text-4xl md:text-6xl font-serif italic text-white/80 max-w-3xl mx-auto leading-tight mb-16">"{CONFIG.MOTTO}"</h2>
        <p className="text-[10px] text-white/10 font-black tracking-[1em] uppercase pb-10">Medbuddie System &copy; 2026</p>
      </footer>
    </div>
  );
}
