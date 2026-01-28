import { GoogleGenAI, Type } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    
    // The SDK now requires an object with the apiKey property
    const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash", 
    });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
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

    const responseText = await result.response.text();
    return NextResponse.json(JSON.parse(responseText));
  } catch (error) {
    console.error("Clinical Reasoning Error:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
