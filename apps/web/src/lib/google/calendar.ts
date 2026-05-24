import { google } from "googleapis";
import { getGoogleAuthClient } from "./auth";

/**
 * Create a new event on the primary calendar (for interview scheduling).
 */
export async function createCalendarEvent({
  summary,
  description,
  startDateTime,
  endDateTime,
  attendeeEmails,
}: {
  summary: string;
  description: string;
  startDateTime: string; // ISO string
  endDateTime: string;   // ISO string
  attendeeEmails: string[];
}) {
  const auth = await getGoogleAuthClient();
  const calendar = google.calendar({ version: "v3", auth });

  const event = {
    summary,
    description,
    start: {
      dateTime: startDateTime,
    },
    end: {
      dateTime: endDateTime,
    },
    attendees: attendeeEmails.map((email) => ({ email })),
    conferenceData: {
      createRequest: {
        requestId: `meet-${Date.now()}`,
        conferenceSolutionKey: {
          type: "hangoutsMeet",
        },
      },
    },
  };

  const res = await calendar.events.insert({
    calendarId: "primary",
    requestBody: event,
    conferenceDataVersion: 1, // Needed to auto-generate Google Meet link
    sendUpdates: "all", // Sends email invitations to attendees
  });

  return res.data;
}

/**
 * Get upcoming events for the dashboard.
 */
export async function getUpcomingEvents(maxResults = 10) {
  const auth = await getGoogleAuthClient();
  const calendar = google.calendar({ version: "v3", auth });

  const res = await calendar.events.list({
    calendarId: "primary",
    timeMin: new Date().toISOString(),
    maxResults,
    singleEvents: true,
    orderBy: "startTime",
  });

  return res.data.items || [];
}
