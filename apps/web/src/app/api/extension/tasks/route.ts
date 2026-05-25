import { NextResponse } from "next/server";
import { prisma } from "@corversetalent/db";

export async function GET(req: Request) {
  try {
    const pendingTasks = await prisma.campaignMember.findMany({
      where: {
        status: "active",
        nextExecutionAt: { lte: new Date() },
        currentStep: {
          type: { startsWith: "linkedin_" }
        }
      },
      include: {
        currentStep: true,
        contact: true,
        campaign: true
      },
      take: 5 // Process a small batch to avoid overloading the browser
    });

    return NextResponse.json({ success: true, tasks: pendingTasks }, { status: 200 });
  } catch (error: any) {
    console.error("Failed to fetch extension tasks:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
