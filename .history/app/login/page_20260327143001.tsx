"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (result?.ok) {
      router.push("/");
    } else {
      alert("登录失败，请检查邮箱和密码");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-modern p-4">
      <div className="w-full max-w-md relative z-10">
        <div className="card-modern card-glow p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center page-title">登录</h1>
          
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                邮箱
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full input-modern px-4 py-2"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                密码
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full input-modern px-4 py-2"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg btn-modern disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner mr-2"></div>
                  登录中...
                </div>
              ) : '登录'}
            </button>
            
            <div className="mt-4 text-center">
              <p className="text-gray-600">
                还没有账号？{' '}
                <a href="/register" className="text-emerald-600 hover:underline">
                  注册
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}