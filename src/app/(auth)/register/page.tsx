"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("两次输入的密码不一致");
      return;
    }

    if (password.length < 6) {
      setError("密码至少需要6个字符");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "注册失败");
        return;
      }

      // Auto login after registration
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("注册成功，但登录失败，请手动登录");
      } else {
        router.push("/explore");
        router.refresh();
      }
    } catch {
      setError("注册失败，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E8F5E9]">
      <div className="max-w-md w-full space-y-8 p-8 bg-[#FAFAF5] rounded-lg shadow-md border border-[#E0E0D8]">
        <div>
          <h2 className="text-center text-3xl font-bold text-[#1B5E20]">注册</h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="昵称（选填）"
              className="w-full px-3 py-2 border border-[#E0E0D8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4CAF50] bg-[#FAFAF5] text-[#1B5E20]"
            />
          </div>

          <div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="邮箱地址"
              className="w-full px-3 py-2 border border-[#E0E0D8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4CAF50] bg-[#FAFAF5] text-[#1B5E20]"
            />
          </div>

          <div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="密码（至少6位）"
              className="w-full px-3 py-2 border border-[#E0E0D8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4CAF50] bg-[#FAFAF5] text-[#1B5E20]"
            />
          </div>

          <div>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="确认密码"
              className="w-full px-3 py-2 border border-[#E0E0D8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4CAF50] bg-[#FAFAF5] text-[#1B5E20]"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-[#4CAF50] text-white rounded-md hover:bg-[#388E3C] disabled:opacity-50 transition-colors"
          >
            {isLoading ? "注册中..." : "注册"}
          </button>
        </form>

        <p className="text-center text-sm text-[#558B2F]">
          已有账号?{" "}
          <Link href="/login" className="text-[#4CAF50] hover:underline">
            登录
          </Link>
        </p>
      </div>
    </div>
  );
}
