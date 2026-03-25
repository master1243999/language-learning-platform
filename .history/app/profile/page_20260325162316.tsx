"use client";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import Navbar from "../components/Navbar";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("获取学习统计失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center pb-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载个人资料中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50 pb-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">My Profile</h1>
        
        {/* 用户基本信息 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-semibold text-xl mr-4">
              {session.user.name ? session.user.name.charAt(0) : session.user.email.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">{session.user.name || session.user.email}</h2>
              <p className="text-gray-600">{session.user.email}</p>
              <p className="text-sm text-gray-500">Role: {session.user.role}</p>
            </div>
          </div>
        </div>

        {/* 学习统计 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Learning Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-emerald-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Learning Days</p>
              <p className="text-2xl font-bold text-emerald-600">{stats?.learningDays || 0}</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Total Duration</p>
              <p className="text-2xl font-bold text-emerald-600">{stats?.totalDuration || 0} min</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Completed Sections</p>
              <p className="text-2xl font-bold text-emerald-600">{stats?.completedSections || 0}</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Accuracy</p>
              <p className="text-2xl font-bold text-emerald-600">{stats?.accuracy || 0}%</p>
            </div>
          </div>
          <div className="h-64">
            <p className="text-sm font-medium text-gray-700 mb-2">Points Trend (Last 7 Days)</p>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.pointsTrend || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="points" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 最近学习活动 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h2>
          <div className="space-y-3">
            {/* 模拟最近学习活动数据 */}
            <div className="flex items-center p-3 border border-gray-100 rounded-lg">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mr-3">
                📚
              </div>
              <div>
                <p className="font-medium text-gray-800">Completed Exercise</p>
                <p className="text-sm text-gray-500">Introduction to English Grammar</p>
              </div>
            </div>
            <div className="flex items-center p-3 border border-gray-100 rounded-lg">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mr-3">
                💬
              </div>
              <div>
                <p className="font-medium text-gray-800">AI Conversation</p>
                <p className="text-sm text-gray-500">Practiced English conversation</p>
              </div>
            </div>
            <div className="flex items-center p-3 border border-gray-100 rounded-lg">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mr-3">
                🃏
              </div>
              <div>
                <p className="font-medium text-gray-800">Studied Flashcards</p>
                <p className="text-sm text-gray-500">Vocabulary: Daily Routines</p>
              </div>
            </div>
          </div>
        </div>

        {/* 我的课程 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">My Courses</h2>
          <div className="space-y-3">
            {/* 模拟我的课程数据 */}
            <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => router.push("/courses/1")}>
              <div>
                <p className="font-medium text-gray-800">English for Beginners</p>
                <p className="text-sm text-gray-500">Level: A1</p>
              </div>
              <span className="text-emerald-600">→</span>
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => router.push("/courses/2")}>
              <div>
                <p className="font-medium text-gray-800">Intermediate English</p>
                <p className="text-sm text-gray-500">Level: B1</p>
              </div>
              <span className="text-emerald-600">→</span>
            </div>
          </div>
        </div>

        {/* 退出登录按钮 */}
        <button
          onClick={handleSignOut}
          className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors"
        >
          Sign Out
        </button>
      </div>
      <Navbar />
    </div>
  );
}