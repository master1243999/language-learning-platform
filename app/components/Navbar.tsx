"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Home, BookOpen, MessageSquare, User } from "lucide-react";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(
    pathname.includes("courses") ? "courses" :
    pathname.includes("ai") ? "ai" :
    pathname.includes("profile") ? "profile" : "home"
  );

  if (!session) {
    return null;
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    switch (tab) {
      case "home":
        router.push("/");
        break;
      case "courses":
        router.push("/courses");
        break;
      case "ai":
        router.push("/ai");
        break;
      case "profile":
        router.push("/profile");
        break;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
      <div className="flex justify-around items-center h-16">
        <button
          onClick={() => handleTabChange("home")}
          className={`flex flex-col items-center justify-center px-4 py-2 ${activeTab === "home" ? "text-emerald-600" : "text-gray-500"}`}
        >
          <Home size={20} />
          <span className="text-xs mt-1">首页</span>
        </button>
        <button
          onClick={() => handleTabChange("courses")}
          className={`flex flex-col items-center justify-center px-4 py-2 ${activeTab === "courses" ? "text-emerald-600" : "text-gray-500"}`}
        >
          <BookOpen size={20} />
          <span className="text-xs mt-1">课程</span>
        </button>
        <button
          onClick={() => handleTabChange("ai")}
          className={`flex flex-col items-center justify-center px-4 py-2 ${activeTab === "ai" ? "text-emerald-600" : "text-gray-500"}`}
        >
          <MessageSquare size={20} />
          <span className="text-xs mt-1">AI对话</span>
        </button>
        <button
          onClick={() => handleTabChange("profile")}
          className={`flex flex-col items-center justify-center px-4 py-2 ${activeTab === "profile" ? "text-emerald-600" : "text-gray-500"}`}
        >
          <User size={20} />
          <span className="text-xs mt-1">我的</span>
        </button>
      </div>
    </div>
  );
}