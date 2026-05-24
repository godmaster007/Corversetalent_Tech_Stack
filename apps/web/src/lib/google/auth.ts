import { google } from "googleapis";
import { auth } from "../../auth";

/**
 * Get an authenticated Google API client using the current user's session tokens.
 */
export async function getGoogleAuthClient() {
  const session = await auth();
  
  if (!session || !(session as any).accessToken) {
    throw new Error("No active Google session found. Please sign in.");
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    access_token: (session as any).accessToken,
    // refresh_token can be added if offline access and refresh mechanism is fully implemented
  });

  return oauth2Client;
}
