import { notFound } from "next/navigation";
import UserPageClient from "./UserPageClient";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { Work } from "@/types/work";

interface UserPageProps {
  params: Promise<{ id: string }>;
}

async function getUserWithWorks(id: string, currentUserId?: string) {
  const [user, works] = await Promise.all([
    prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        image: true,
        bio: true,
        createdAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
            works: true,
          },
        },
      },
    }),
    prisma.work.findMany({
      where: { userId: id },
      include: {
        user: { select: { id: true, name: true, image: true } },
        _count: { select: { likes: true, comments: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!user) {
    return null;
  }

  // Get current user's likes if logged in
  let userLikedWorkIds: Set<string> = new Set();
  if (currentUserId) {
    const userLikes = await prisma.like.findMany({
      where: { userId: currentUserId },
      select: { workId: true },
    });
    userLikedWorkIds = new Set(userLikes.map((like) => like.workId));
  }

  const transformedWorks: Work[] = works.map((work) => ({
    id: work.id,
    title: work.title,
    description: work.description || "",
    imageUrl: work.imageUrl || "",
    user: {
      id: work.user.id,
      name: work.user.name || "未命名用户",
      image: work.user.image || "",
    },
    likeCount: work._count.likes,
    commentCount: work._count.comments,
    tags: [],
    isLikedByUser: userLikedWorkIds.has(work.id),
  }));

  return {
    id: user.id,
    name: user.name || "未命名用户",
    avatarUrl: user.image || "",
    bio: user.bio || "这个人很懒，什么都没写",
    followerCount: user._count.followers,
    followingCount: user._count.following,
    workCount: user._count.works,
    works: transformedWorks,
  };
}

export default async function UserPage({ params }: UserPageProps) {
  const { id } = await params;
  const session = await auth();
  const currentUserId = session?.user?.id;
  const user = await getUserWithWorks(id, currentUserId);

  if (!user) {
    notFound();
  }

  const isOwnProfile = session?.user?.id === id;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <UserPageClient
          user={user}
          isOwnProfile={isOwnProfile}
          currentUserId={currentUserId}
        />
      </div>
    </div>
  );
}