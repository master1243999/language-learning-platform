"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateCourse() {
  const { data: session } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("A1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!session || session.user.role !== "teacher") {
    router.push("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, level }),
      });

      if (response.ok) {
        router.push("/teacher/dashboard");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "创建课程失败");
      }
    } catch (error) {
      setError("创建课程失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">创建新课程</h1>
          
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                课程标题
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                课程描述
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              ></textarea>
            </div>

            <div className="mb-6">
              <label htmlFor="level" className="block text-gray-700 font-medium mb-2">
                课程级别
              </label>
              <select
                id="level"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="A1">A1 - 初级</option>
                <option value="A2">A2 - 中级</option>
                <option value="B1">B1 - 中高级</option>
                <option value="B2">B2 - 高级</option>
                <option value="C1">C1 - 流利</option>
                <option value="C2">C2 - 精通</option>
              </select>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => router.push("/teacher/dashboard")}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {loading ? "创建中..." : "创建课程"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}