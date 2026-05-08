import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const [contacts, companies, tasks, openTasks] = await Promise.all([
    prisma.contact.count(),
    prisma.company.count(),
    prisma.task.count(),
    prisma.task.count({ where: { status: { not: "DONE" } } }),
  ]);
  return NextResponse.json({ contacts, companies, tasks, openTasks });
}
