"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import LikeButton from "@/components/social/LikeButton";
import type { Work } from "@/types/work";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface WorkDetailModalProps {
  work: Work;
  onClose: () => void;
  onLikeChange?: (workId: string, newCount: number) => void;
}

export default function WorkDetailModal({ work, onClose, onLikeChange }: WorkDetailModalProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [likeCount, setLikeCount] = useState(work.likeCount);

  const currentUserId = session?.user?.id || "";

  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch(`/api/works/${work.id}/comments`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchComments();
  }, [work.id]);

  async function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUserId) {
      alert("请先登录");
      return;
    }
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/works/${work.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId, content: newComment.trim() }),
      });

      if (res.ok) {
        const comment = await res.json();
        setComments([comment, ...comments]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Failed to submit comment:", error);
    } finally {
      setSubmitting(false);
    }
  }

  function handleLikeChange(newCount: number) {
    setLikeCount(newCount);
    if (onLikeChange) {
      onLikeChange(work.id, newCount);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">{work.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto flex flex-col md:flex-row">
          {/* Image */}
          <div className="md:w-1/2 bg-gray-100 flex items-center justify-center p-4">
            {work.imageUrl ? (
              <Image
                src={work.imageUrl}
                alt={work.title}
                width={1200}
                height={900}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            ) : (
              <div className="text-gray-400">暂无图片</div>
            )}
          </div>

          {/* Details */}
          <div className="md:w-1/2 p-4 flex flex-col">
            {/* Author */}
            <Link href={`/user/${work.user.id}`} className="flex items-center gap-3 mb-4">
              {work.user.image ? (
                <Image
                  src={work.user.image}
                  alt={work.user.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                  {work.user.name?.[0] || "?"}
                </div>
              )}
              <div>
                <div className="font-medium text-gray-900">{work.user.name}</div>
                <div className="text-sm text-gray-500">查看个人主页</div>
              </div>
            </Link>

            {/* Description */}
            <div className="mb-4">
              <h3 className="font-medium text-gray-900 mb-1">描述</h3>
              <p className="text-gray-600 whitespace-pre-wrap">
                {work.description || "暂无描述"}
              </p>
            </div>

            {/* Tags */}
            {work.tags && work.tags.length > 0 && (
              <div className="mb-4">
                <h3 className="font-medium text-gray-900 mb-2">标签</h3>
                <div className="flex flex-wrap gap-2">
                  {work.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4 mb-4 py-3 border-t border-b">
              <LikeButton
                workId={work.id}
                userId={currentUserId}
                initialLiked={work.isLikedByUser || false}
                initialCount={likeCount}
                onLikeChange={handleLikeChange}
              />
              <span className="text-gray-500">💬 {work.commentCount}</span>
            </div>

            {/* Comments */}
            <div className="flex-1 overflow-y-auto">
              <h3 className="font-medium text-gray-900 mb-3">评论 ({comments.length})</h3>

              {loading ? (
                <div className="text-gray-500 text-sm">加载中...</div>
              ) : comments.length === 0 ? (
                <div className="text-gray-400 text-sm">暂无评论</div>
              ) : (
                <div className="space-y-3">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Link href={`/user/${comment.user.id}`}>
                        {comment.user.image ? (
                          <Image
                            src={comment.user.image}
                            alt={comment.user.name || ""}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-400">
                            {comment.user.name?.[0] || "?"}
                          </div>
                        )}
                      </Link>
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2">
                          <Link
                            href={`/user/${comment.user.id}`}
                            className="font-medium text-gray-900 text-sm hover:text-[#4CAF50]"
                          >
                            {comment.user.name || "匿名用户"}
                          </Link>
                          <span className="text-xs text-gray-400">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Comment Input */}
            {currentUserId && (
              <form onSubmit={handleSubmitComment} className="mt-4 pt-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="写下你的评论..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] text-sm"
                  />
                  <button
                    type="submit"
                    disabled={submitting || !newComment.trim()}
                    className="px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049] disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors"
                  >
                    {submitting ? "发送中..." : "发送"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}