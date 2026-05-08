import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const influencer = await prisma.influencer.findUnique({ where: { id } });
  if (!influencer) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(influencer);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const influencer = await prisma.influencer.update({
    where: { id },
    data: {
      name: body.name,
      email: body.email || null,
      phone: body.phone || null,
      phone2: body.phone2 || null,
      location: body.location || null,
      city: body.city || null,
      sex: body.sex || null,
      platform: body.platform || "INSTAGRAM",
      handle: body.handle || null,
      followers: body.followers ? parseInt(body.followers) : null,
      engagementRate: body.engagementRate ? parseFloat(body.engagementRate) : null,
      niche: body.niche || null,
      traits: body.traits || null,
      ratePerPost: body.ratePerPost ? parseFloat(body.ratePerPost) : null,
      status: body.status || "ACTIVE",
    },
  });
  return NextResponse.json(influencer);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.influencer.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
