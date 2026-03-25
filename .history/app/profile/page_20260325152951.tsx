"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  if (status === "loading") return <div className="p-6 text-center">加载中...</div>;
  if (!session?.user) return null;

  return (
    <div className="min-h-screen bg-emerald-50 p-6">
      <h1 className="text-2xl font-bold mb-4">个人中心</h1>
      <div className="bg-white p-6 rounded shadow">
        <p className="mb-2"><span className="font-semibold">姓名：</span>{session.user.name}</p>
        <p className="mb-2"><span className="font-semibold">邮箱：</span>{session.user.email}</p>
        <p className="mb-4"><span className="font-semibold">身份：</span>{session.user.role === 'teacher' ? '教师' : '学生'}</p>
        <p className="mb-6">学习统计、积分等将在此展示</p>
        <button
          onClick={handleSignOut}
          className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
        >
          退出登录
        </button>
      </div>
    </div>
  );
}