import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await request.json();
    const { id: followingId } = await params;

    if (!userId || userId === followingId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const existing = await prisma.follow.findUnique({
      where: {
        followingId_followerId: { followingId, followerId: userId },
      },
    });

    if (existing) {
      await prisma.follow.delete({ where: { id: existing.id } });
      return NextResponse.json({ following: false });
    }

    await prisma.follow.create({
      data: { followingId, followerId: userId },
    });
    return NextResponse.json({ following: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
