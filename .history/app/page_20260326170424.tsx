"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BookOpen, MessageSquare, ArrowRight } from "lucide-react";
import Navbar from "./components/Navbar";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [lastTopic, setLastTopic] = useState(null);

  useEffect(() => {
    if (session) {
      // 模拟获取学习进度和最近学习的主题
      // 实际项目中应该从API获取
      setProgress(35);
      setLastTopic({
        id: "cmn5vv57a00009y40lsu60oax",
        title: "Introduction to English Grammar",
        section: "Basic English",
        course: "English for Beginners"
      });
    }
  }, [session]);

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-emerald-50 p-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">欢迎使用语言学习平台</h1>
          <p className="text-gray-600 mb-8">今天就开始您的语言学习之旅，通过我们的互动课程和AI辅助练习。</p>
          <div className="flex flex-col gap-4">
            <button
              onClick={() => router.push("/login")}
              className="bg-emerald-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
            >
              登录
            </button>
            <button
              onClick={() => router.push("/register")}
              className="border border-emerald-600 text-emerald-600 py-3 px-6 rounded-lg font-medium hover:bg-emerald-50 transition-colors"
            >
              注册
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50 pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            欢迎回来，{session.user.name || session.user.email}！
          </h1>
        </div>

        {/* 学习进度条 */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex justify-between mb-2">
            <span className="font-medium text-gray-700">学习进度</span>
            <span className="text-emerald-600 font-medium">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-emerald-600 h-2.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* 继续学习卡片 */}
        {lastTopic && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">继续学习</h2>
            <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => router.push(`/topics/${lastTopic.id}`)}>
              <div>
                <h3 className="font-medium text-gray-800">{lastTopic.title}</h3>
              <p className="text-sm text-gray-500">{lastTopic.section} • {lastTopic.course}</p>
              </div>
              <ArrowRight size={18} className="text-emerald-600" />
            </div>
          </div>
        )}

        {/* 功能按钮 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => router.push("/courses")}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg p-6 flex items-center justify-between shadow-md hover:shadow-lg transition-shadow"
          >
            <div>
              <h2 className="text-xl font-semibold mb-2">浏览课程</h2>
              <p className="text-emerald-100">浏览我们的语言课程集合</p>
            </div>
            <BookOpen size={24} />
          </button>
          <button
            onClick={() => router.push("/ai")}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6 flex items-center justify-between shadow-md hover:shadow-lg transition-shadow"
          >
            <div>
              <h2 className="text-xl font-semibold mb-2">AI对话</h2>
              <p className="text-blue-100">与我们的AI语言伙伴练习</p>
            </div>
            <MessageSquare size={24} />
          </button>
        </div>
      </div>
      <Navbar />
    </div>
  );
}