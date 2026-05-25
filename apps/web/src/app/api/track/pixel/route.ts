import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@corversetalent/db";
import { headers } from "next/headers";

// 1x1 transparent GIF buffer
const TRANSPARENT_GIF = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64"
);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const contactId = searchParams.get("c");
  const activityId = searchParams.get("a");

  if (contactId || activityId) {
    try {
      const headersList = await headers();
      const userAgent = headersList.get("user-agent") || "unknown";
      
      // Determine device type simply
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
          eventType: "open",
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
      console.error("Failed to log tracking pixel event", error);
      // Fail silently to the user so the image still loads
    }
  }

  // Return the 1x1 transparent GIF regardless of success/failure
  return new NextResponse(TRANSPARENT_GIF, {
    status: 200,
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  });
}
