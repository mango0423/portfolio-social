import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const comments = await prisma.comment.findMany({
      where: { workId: params.id },
      include: { user: { select: { id: true, name: true, image: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(comments);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, content } = await request.json();
    const workId = params.id;

    if (!userId || !content?.trim()) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: { userId, workId, content: content.trim() },
      include: { user: { select: { id: true, name: true, image: true } } },
    });
    return NextResponse.json(comment);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
