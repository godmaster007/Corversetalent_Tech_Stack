import { NextResponse } from "next/server";
import { prisma } from "@corversetalent/db";

export async function POST(req: Request) {
  try {
    const { campaignMemberId } = await req.json();

    if (!campaignMemberId) {
      return NextResponse.json({ error: "campaignMemberId is required" }, { status: 400 });
    }

    const member = await prisma.campaignMember.findUnique({
      where: { id: campaignMemberId },
      include: { currentStep: true, campaign: true }
    });

    if (!member || !member.currentStep) {
      return NextResponse.json({ error: "Invalid campaign member or step" }, { status: 400 });
    }

    // Find the next step in the sequence
    const nextStep = await prisma.sequenceStep.findFirst({
      where: {
        sequenceId: member.campaign.sequenceId,
        orderIndex: { gt: member.currentStep.orderIndex }
      },
      orderBy: { orderIndex: "asc" }
    });

    if (nextStep) {
      // Advance to next step
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + nextStep.delayDays);

      await prisma.campaignMember.update({
        where: { id: member.id },
        data: {
          currentStepId: nextStep.id,
          nextExecutionAt: nextDate
        }
      });
    } else {
      // Sequence completed
      await prisma.campaignMember.update({
        where: { id: member.id },
        data: {
          status: "completed",
          nextExecutionAt: null
        }
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Failed to complete task:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
