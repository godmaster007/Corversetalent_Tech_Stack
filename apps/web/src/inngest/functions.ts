import { inngest } from "./client";
import { sendEmail, compileEmailTemplate } from "../lib/google/gmail";
import { prisma } from "@corversetalent/db";

/**
 * Background job to send a scheduled outreach email.
 * This function can be delayed and queued by the sequence builder.
 */
export const sendScheduledEmail = inngest.createFunction(
  { id: "send-scheduled-email", name: "Send Scheduled Email" },
  { event: "outreach/email.send" },
  async ({ event, step }) => {
    const { contactId, subjectTemplate, bodyTemplate, variables, delayDays } = event.data;

    // Optional delay for drip campaigns
    if (delayDays && delayDays > 0) {
      await step.sleep("wait-for-drip-delay", `${delayDays}d`);
    }

    // Fetch the latest contact info
    const contact = await step.run("fetch-contact", async () => {
      const dbContact = await prisma.contact.findUnique({
        where: { id: contactId },
        include: { company: true },
      });
      if (!dbContact || !dbContact.email) {
        throw new Error(`Contact ${contactId} not found or missing email`);
      }
      return dbContact;
    });

    // Compile templates with the contact data
    const finalVariables = {
      first_name: contact.firstName,
      last_name: contact.lastName,
      company: contact.company?.name || "your company",
      ...variables,
    };

    const subject = compileEmailTemplate(subjectTemplate, finalVariables);
    const bodyHtml = compileEmailTemplate(bodyTemplate, finalVariables);

    // Send the email via Gmail API
    const result = await step.run("send-via-gmail", async () => {
      return await sendEmail({
        to: contact.email as string,
        subject,
        bodyText: "Please view this email in an HTML-compatible client.",
        bodyHtml,
      });
    });

    // Log the activity to the CRM
    await step.run("log-activity", async () => {
      await prisma.activity.create({
        data: {
          contactId: contact.id,
          companyId: contact.companyId,
          type: "email",
          subject: subject,
          body: bodyHtml,
          direction: "outbound",
          channel: "gmail",
        },
      });
    });

    return { success: true, messageId: result.id };
  }
);
