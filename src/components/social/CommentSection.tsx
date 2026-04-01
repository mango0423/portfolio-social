"use client";

import { useState, useEffect } from "react";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: { id: string; name: string | null; image: string | null };
}

interface CommentSectionProps {
  workId: string;
  userId: string | null;
}

export default function CommentSection({ workId, userId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/works/${workId}/comments`)
      .then((res) => res.ok ? res.json() : [])
      .then(setComments)
      .catch(() => []);
  }, [workId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !content.trim() || loading) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/works/${workId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, content }),
      });
      if (res.ok) {
        setComments([await res.json(), ...comments]);
        setContent("");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground">评论</h3>

      {userId ? (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="写下你的评论..."
            className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground"
          />
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="px-4 py-2 bg-primary-deep text-white rounded-lg disabled:opacity-50"
          >
            发送
          </button>
        </form>
      ) : (
        <p className="text-text-muted text-sm">登录后参与评论</p>
      )}

      <div className="space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3 p-3 bg-surface rounded-lg">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm">
              {comment.user.name?.[0] ?? "?"}
            </div>
            <div>
              <p className="font-medium text-sm">{comment.user.name ?? "匿名用户"}</p>
              <p className="text-foreground mt-1">{comment.content}</p>
              <p className="text-text-muted text-xs mt-1">
                {new Date(comment.createdAt).toLocaleDateString("zh-CN")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
