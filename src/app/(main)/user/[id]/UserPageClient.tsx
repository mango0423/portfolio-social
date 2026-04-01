"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FollowButton from "@/components/social/FollowButton";
import MasonryGrid from "@/components/masonry/MasonryGrid";
import ProfileSettingsModal from "@/components/user/ProfileSettingsModal";
import type { Work } from "@/types/work";

interface User {
  id: string;
  name: string;
  avatarUrl: string;
  bio: string;
  followerCount: number;
  followingCount: number;
  workCount: number;
  works: Work[];
}

interface UserPageClientProps {
  user: User;
  isOwnProfile: boolean;
  currentUserId?: string;
}

export default function UserPageClient({ user, isOwnProfile, currentUserId }: UserPageClientProps) {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      {/* Back Button */}
      <Link
        href="/explore"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-[#4CAF50] mb-6 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span>返回发现</span>
      </Link>

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
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowSettings(true)}
                    className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:border-[#4CAF50] hover:text-[#4CAF50] transition-colors"
                  >
                    编辑资料
                  </button>
                  <Link
                    href="/create"
                    className="px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049] transition-colors"
                  >
                    发布作品
                  </Link>
                </div>
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

      {/* Settings Modal */}
      {showSettings && (
        <ProfileSettingsModal
          userId={user.id}
          currentName={user.name}
          currentBio={user.bio}
          currentImage={user.avatarUrl}
          onClose={() => setShowSettings(false)}
        />
      )}
    </>
  );
}