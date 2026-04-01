import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import FollowButton from "@/components/social/FollowButton";
import MasonryGrid from "@/components/masonry/MasonryGrid";

interface UserPageProps {
  params: Promise<{ id: string }>;
}

async function getUser(id: string) {
  // TODO: Replace with actual API call
  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`)
  // if (!res.ok) throw new Error('Failed to fetch user')
  // return res.json()

  // Mock data for development
  if (id === "notfound") {
    return null;
  }

  return {
    id,
    name: "摄影师小明",
    avatarUrl: "https://i.pravatar.cc/150?u=u1",
    bio: "热爱摄影，专注于城市风光和人像摄影。希望用镜头记录生活中的美好瞬间。",
    followerCount: 1280,
    followingCount: 256,
    workCount: 48,
    works: [
      {
        id: "1",
        title: "暮色之城",
        description: "城市黄昏时刻的光影捕捉",
        imageUrl: "https://picsum.photos/800/600?random=1",
        user: { id, name: "摄影师小明", avatarUrl: "https://i.pravatar.cc/150?u=u1" },
        likeCount: 128,
        commentCount: 24,
        tags: ["摄影", "城市", "黄昏"],
      },
      {
        id: "7",
        title: "晨曦微露",
        description: "清晨的第一缕阳光",
        imageUrl: "https://picsum.photos/800/1100?random=7",
        user: { id, name: "摄影师小明", avatarUrl: "https://i.pravatar.cc/150?u=u1" },
        likeCount: 256,
        commentCount: 38,
        tags: ["摄影", "日出", "自然"],
      },
      {
        id: "8",
        title: "雨后街道",
        description: "雨水冲刷后的城市街道",
        imageUrl: "https://picsum.photos/800/700?random=8",
        user: { id, name: "摄影师小明", avatarUrl: "https://i.pravatar.cc/150?u=u1" },
        likeCount: 512,
        commentCount: 67,
        tags: ["摄影", "雨天", "街拍"],
      },
    ],
  };
}

export default async function UserPage({ params }: UserPageProps) {
  const { id } = await params;
  const user = await getUser(id);

  if (!user) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Image
              src={user.avatarUrl}
              alt={user.name}
              width={120}
              height={120}
              className="rounded-full"
            />

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                  <p className="text-gray-500 mt-1">@{user.id}</p>
                </div>
                <FollowButton userId="current-user" targetUserId={user.id} />
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
          <h2 className="text-xl font-bold text-gray-900 mb-4">作品集</h2>
          {user.works.length > 0 ? (
            <MasonryGrid works={user.works} />
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>还没有作品</p>
              <Link href="/create" className="text-blue-600 hover:underline mt-2 inline-block">
                立即上传
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
