import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Companies
  const acme = await prisma.company.create({
    data: {
      name: "Acme Corp",
      website: "https://acme.com",
      industry: "Technology",
      phone: "+1 (415) 555-0100",
      address: "100 Market St, San Francisco, CA 94105",
    },
  });

  const nova = await prisma.company.create({
    data: {
      name: "Nova Solutions",
      website: "https://novasolutions.io",
      industry: "SaaS",
      phone: "+1 (212) 555-0182",
      address: "350 5th Ave, New York, NY 10118",
    },
  });

  const peak = await prisma.company.create({
    data: {
      name: "Peak Ventures",
      website: "https://peakventures.vc",
      industry: "Venture Capital",
      phone: "+1 (650) 555-0143",
      address: "3000 Sand Hill Rd, Menlo Park, CA 94025",
    },
  });

  // Contacts
  const jane = await prisma.contact.create({
    data: {
      name: "Jane Smith",
      email: "jane.smith@acme.com",
      phone: "+1 (415) 555-0121",
      role: "CEO",
      companyId: acme.id,
    },
  });

  const marcus = await prisma.contact.create({
    data: {
      name: "Marcus Lee",
      email: "marcus@acme.com",
      phone: "+1 (415) 555-0134",
      role: "VP of Engineering",
      companyId: acme.id,
    },
  });

  const priya = await prisma.contact.create({
    data: {
      name: "Priya Patel",
      email: "priya@novasolutions.io",
      phone: "+1 (212) 555-0195",
      role: "Head of Sales",
      companyId: nova.id,
    },
  });

  const tom = await prisma.contact.create({
    data: {
      name: "Tom Nguyen",
      email: "tom.nguyen@novasolutions.io",
      phone: "+1 (212) 555-0167",
      role: "Product Manager",
      companyId: nova.id,
    },
  });

  const sara = await prisma.contact.create({
    data: {
      name: "Sara Kim",
      email: "sara@peakventures.vc",
      phone: "+1 (650) 555-0188",
      role: "Partner",
      companyId: peak.id,
    },
  });

  const alex = await prisma.contact.create({
    data: {
      name: "Alex Rivera",
      email: "alex.rivera@freelance.com",
      phone: "+1 (303) 555-0109",
      role: "Consultant",
      companyId: null,
    },
  });

  // Tasks
  await prisma.task.createMany({
    data: [
      {
        title: "Send contract to Acme Corp",
        description: "Follow up on the Q3 SLA renewal — legal reviewed it last week.",
        status: "OPEN",
        priority: "HIGH",
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        contactId: jane.id,
        companyId: acme.id,
      },
      {
        title: "Schedule product demo with Nova Solutions",
        description: "Priya requested a live demo of the new dashboard features.",
        status: "IN_PROGRESS",
        priority: "HIGH",
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        contactId: priya.id,
        companyId: nova.id,
      },
      {
        title: "Review Peak Ventures pitch deck",
        description: "Sara sent over their updated deck. Need feedback before Thursday.",
        status: "OPEN",
        priority: "MEDIUM",
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        contactId: sara.id,
        companyId: peak.id,
      },
      {
        title: "Onboarding call with Marcus",
        description: "Walk through API docs and integration checklist.",
        status: "DONE",
        priority: "MEDIUM",
        dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // past
        contactId: marcus.id,
        companyId: acme.id,
      },
      {
        title: "Send invoice to Alex Rivera",
        status: "OPEN",
        priority: "HIGH",
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // overdue
        contactId: alex.id,
        companyId: null,
      },
      {
        title: "Update CRM with Nova Solutions Q2 deal value",
        status: "IN_PROGRESS",
        priority: "LOW",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        contactId: tom.id,
        companyId: nova.id,
      },
      {
        title: "Follow up on unanswered email — Sara Kim",
        status: "OPEN",
        priority: "MEDIUM",
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        contactId: sara.id,
        companyId: peak.id,
      },
    ],
  });

  // Notes
  await prisma.note.createMany({
    data: [
      {
        content: "Met Jane at SaaStr. Very interested in the enterprise tier. Mentioned they're evaluating two other vendors.",
        contactId: jane.id,
        companyId: acme.id,
      },
      {
        content: "Called re: contract delay. Legal team is backed up — expect signature by end of week.",
        contactId: jane.id,
        companyId: acme.id,
      },
      {
        content: "Marcus prefers async communication. Ping on Slack before scheduling anything.",
        contactId: marcus.id,
        companyId: null,
      },
      {
        content: "Priya confirmed $120k ARR budget. Decision by end of Q2.",
        contactId: priya.id,
        companyId: nova.id,
      },
      {
        content: "Nova Solutions has 3 internal champions — Priya, Tom, and the CTO (haven't met yet).",
        contactId: null,
        companyId: nova.id,
      },
      {
        content: "Sara introduced us to two portfolio companies that might be a fit. Will follow up separately.",
        contactId: sara.id,
        companyId: peak.id,
      },
      {
        content: "Alex is between contracts — good candidate for a referral arrangement.",
        contactId: alex.id,
        companyId: null,
      },
    ],
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
