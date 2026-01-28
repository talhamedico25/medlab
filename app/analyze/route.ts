import { GoogleGenAI, Type } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    
    // 1. In @google/genai (v1+), we use a unified Client structure
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    
    // 2. Models are accessed through ai.models.generateContent
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
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

    // 3. The response text is accessed directly
    const resultText = response.text;
    return NextResponse.json(JSON.parse(resultText || "{}"));
    
  } catch (error: any) {
    console.error("Clinical Reasoning Error:", error);
    return NextResponse.json({ error: error.message || "Analysis failed" }, { status: 500 });
  }
}
