import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status");
  const tasks = await prisma.task.findMany({
    where: status ? { status: status as "OPEN" | "IN_PROGRESS" | "DONE" } : undefined,
    include: {
      contact: { select: { id: true, name: true } },
      company: { select: { id: true, name: true } },
    },
    orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const task = await prisma.task.create({
    data: {
      title: body.title,
      description: body.description ?? null,
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      status: body.status ?? "OPEN",
      priority: body.priority ?? "MEDIUM",
      contactId: body.contactId ?? null,
      companyId: body.companyId ?? null,
    },
    include: {
      contact: { select: { id: true, name: true } },
      company: { select: { id: true, name: true } },
    },
  });
  return NextResponse.json(task, { status: 201 });
}
