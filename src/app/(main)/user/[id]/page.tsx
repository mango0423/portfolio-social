import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import FollowButton from "@/components/social/FollowButton";
import MasonryGrid from "@/components/masonry/MasonryGrid";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { Work } from "@/types/work";

interface UserPageProps {
  params: Promise<{ id: string }>;
}

async function getUserWithWorks(id: string) {
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
  const user = await getUserWithWorks(id);

  if (!user) {
    notFound();
  }

  const isOwnProfile = session?.user?.id === id;
  const currentUserId = session?.user?.id || "";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={user.name}
                width={120}
                height={120}
                className="rounded-full"
              />
            ) : (
              <div className="w-[120px] h-[120px] bg-gray-200 rounded-full flex items-center justify-center text-4xl text-gray-400">
                {user.name?.[0] || "?"}
              </div>
            )}

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                  <p className="text-gray-500 mt-1">@{user.id.slice(0, 8)}</p>
                </div>
                {!isOwnProfile && (
                  <FollowButton userId={currentUserId} targetUserId={user.id} />
                )}
                {isOwnProfile && (
                  <Link
                    href="/create"
                    className="px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049] transition-colors"
                  >
                    发布作品
                  </Link>
                )}
              </div>

              <p className="text-gray-700 mt-4 max-w-2xl">{user.bio}</p>

              <div className="flex justify-center sm:justify-start gap-8 mt-6">
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{user.workCount}</div>
                  <div className="text-sm text-gray-500">作品</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{user.followerCount}</div>
                  <div className="text-sm text-gray-500">粉丝</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{user.followingCount}</div>
                  <div className="text-sm text-gray-500">关注</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Works Grid */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {isOwnProfile ? "我的作品" : "作品集"}
          </h2>
          {user.works.length > 0 ? (
            <MasonryGrid works={user.works} />
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>{isOwnProfile ? "还没有作品" : "暂无作品"}</p>
              {isOwnProfile && (
                <Link href="/create" className="text-[#4CAF50] hover:underline mt-2 inline-block">
                  立即上传
                </Link>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}