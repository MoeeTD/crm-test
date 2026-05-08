import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get("search") ?? "";
  const contacts = await prisma.contact.findMany({
    where: search
      ? { OR: [{ name: { contains: search } }, { email: { contains: search } }] }
      : undefined,
    include: { company: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(contacts);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const contact = await prisma.contact.create({
    data: {
      name: body.name,
      email: body.email ?? null,
      phone: body.phone ?? null,
      role: body.role ?? null,
      companyId: body.companyId ?? null,
    },
    include: { company: { select: { id: true, name: true } } },
  });
  return NextResponse.json(contact, { status: 201 });
}
