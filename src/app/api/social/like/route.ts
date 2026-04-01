import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { workId } = await request.json();

    if (!workId) {
      return NextResponse.json({ error: "Work ID is required" }, { status: 400 });
    }

    const existingLike = await prisma.like.findUnique({
      where: { workId_userId: { workId, userId: session.user.id } },
    });

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
      return NextResponse.json({ liked: false });
    }

    await prisma.like.create({
      data: { workId, userId: session.user.id },
    });
    return NextResponse.json({ liked: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
