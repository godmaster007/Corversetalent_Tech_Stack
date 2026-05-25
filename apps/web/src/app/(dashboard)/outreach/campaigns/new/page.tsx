import { prisma } from "@corversetalent/db";
import NewCampaignClient from "./client";

export default async function NewCampaignPage() {
  const sequences = await prisma.sequence.findMany({
    select: { id: true, name: true },
    orderBy: { createdAt: "desc" }
  });

  const contacts = await prisma.contact.findMany({
    select: { id: true, firstName: true, lastName: true, company: true, title: true },
    orderBy: { createdAt: "desc" }
  });

  return <NewCampaignClient sequences={sequences} contacts={contacts} />;
}
