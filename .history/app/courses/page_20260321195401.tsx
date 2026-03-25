"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Course = {
  id: string;
  title: string;
  description: string | null;
  level: string;
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-center">加载中...</div>;

  return (
    <div className="min-h-screen bg-emerald-50 p-6">
      <h1 className="text-2xl font-bold mb-4">所有课程</h1>
      <div className="grid gap-4">
        {courses.map((course) => (
          <Link
            key={course.id}
            href={`/courses/${course.id}`}
            className="block p-4 bg-white rounded shadow hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold">{course.title}</h2>
            <p className="text-gray-600">{course.description}</p>
            <p className="text-sm text-emerald-600 mt-1">级别：{course.level}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}