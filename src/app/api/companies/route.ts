import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get("search") ?? "";
  const companies = await prisma.company.findMany({
    where: search ? { name: { contains: search } } : undefined,
    include: { _count: { select: { contacts: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(companies);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const company = await prisma.company.create({
    data: {
      name: body.name,
      website: body.website ?? null,
      industry: body.industry ?? null,
      phone: body.phone ?? null,
      address: body.address ?? null,
    },
  });
  return NextResponse.json(company, { status: 201 });
}
