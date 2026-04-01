import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(request: Request) {
  try {
    const session = await auth();
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get("sort") || "newest";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const skip = (page - 1) * limit;
    const userId = searchParams.get("userId");
    const tag = searchParams.get("tag");

    // Build where clause
    const where: Record<string, unknown> = {};

    // Filter by userId if provided
    if (userId) {
      where.userId = userId;
    }

    // Filter by tag if provided
    if (tag) {
      where.tags = { contains: tag };
    }

    // Build orderBy based on sort parameter
    let orderBy: object[] = [];
    switch (sort) {
      case "most_liked":
        orderBy = [{ likes: { _count: "desc" } }, { createdAt: "desc" }];
        break;
      case "most_commented":
        orderBy = [{ comments: { _count: "desc" } }, { createdAt: "desc" }];
        break;
      case "random":
        orderBy = [{ id: "desc" }]; // Fallback, Prisma doesn't have random
        break;
      case "newest":
      default:
        orderBy = [{ createdAt: "desc" }];
    }

    const [works, total] = await Promise.all([
      prisma.work.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, image: true } },
          _count: { select: { likes: true, comments: true } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.work.count({ where }),
    ]);

    // Get all unique tags for filter UI (only when not filtering by tag)
    let allTags: string[] = [];
    if (!tag && !userId) {
      const allWorks = await prisma.work.findMany({
        select: { tags: true },
      });
      const tagSet = new Set<string>();
      allWorks.forEach((work) => {
        try {
          const tags = JSON.parse(work.tags || "[]");
          if (Array.isArray(tags)) {
            tags.forEach((t: string) => tagSet.add(t));
          }
        } catch {
          // ignore parse errors
        }
      });
      allTags = Array.from(tagSet).slice(0, 20);
    }

    const totalPages = Math.ceil(total / limit);

    // Get current user's likes if logged in
    let userLikedWorkIds: Set<string> = new Set();
    if (session?.user?.id) {
      const userLikes = await prisma.like.findMany({
        where: { userId: session.user.id },
        select: { workId: true },
      });
      userLikedWorkIds = new Set(userLikes.map((like) => like.workId));
    }

    // Transform works to match frontend Work type
    const transformedWorks = works.map((work) => {
      let tags: string[] = [];
      try {
        tags = JSON.parse(work.tags || "[]");
      } catch {
        tags = [];
      }
      return {
        id: work.id,
        title: work.title,
        description: work.description || "",
        imageUrl: work.imageUrl || "",
        user: {
          ...work.user,
          image: work.user.image || "",
        },
        likeCount: work._count.likes,
        commentCount: work._count.comments,
        tags,
        isLikedByUser: userLikedWorkIds.has(work.id),
      };
    });

    return NextResponse.json({
      works: transformedWorks,
      total,
      totalPages,
      currentPage: page,
      allTags,
    });
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
    const { title, description, imageUrl, portfolioId, tags } = await request.json();

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

    // Store tags as JSON string
    const tagsJson = JSON.stringify(tags || []);

    const work = await prisma.work.create({
      data: {
        title: title.trim(),
        description: description?.trim() || "",
        imageUrl: imageUrl || `https://picsum.photos/800/600?random=${Date.now()}`,
        tags: tagsJson,
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
