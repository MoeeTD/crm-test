import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const [contacts, companies, tasks, openTasks, influencers] = await Promise.all([
    prisma.contact.count(),
    prisma.company.count(),
    prisma.task.count(),
    prisma.task.count({ where: { status: { not: "DONE" } } }),
    prisma.influencer.count(),
  ]);
  return NextResponse.json({ contacts, companies, tasks, openTasks, influencers });
}
