import { prisma } from "@corversetalent/db";
import NewCampaignClient from "./client";

export default async function NewCampaignPage() {
  const sequences = await prisma.sequence.findMany({
    select: { id: true, name: true },
    orderBy: { createdAt: "desc" }
  });

  const contacts = await prisma.contact.findMany({
    select: { id: true, firstName: true, lastName: true, company: { select: { name: true } }, title: true },
    orderBy: { createdAt: "desc" }
  });

  const formattedContacts = contacts.map(c => ({
    id: c.id,
    firstName: c.firstName,
    lastName: c.lastName,
    title: c.title,
    company: c.company?.name || null
  }));

  return <NewCampaignClient sequences={sequences} contacts={formattedContacts} />;
}
