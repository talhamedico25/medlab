import { GoogleGenAI, Type } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    
    // 1. Initialize with the correct API Key object
    const genAI = new GoogleGenAI(process.env.API_KEY!);
    
    // 2. Use the correct method to get the model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash", // Using Flash for speed and clinical logic
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

    const textResponse = await result.response.text();
    return NextResponse.json(JSON.parse(textResponse));
  } catch (error) {
    console.error("Clinical Reasoning Error:", error);
    return NextResponse.json({ error: "Analysis failed. Please try again." }, { status: 500 });
  }
}
