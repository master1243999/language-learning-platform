"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Course {
  id: string;
  title: string;
  description: string | null;
  level: string;
}

export default function TeacherDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "teacher") {
      router.push("/");
      return;
    }
    fetchCourses();
  }, [session, status, router]);

  const fetchCourses = async () => {
    const res = await fetch("/api/courses");
    if (res.ok) {
      const data = await res.json();
      setCourses(data);
    }
  };

  if (status === "loading") return <div>加载中...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">教师管理面板</h1>

        <div className="mb-8">
          <button
            onClick={() => router.push("/teacher/courses/create")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            创建新课程
          </button>
        </div>

        <div className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-semibold mb-4">我的课程</h2>
          {courses.length === 0 ? (
            <p>暂无课程</p>
          ) : (
            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course.id} className="border rounded p-4">
                  <h3 className="font-medium">{course.title}</h3>
                  <p className="text-gray-600">{course.description}</p>
                  <p className="text-sm text-gray-500">级别: {course.level}</p>
                  <div className="mt-2">
                    <button
                      onClick={() => router.push(`/courses/${course.id}`)}
                      className="text-blue-600 hover:underline mr-4"
                    >
                      查看
                    </button>
                    <button
                      onClick={() => router.push(`/teacher/courses/${course.id}/edit`)}
                      className="text-green-600 hover:underline"
                    >
                      编辑
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}