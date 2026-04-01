import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { userId: followingId } = await request.json();

    if (!followingId || followingId === session.user.id) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const existing = await prisma.follow.findUnique({
      where: {
        followingId_followerId: { followingId, followerId: session.user.id },
      },
    });

    if (existing) {
      await prisma.follow.delete({ where: { id: existing.id } });
      return NextResponse.json({ following: false });
    }

    await prisma.follow.create({
      data: { followingId, followerId: session.user.id },
    });
    return NextResponse.json({ following: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
