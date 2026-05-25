import { NextResponse } from "next/server";
import { prisma } from "@corversetalent/db";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        content: data.content,
        topic: data.topic || null,
        format: data.format || null,
        tone: data.tone || null,
        status: data.status || "draft",
      }
    });

    return NextResponse.json({ success: true, post }, { status: 200 });
  } catch (error: any) {
    console.error("Failed to save post:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
