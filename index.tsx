import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, Type } from "@google/genai";

// --- Configuration Data ---
const APP_CONFIG = {
  TITLE: 'Med-Symptom Assistant',
  INSTITUTION: 'Khyber Medical College, Peshawar',
  AUTHORS: 'Talha & Vareesha',
  BATCH: 'Batch of 2030',
  MOTTO: 'Our Aim Is To Transform Patient Care In Pakistan',
  DISCLAIMER: 'This information is provided for educational and informational purposes only and does not constitute medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare professional with any questions regarding a medical condition. In case of emergency, contact local emergency services immediately.'
};

const HOW_IT_WORKS = [
  { step: '01', title: 'Clinical Input', desc: 'User provides detailed symptoms, duration, and past medical history into the clinical console.' },
  { step: '02', title: 'AI Reasoning', desc: 'Our clinical logic engine processes the data through a rigorous academic medical framework.' },
  { step: '03', title: 'Educational Output', desc: 'The system generates considerations, triage status, and academic context for awareness.' }
];

const FOUNDERS = {
  talha: {
    name: 'Talha',
    image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop',
    bio: 'Second-year medical student at KMC. Talha leads the medical logic integration and software architecture, focusing on bridging clinical expertise with AI reasoning.',
    role: 'Founder & Medical Lead',
    social: { linkedin: '#', twitter: '#', instagram: '#' }
  },
  vareesha: {
    name: 'Vareesha',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    bio: 'Second-year medical student at KMC. Vareesha is a public health advocate dedicated to pediatric clinical reasoning and community health education in Peshawar.',
    role: 'Founder & Clinical Educator',
    social: { linkedin: '#', twitter: '#', instagram: '#' }
  }
};

const PAKISTAN_CONTEXT = [
  { title: 'Cardiovascular Load', desc: 'Hypertension is a massive burden in Pakistan, often undiagnosed.' },
  { title: 'Diabetes Prevalence', desc: 'Pakistan ranks globally high in Type 2 Diabetes cases.' },
  { title: 'Respiratory Safety', desc: 'Pollution and seasonal triggers significantly impact urban health.' }
];

// --- Icons & Vectors ---
const Icons = {
  LinkedIn: () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>,
  Twitter: () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  Instagram: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
  Stethoscope: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4.8 2.3A.3.3 0 1 0 5 2h0a2 2 0 0 0-2 2v12a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h0a.3.3 0 1 0 .2.3M9 16V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v11m-3 3a2 2 0 1 0 4 0 2 2 0 1 0-4 0z"/></svg>,
  Mic: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2m7 9v3m-4 0h8"/></svg>,
  Alert: () => <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>,
  Print: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 17h2a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2m2 4h6a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2zm8-12V5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v4"/></svg>
};

// --- App Component ---
function App() {
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: input,
        config: {
          systemInstruction: `You are a Medical Symptom Analysis assistant for Talha & Vareesha (KMC). 
          Frame everything educationally. Never diagnose. JSON only. Include isEmergencyOverride.`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              considerations: { type: Type.ARRAY, items: { type: Type.STRING } },
              redFlagStatus: { type: Type.STRING },
              redFlagDetails: { type: Type.STRING },
              nextSteps: { type: Type.STRING },
              medicalEducation: { type: Type.STRING },
              isEmergencyOverride: { type: Type.BOOLEAN }
            },
            required: ['summary', 'considerations', 'redFlagStatus', 'redFlagDetails', 'nextSteps', 'medicalEducation', 'isEmergencyOverride']
          }
        }
      });
      setResult(JSON.parse(response.text || '{}'));
    } catch (err) {
      setError("Clinical pathways could not be generated. Check your internet or description.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="glass-panel sticky top-0 z-50 px-6 py-4 no-print border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-rose-600 p-2 rounded-xl text-white shadow-lg shadow-rose-900/40">
              <Icons.Stethoscope />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white">{APP_CONFIG.TITLE}</h1>
              <p className="text-[10px] text-rose-500 font-black uppercase tracking-[0.2em]">{APP_CONFIG.INSTITUTION}</p>
            </div>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-sm font-black text-white uppercase tracking-widest">{APP_CONFIG.AUTHORS}</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{APP_CONFIG.BATCH}</p>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Clinical Interface */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Hero Section */}
            <section className="bg-slate-900/40 p-10 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <span className="inline-block px-3 py-1 bg-rose-600/10 text-rose-500 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">Education Reasoning Platform</span>
                <h2 className="text-4xl md:text-5xl font-black mb-6 text-white leading-tight tracking-tight">Clinical Reasoning Module</h2>
                <p className="text-slate-300 text-lg md:text-xl font-medium max-w-2xl opacity-90 leading-relaxed">
                  Bridge clinical education with real-world scenarios. Developed by Talha & Vareesha to enhance health literacy in Peshawar.
                </p>
              </div>
              <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
            </section>

            {/* Input Console */}
            <div className="glass-panel p-8 md:p-10 rounded-[2.5rem] no-print relative shadow-inner">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Symptom & History Description</span>
                <div className="p-2.5 rounded-lg bg-slate-800 text-slate-500">
                  <Icons.Mic />
                </div>
              </div>
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g. 55-year-old male with sharp chest pain for 30 minutes, history of smoking and hypertension..."
                className="w-full bg-slate-950 border-2 border-slate-800 rounded-3xl p-8 text-white outline-none focus:border-rose-600/40 transition-all min-h-[220px] text-xl font-medium placeholder:text-slate-700"
              />
              <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !input.trim()}
                  className="w-full md:w-auto bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 text-white font-black uppercase tracking-[0.2em] px-12 py-5 rounded-[2rem] transition-all shadow-2xl active:scale-95 text-sm"
                >
                  {isAnalyzing ? 'Processing Pathways...' : 'Initialize Reasoning Analysis'}
                </button>
                {input && <button onClick={() => setInput('')} className="text-[10px] text-slate-600 font-black uppercase tracking-widest hover:text-rose-500 transition-colors">Reset Input</button>}
              </div>
              {error && <p className="mt-6 text-rose-500 text-sm font-bold bg-rose-500/10 p-4 rounded-xl text-center">{error}</p>}
            </div>

            {/* How It Works Section */}
            <section className="py-12 no-print border-y border-slate-900">
              <h3 className="text-center text-[10px] font-black text-slate-600 uppercase tracking-[0.8em] mb-12">Clinical Academic Protocol</h3>
              <div className="grid md:grid-cols-3 gap-8 text-center">
                {HOW_IT_WORKS.map((h, i) => (
                  <div key={i} className="p-8 rounded-3xl border border-slate-900 bg-slate-900/20">
                    <div className="text-4xl font-black text-rose-600/20 mb-4">{h.step}</div>
                    <h4 className="text-white font-bold mb-2 uppercase text-sm tracking-widest">{h.title}</h4>
                    <p className="text-[11px] text-slate-500 font-bold leading-relaxed">{h.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Analysis Result Display */}
            {result && (
              <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 space-y-10 pb-20">
                {result.isEmergencyOverride && (
                  <div className="bg-rose-600 p-10 rounded-[3rem] flex gap-8 items-start shadow-2xl border-4 border-rose-500/30">
                    <div className="text-white"><Icons.Alert /></div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-black uppercase mb-2 text-white">Emergency Override</h3>
                      <p className="text-white font-bold text-xl leading-relaxed">{result.redFlagDetails}</p>
                      <div className="mt-6 inline-block bg-white text-rose-600 px-6 py-3 rounded-2xl font-black text-sm uppercase">Call 1122 / Emergency Services Now</div>
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="glass-panel p-10 rounded-[3rem]">
                    <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-6 underline decoration-rose-500/30 underline-offset-8">01. Symptom Summary</h4>
                    <p className="text-white font-black text-xl mb-10 leading-relaxed">{result.summary}</p>
                    <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-4 underline decoration-rose-500/30 underline-offset-8">02. Academic Considerations</h4>
                    <ul className="space-y-4">
                      {result.considerations.map((c: string, i: number) => (
                        <li key={i} className="bg-black p-5 rounded-2xl border-l-4 border-rose-600 text-white font-bold text-sm shadow-lg">{c}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="glass-panel p-10 rounded-[3rem]">
                    <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-4 underline decoration-rose-500/30 underline-offset-8">03. Red Flag Status</h4>
                    <div className="mb-6">
                      <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${result.redFlagStatus === 'Normal' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                        {result.redFlagStatus}
                      </span>
                    </div>
                    <p className="text-slate-300 text-base leading-relaxed mb-10 font-bold">{result.redFlagDetails || "No acute red flags identified based on history."}</p>
                    <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-4 underline decoration-rose-500/30 underline-offset-8">04. Suggested Triage</h4>
                    <div className="bg-rose-600/10 p-8 rounded-3xl border-2 border-rose-600/20">
                      <p className="text-rose-500 font-black italic text-2xl leading-snug tracking-tight">{result.nextSteps}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/50 p-12 rounded-[4rem] border border-slate-800 shadow-2xl">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.6em] mb-12">05. Educational Context</h4>
                  <p className="text-2xl md:text-3xl font-serif-display text-white leading-relaxed italic opacity-95">{result.medicalEducation}</p>
                  <div className="mt-16 pt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-10">
                    <p className="text-[10px] text-slate-500 max-w-lg italic font-bold leading-relaxed uppercase">
                      {APP_CONFIG.DISCLAIMER}
                    </p>
                    <button onClick={() => window.print()} className="flex items-center gap-3 text-rose-500 font-black text-xs uppercase tracking-widest hover:text-rose-400 transition-all no-print">
                      <Icons.Print /> Save Case Report
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Components */}
          <aside className="lg:col-span-4 space-y-12 no-print">
            <section className="glass-panel p-10 rounded-[2.5rem] shadow-2xl">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
                Regional Health Factors
              </h3>
              <div className="space-y-10">
                {PAKISTAN_CONTEXT.map((item, idx) => (
                  <div key={idx} className="group">
                    <h4 className="font-black text-rose-500 text-sm mb-2 uppercase tracking-wide group-hover:text-rose-400">
                      {idx + 1}. {item.title}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-bold">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-rose-600 p-12 rounded-[3rem] shadow-2xl shadow-rose-900/30 relative overflow-hidden group">
              <h3 className="font-serif-display text-3xl mb-6 text-white leading-tight">Founder's Mission</h3>
              <p className="text-base font-bold text-white leading-relaxed italic relative z-10 opacity-95">
                "{APP_CONFIG.MOTTO}"
              </p>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-[60px] group-hover:scale-125 transition-transform duration-1000"></div>
            </section>
          </aside>
        </div>
      </main>

      {/* Founders Section - Circular Frames & Intros */}
      <section className="py-40 bg-black border-t border-slate-900 no-print">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="font-serif-display text-6xl md:text-8xl italic text-white mb-6">The Visionaries</h2>
            <p className="text-rose-500 font-black text-xs uppercase tracking-[1em]">Second Year Med Students</p>
          </div>
          <div className="grid md:grid-cols-2 gap-20">
            {[FOUNDERS.talha, FOUNDERS.vareesha].map((f, i) => (
              <div key={i} className="glass-panel p-12 rounded-[4rem] group border-slate-900 hover:border-rose-500/20 transition-all duration-700">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-12">
                    <div className="w-56 h-56 rounded-full overflow-hidden founder-frame bg-slate-900 shadow-2xl">
                      <img src={f.image} alt={f.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" />
                    </div>
                    <div className="absolute -bottom-4 -right-4 bg-rose-600 w-16 h-16 rounded-full flex items-center justify-center text-white border-[6px] border-black shadow-xl font-black text-xs">
                      KMC
                    </div>
                  </div>
                  <h3 className="font-serif-display text-5xl text-white mb-2">{f.name}</h3>
                  <p className="text-rose-500 font-black text-[11px] uppercase tracking-[0.5em] mb-8">{f.role}</p>
                  <p className="text-slate-300 text-base leading-relaxed mb-12 font-bold opacity-80 max-w-sm">
                    "{f.bio}"
                  </p>
                  <div className="flex gap-6">
                    <a href={f.social.linkedin} className="p-4 bg-slate-900 rounded-2xl text-slate-500 hover:bg-rose-600 hover:text-white transition-all"><Icons.LinkedIn /></a>
                    <a href={f.social.twitter} className="p-4 bg-slate-900 rounded-2xl text-slate-500 hover:bg-rose-600 hover:text-white transition-all"><Icons.Twitter /></a>
                    <a href={f.social.instagram} className="p-4 bg-slate-900 rounded-2xl text-slate-500 hover:bg-rose-600 hover:text-white transition-all"><Icons.Instagram /></a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="py-24 bg-black border-t border-slate-900 text-center">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          <div className="flex justify-center gap-5 text-slate-800 opacity-30">
            <Icons.Stethoscope />
          </div>
          <p className="text-[10px] text-slate-700 font-black uppercase tracking-[0.2em] leading-relaxed max-w-2xl mx-auto">
            {APP_CONFIG.DISCLAIMER}
          </p>
          <div className="text-[11px] font-black text-slate-900 uppercase tracking-[0.8em] pt-12">
            &copy; 2026 Med-Symptom Assistant. Developed in Peshawar, Pakistan.
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- Mount App ---
const root = createRoot(document.getElementById('root')!);
root.render(<App />);
