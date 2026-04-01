"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("邮箱或密码错误");
      } else {
        router.push("/explore");
        router.refresh();
      }
    } catch {
      setError("登录失败，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E8F5E9]">
      <div className="max-w-md w-full space-y-8 p-8 bg-[#FAFAF5] rounded-lg shadow-md border border-[#E0E0D8]">
        <div>
          <h2 className="text-center text-3xl font-bold text-[#1B5E20]">登录</h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

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
              placeholder="密码"
              className="w-full px-3 py-2 border border-[#E0E0D8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4CAF50] bg-[#FAFAF5] text-[#1B5E20]"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-[#4CAF50] text-white rounded-md hover:bg-[#388E3C] disabled:opacity-50 transition-colors"
          >
            {isLoading ? "登录中..." : "登录"}
          </button>
        </form>

        <p className="text-center text-sm text-[#558B2F]">
          还没有账号?{" "}
          <Link href="/register" className="text-[#4CAF50] hover:underline">
            注册
          </Link>
        </p>
      </div>
    </div>
  );
}
