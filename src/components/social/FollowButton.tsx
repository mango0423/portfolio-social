"use client";

import { useState } from "react";

interface FollowButtonProps {
  userId?: string;
  targetUserId?: string;
  initialFollowing?: boolean;
}

export default function FollowButton({
  userId,
  targetUserId,
  initialFollowing = false,
}: FollowButtonProps) {
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading || !targetUserId || userId === targetUserId) return;

    setLoading(true);
    const prevState = following;
    setFollowing(!following);

    try {
      const res = await fetch(`/api/users/${targetUserId}/follow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setFollowing(prevState);
    } finally {
      setLoading(false);
    }
  };

  if (!targetUserId || userId === targetUserId) return null;

  return (
    <button
      onClick={handleClick}
      disabled={loading || !userId}
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
        following
          ? "border border-border text-foreground hover:bg-surface"
          : "bg-[#2E7D32] text-white hover:bg-[#2E7D32]/90"
      } ${loading || !userId ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {following ? "已关注" : "关注"}
    </button>
  );
}
