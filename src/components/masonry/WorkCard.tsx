"use client";

import Image from "next/image";
import Link from "next/link";
import LikeButton from "@/components/social/LikeButton";
import { useSession } from "next-auth/react";
import type { Work } from "@/types/work";

interface WorkCardProps {
  work: Work;
  isLoaded: boolean;
  onImageLoad: () => void;
  onClick?: () => void;
}

export default function WorkCard({ work, isLoaded, onImageLoad, onClick }: WorkCardProps) {
  const { data: session } = useSession() ?? { data: null };
  const userId = session?.user?.id || "";

  return (
    <div
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-auto">
        {!isLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        {work.imageUrl ? (
          <Image
            src={work.imageUrl}
            alt={work.title}
            width={800}
            height={600}
            className={`w-full h-auto object-cover transition-opacity ${isLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => onImageLoad()}
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
            暂无图片
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 hover:text-[#4CAF50] transition-colors">
          {work.title}
        </h3>

        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{work.description}</p>

        <div className="flex flex-wrap gap-1 mt-2">
          {work.tags && Array.isArray(work.tags) && work.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4">
          <Link
            href={`/user/${work.user.id}`}
            className="flex items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            {work.user.image ? (
              <Image
                src={work.user.image}
                alt={work.user.name}
                width={24}
                height={24}
                className="rounded-full"
              />
            ) : (
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-500">
                {work.user.name?.[0] || "?"}
              </div>
            )}
            <span className="text-sm text-gray-600 hover:text-[#4CAF50]">{work.user.name}</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">
              💬 {work.commentCount}
            </span>
            <LikeButton
              workId={work.id}
              userId={userId}
              initialLiked={false}
              initialCount={work.likeCount}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
