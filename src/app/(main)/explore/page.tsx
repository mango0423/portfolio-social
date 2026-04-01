"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import MasonryGrid from "@/components/masonry/MasonryGrid";
import WorkDetailModal from "@/components/work/WorkDetailModal";
import type { Work, WorksResponse } from "@/types/work";

const SORT_OPTIONS = [
  { value: "newest", label: "最新" },
  { value: "most_liked", label: "最多点赞" },
  { value: "most_commented", label: "最多评论" },
  { value: "random", label: "随机" },
];

const PAGE_SIZE = 12;

function ExploreContent() {
  const router = useRouter();
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  const [works, setWorks] = useState<Work[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);

  const currentTag = searchParams.get("tag") || "";
  const currentSort = searchParams.get("sort") || "newest";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const currentUserId = session?.user?.id || "";
  const userName = session?.user?.name || "";
  const userImage = session?.user?.image || "";

  // Extract unique tags from works
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    works.forEach((work) => {
      if (work.tags && Array.isArray(work.tags)) {
        work.tags.forEach((tag: string) => tagSet.add(tag));
      }
    });
    return Array.from(tagSet).slice(0, 10); // Limit to 10 tags
  }, [works]);

  useEffect(() => {
    async function fetchWorks() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (currentTag) params.set("tag", currentTag);
        params.set("sort", currentSort);
        params.set("page", currentPage.toString());
        params.set("pageSize", PAGE_SIZE.toString());

        const res = await fetch(`/api/works?${params.toString()}`, {
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to fetch works");

        const data: WorksResponse = await res.json();
        setWorks(data.works || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error("Error fetching works:", error);
        setWorks([]);
      } finally {
        setLoading(false);
      }
    }

    fetchWorks();
  }, [currentTag, currentSort, currentPage]);

  const handleTagClick = (tag: string) => {
    const params = new URLSearchParams(searchParams);
    if (tag) {
      params.set("tag", tag);
    } else {
      params.delete("tag");
    }
    params.set("page", "1");
    router.push(`/explore?${params.toString()}`);
  };

  const handleSortChange = (sort: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", sort);
    params.set("page", "1");
    router.push(`/explore?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`/explore?${params.toString()}`);
  };

  const handleWorkClick = (work: Work) => {
    setSelectedWork(work);
  };

  const handleModalClose = () => {
    setSelectedWork(null);
  };

  const handleLikeChange = (workId: string, newCount: number) => {
    setWorks((prevWorks) =>
      prevWorks.map((w) =>
        w.id === workId ? { ...w, likeCount: newCount } : w
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">发现</h1>
            <p className="text-gray-600 mt-2">探索来自全球创作者的作品</p>
          </div>
          {session ? (
            <div className="flex items-center gap-3">
              <Link
                href={`/user/${currentUserId}`}
                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:border-[#4CAF50] hover:text-[#4CAF50] transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>我的</span>
              </Link>
              <Link
                href="/create"
                className="px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049] transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>发布作品</span>
              </Link>
              {userImage && userImage !== "" ? (
                <Link href={`/user/${currentUserId}`}>
                  <Image
                    src={userImage}
                    alt={userName}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </Link>
              ) : (
                <Link href={`/user/${currentUserId}`}>
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-500">{userName?.[0] || "U"}</span>
                  </div>
                </Link>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049] transition-colors"
            >
              登录
            </Link>
          )}
        </header>

        {/* QuickFilters */}
        {allTags.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => handleTagClick("")}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                !currentTag
                  ? "bg-[#4CAF50] text-white"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-[#4CAF50] hover:text-[#4CAF50]"
              }`}
            >
              全部
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  currentTag === tag
                    ? "bg-[#4CAF50] text-white"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-[#4CAF50] hover:text-[#4CAF50]"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Sort Dropdown */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">排序：</span>
            <select
              value={currentSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {total > 0 && (
            <span className="text-sm text-gray-500">
              共 {total} 个作品
            </span>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-gray-500">加载中...</div>
          </div>
        ) : works.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-gray-500">暂无作品</p>
          </div>
        ) : (
          <MasonryGrid works={works} onWorkClick={handleWorkClick} />
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage <= 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-[#4CAF50] text-white hover:bg-[#45a049]"
              }`}
            >
              上一页
            </button>
            <span className="text-sm text-gray-600">
              第 {currentPage} / {totalPages} 页
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage >= totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-[#4CAF50] text-white hover:bg-[#45a049]"
              }`}
            >
              下一页
            </button>
          </div>
        )}
      </div>

      {selectedWork && (
        <WorkDetailModal
          work={selectedWork}
          onClose={handleModalClose}
          onLikeChange={handleLikeChange}
        />
      )}
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="text-gray-500">加载中...</div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ExploreContent />
    </Suspense>
  );
}
