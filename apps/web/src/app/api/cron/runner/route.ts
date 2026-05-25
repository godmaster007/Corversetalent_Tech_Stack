import { NextResponse } from "next/server";
import { prisma } from "@corversetalent/db";

// This would typically be called via Vercel Cron every hour
export async function GET(req: Request) {
  try {
    const pendingEmails = await prisma.campaignMember.findMany({
      where: {
        status: "active",
        nextExecutionAt: { lte: new Date() },
        currentStep: {
          type: "email"
        }
      },
      include: {
        currentStep: true,
        contact: true,
        campaign: true
      },
      take: 20 // Process batch of 20 emails
    });

    for (const member of pendingEmails) {
      if (!member.currentStep || !member.contact) continue;

      console.log(`[CronRunner] Sending email to ${member.contact.firstName} for campaign ${member.campaign.name}`);
      console.log(`Subject: ${member.currentStep.subject}`);
      // In a real app, integrate Resend or SendGrid here

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
    }

    return NextResponse.json({ 
      success: true, 
      processed: pendingEmails.length,
      message: `Processed ${pendingEmails.length} email tasks` 
    }, { status: 200 });
  } catch (error: any) {
    console.error("Cron runner failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
