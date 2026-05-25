import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not configured" }, { status: 500 });
    }

    const { topic, format, tone } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are an expert Go-To-Market (GTM) Executive Recruiter and a LinkedIn Top Voice in the B2B SaaS industry.
Write a highly engaging LinkedIn post based on the following:

Topic: ${topic}
Format: ${format || "Standard Text Post"}
Tone: ${tone || "Professional and Insightful"}

Guidelines for the post:
- Start with a strong, scroll-stopping hook.
- Use formatting (bullet points, spacing) to make it easy to read.
- Provide real, actionable value or a thought-provoking perspective.
- End with a question to drive engagement and comments.
- Do NOT use cringey emojis (keep it professional).
- Include 3-4 highly relevant hashtags at the end.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ success: true, content: text }, { status: 200 });
  } catch (error: any) {
    console.error("AI Generation failed:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
