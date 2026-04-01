"use client";

import { useState } from "react";

interface LikeButtonProps {
  workId: string;
  userId: string;
  initialLiked: boolean;
  initialCount: number;
  onLikeChange?: (newCount: number) => void;
}

export default function LikeButton({
  workId,
  userId,
  initialLiked,
  initialCount,
  onLikeChange,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading || !userId) return;

    setLoading(true);
    const prevLiked = liked;
    const prevCount = count;

    setLiked(!liked);
    setCount(liked ? count - 1 : count + 1);

    try {
      const res = await fetch(`/api/works/${workId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) throw new Error();
      if (onLikeChange) {
        onLikeChange(liked ? count - 1 : count + 1);
      }
    } catch {
      setLiked(prevLiked);
      setCount(prevCount);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading || !userId}
      className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${
        liked
          ? "bg-[#4CAF50] text-white"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      } ${loading || !userId ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <span>{liked ? "♥" : "♡"}</span>
      <span>{count}</span>
    </button>
  );
}
