import { GoogleGenAI, SchemaType } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const genAI = new GoogleGenAI(process.env.API_KEY!);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro", // Note: use 'gemini-1.5-pro' as 'gemini-3' doesn't exist yet
    });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            summary: { type: SchemaType.STRING },
            considerations: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
            redFlagStatus: { type: SchemaType.STRING },
            redFlagDetails: { type: SchemaType.STRING },
            nextSteps: { type: SchemaType.STRING },
            medicalEducation: { type: SchemaType.STRING },
            isEmergencyOverride: { type: SchemaType.BOOLEAN }
          },
          required: ['summary', 'considerations', 'redFlagStatus', 'redFlagDetails', 'nextSteps', 'medicalEducation', 'isEmergencyOverride']
        }
      }
    });

    return NextResponse.json(JSON.parse(result.response.text()));
  } catch (error) {
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
