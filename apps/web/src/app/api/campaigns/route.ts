import { NextResponse } from "next/server";
import { prisma } from "@corversetalent/db";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, sequenceId, contactIds } = data;

    if (!name || !sequenceId || !contactIds || !Array.isArray(contactIds)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get the first step of the sequence to assign as currentStepId
    const firstStep = await prisma.sequenceStep.findFirst({
      where: { sequenceId },
      orderBy: { orderIndex: "asc" }
    });

    const campaign = await prisma.campaign.create({
      data: {
        name,
        sequenceId,
        status: "active",
        members: {
          create: contactIds.map((contactId: string) => ({
            contactId,
            currentStepId: firstStep?.id || null,
            status: "active",
            nextExecutionAt: new Date() // Start immediately
          }))
        }
      }
    });

    return NextResponse.json({ success: true, campaign }, { status: 200 });
  } catch (error: any) {
    console.error("Failed to create campaign:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
