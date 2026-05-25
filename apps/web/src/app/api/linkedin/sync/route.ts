import { NextResponse } from "next/server";
import { prisma } from "@corversetalent/db";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Validate data
    if (!data.name && !data.linkedinUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Attempt to split name simply
    const nameParts = data.name ? data.name.split(" ") : ["Unknown"];
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

    // Extract LinkedIn ID from URL if possible
    let linkedinId = null;
    if (data.linkedinUrl) {
      const match = data.linkedinUrl.match(/linkedin\.com\/in\/([^/?]+)/);
      if (match && match[1]) {
        linkedinId = match[1];
      }
    }

    // Upsert Candidate (update if exists by linkedinId, otherwise create)
    // We don't have a unique constraint on linkedinId in the schema yet,
    // so we'll do a simple findFirst then create/update.

    let candidate = null;
    if (linkedinId) {
      candidate = await prisma.candidate.findFirst({
        where: { linkedinId },
      });
    }

    if (candidate) {
      candidate = await prisma.candidate.update({
        where: { id: candidate.id },
        data: {
          currentTitle: data.title || candidate.currentTitle,
          location: data.location || candidate.location,
          updatedAt: new Date(),
        },
      });
    } else {
      candidate = await prisma.candidate.create({
        data: {
          firstName,
          lastName,
          currentTitle: data.title || null,
          linkedinUrl: data.linkedinUrl || null,
          linkedinId: linkedinId || null,
          location: data.location || null,
          source: "LinkedIn Extension",
          tags: ["Scraped"],
        },
      });
    }

    return NextResponse.json({ success: true, candidate }, { status: 200 });
  } catch (error: any) {
    console.error("Failed to sync LinkedIn profile:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
