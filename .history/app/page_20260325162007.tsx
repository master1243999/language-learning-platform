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
        id: "1",
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
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Language Learning Platform</h1>
          <p className="text-gray-600 mb-8">Start your language learning journey today with our interactive courses and AI-powered practice.</p>
          <div className="flex flex-col gap-4">
            <button
              onClick={() => router.push("/login")}
              className="bg-emerald-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => router.push("/register")}
              className="border border-emerald-600 text-emerald-600 py-3 px-6 rounded-lg font-medium hover:bg-emerald-50 transition-colors"
            >
              Register
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
            Welcome back, {session.user.name || session.user.email}!
          </h1>
        </div>

        {/* 学习进度条 */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex justify-between mb-2">
            <span className="font-medium text-gray-700">Learning Progress</span>
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
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Continue Learning</h2>
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
              <h2 className="text-xl font-semibold mb-2">Browse Courses</h2>
              <p className="text-emerald-100">Explore our collection of language courses</p>
            </div>
            <BookOpen size={24} />
          </button>
          <button
            onClick={() => router.push("/ai")}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6 flex items-center justify-between shadow-md hover:shadow-lg transition-shadow"
          >
            <div>
              <h2 className="text-xl font-semibold mb-2">AI Conversation</h2>
              <p className="text-blue-100">Practice with our AI language partner</p>
            </div>
            <MessageSquare size={24} />
          </button>
        </div>
      </div>
      <Navbar />
    </div>
  );
}"use client";
import Image from "next/image";
import Link from "next/link";

const user = {
  name: "小明",
  avatar: "/avatar.png",
};

const progress = {
  today: 38,
  totalPercentage: 62,
};

const continueLessons = [
  {
    id: "section-2",
    title: "日常交流句型",
    description: "继续学习日常沟通句型，提升口语流利度。",
    status: "进行中",
    progress: 45,
  },
  {
    id: "section-3",
    title: "旅行与购物",
    description: "巩固购物、点餐等实用场景表达。",
    status: "未开始",
    progress: 0,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-100 text-emerald-900">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-6 md:px-8">
        <header className="mb-6 flex items-center justify-between rounded-xl bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 overflow-hidden rounded-full border border-emerald-200">
              <Image
                src={user.avatar}
                width={48}
                height={48}
                alt="用户头像"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm text-emerald-600">欢迎回来</p>
              <h1 className="text-xl font-bold">{user.name}</h1>
            </div>
          </div>
        </header>

        <section className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium uppercase tracking-wide text-emerald-600">学习进度</p>
            <p className="text-sm font-semibold text-emerald-700">今日 {progress.today} 分钟</p>
          </div>
          <div className="h-4 rounded-full bg-emerald-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
              style={{ width: `${progress.totalPercentage}%` }}
            ></div>
          </div>
          <p className="mt-2 text-sm text-emerald-700">总体完成率 {progress.totalPercentage}%</p>
        </section>

        <section className="mb-20">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">继续学习</h2>
            <span className="text-sm text-emerald-600">保持进度，养成习惯</span>
          </div>
          <div className="grid gap-4">
            {continueLessons.map((lesson) => (
              <article
                key={lesson.id}
                className="rounded-xl border border-emerald-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-base font-semibold">{lesson.title}</h3>
                  <span className="text-xs font-medium text-emerald-600">{lesson.status}</span>
                </div>
                <p className="mb-3 text-sm text-emerald-600">{lesson.description}</p>
                <div className="h-2 rounded-full bg-emerald-100">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${lesson.progress}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-emerald-500">章节进度 {lesson.progress}%</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 border-t border-emerald-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl justify-around px-4 py-3 text-sm font-medium text-emerald-700">
          <a href="#" className="flex flex-col items-center gap-1 text-emerald-900">
            首页
          </a>
          {/* 关键修改：链接改为 /courses */}
          <Link href="/courses" className="flex flex-col items-center gap-1 hover:text-emerald-900">
            课程
          </Link>
          <a href="/profile" className="flex flex-col items-center gap-1 hover:text-emerald-900">
            我的
          </a>
        </div>
      </footer>
    </div>
  );
}