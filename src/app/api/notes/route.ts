import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const note = await prisma.note.create({
    data: {
      content: body.content,
      contactId: body.contactId ?? null,
      companyId: body.companyId ?? null,
    },
  });
  return NextResponse.json(note, { status: 201 });
}
