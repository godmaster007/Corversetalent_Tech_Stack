import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@corversetalent/db";
import { headers } from "next/headers";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const targetUrl = searchParams.get("url");
  const contactId = searchParams.get("c");
  const activityId = searchParams.get("a");

  if (!targetUrl) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  try {
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "unknown";
    
    // Determine device type
    let deviceType = "desktop";
    if (/mobile/i.test(userAgent)) deviceType = "mobile";
    if (/tablet/i.test(userAgent)) deviceType = "tablet";

    // Vercel forwards IP and Geo data via headers
    const ipAddress = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown";
    const geoCity = headersList.get("x-vercel-ip-city") || "unknown";
    const geoRegion = headersList.get("x-vercel-ip-country-region") || "unknown";
    const geoCountry = headersList.get("x-vercel-ip-country") || "unknown";

    await prisma.trackingEvent.create({
      data: {
        eventType: "click",
        linkUrl: targetUrl,
        contactId: contactId || null,
        activityId: activityId || null,
        userAgent,
        deviceType,
        ipAddress,
        geoCity,
        geoRegion,
        geoCountry
      },
    });
    
  } catch (error) {
    console.error("Failed to log tracking click event", error);
    // Continue with the redirect even if logging fails
  }

  // Perform a 302 temporary redirect to the target URL
  return NextResponse.redirect(targetUrl, 302);
}
