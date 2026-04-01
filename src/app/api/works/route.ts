import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  try {
    const works = await prisma.work.findMany({
      include: {
        user: { select: { id: true, name: true, image: true } },
        _count: { select: { likes: true, comments: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(works);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, description, portfolioId } = await request.json();

    if (!title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Get or create default portfolio for user
    let targetPortfolioId = portfolioId;
    if (!targetPortfolioId) {
      let portfolio = await prisma.portfolio.findFirst({
        where: { userId: session.user.id },
      });
      if (!portfolio) {
        portfolio = await prisma.portfolio.create({
          data: {
            title: "My Portfolio",
            userId: session.user.id,
          },
        });
      }
      targetPortfolioId = portfolio.id;
    }

    const work = await prisma.work.create({
      data: {
        title: title.trim(),
        description: description?.trim() || "",
        portfolioId: targetPortfolioId,
        userId: session.user.id,
      },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    });

    return NextResponse.json(work);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
