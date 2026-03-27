"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

type Course = {
  id: string;
  title: string;
  description: string | null;
  level: string;
  sections: Array<{
    id: string;
    title: string;
  }>;
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/courses");
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("获取课程失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-modern flex items-center justify-center pb-20">
        <div className="text-center relative z-10">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">加载课程中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-modern pb-20 relative">
      <div className="container mx-auto px-4 py-8 relative z-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-8 page-title">所有课程</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div 
              key={course.id} 
              className="card-modern card-glow overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2"
              onClick={() => router.push(`/courses/${course.id}`)}
            >
              <div className="p-6">
                <div className="inline-block bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-0.5 rounded mb-4">
                  {course.level}
                </div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2 hover:text-emerald-600 transition-colors">{course.title}</h2>
                <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <span>{course.sections?.length || 0} 章节</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Navbar />
    </div>
  );
}