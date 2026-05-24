import { google } from "googleapis";
import { getGoogleAuthClient } from "./auth";

/**
 * Send an email via the authenticated user's Gmail account.
 */
export async function sendEmail({
  to,
  subject,
  bodyText,
  bodyHtml,
}: {
  to: string;
  subject: string;
  bodyText: string;
  bodyHtml?: string;
}) {
  const auth = await getGoogleAuthClient();
  const gmail = google.gmail({ version: "v1", auth });

  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString("base64")}?=`;
  const messageParts = [
    `To: ${to}`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${utf8Subject}`,
    '',
    bodyHtml || bodyText,
  ];
  const message = messageParts.join('\n');

  const encodedMessage = Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const res = await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: encodedMessage,
    },
  });

  return res.data;
}

/**
 * Basic template interpolation.
 * Replaces {{key}} with values from the variables object.
 */
export function compileEmailTemplate(template: string, variables: Record<string, string>) {
  let compiled = template;
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    compiled = compiled.replace(regex, value);
  }
  return compiled;
}
