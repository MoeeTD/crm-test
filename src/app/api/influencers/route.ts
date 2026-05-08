import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const search = searchParams.get("search") ?? "";
  const platform = searchParams.get("platform") ?? "";
  const niche = searchParams.get("niche") ?? "";
  const status = searchParams.get("status") ?? "";
  const sex = searchParams.get("sex") ?? "";

  const influencers = await prisma.influencer.findMany({
    where: {
      ...(search ? { OR: [{ name: { contains: search } }, { handle: { contains: search } }] } : {}),
      ...(platform ? { platform: platform as never } : {}),
      ...(niche ? { niche } : {}),
      ...(status ? { status: status as never } : {}),
      ...(sex ? { sex: sex as never } : {}),
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(influencers);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const influencer = await prisma.influencer.create({
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
  return NextResponse.json(influencer, { status: 201 });
}
