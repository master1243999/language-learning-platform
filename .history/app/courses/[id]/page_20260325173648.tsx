"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Section = {
  id: string;
  title: string;
  description: string | null;
  order: number;
};

type Course = {
  id: string;
  title: string;
  description: string | null;
  level: string;
  sections: Section[];
};

export default function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/courses/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCourse(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-6">加载中...</div>;
  if (!course) return <div className="p-6">课程不存在</div>;

  return (
    <div className="min-h-screen bg-emerald-50 p-6">
      <Link href="/courses" className="text-emerald-600 mb-4 inline-block">
        ← 返回课程列表
      </Link>
      <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
      <p className="text-gray-600 mb-4">{course.description}</p>
      <div className="grid gap-4">
        {(course.sections || []).map((section) => (
          <Link
            key={section.id}
            href={`/sections/${section.id}`}
            className="block p-4 bg-white rounded shadow hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold">第{section.order}章：{section.title}</h2>
            <p className="text-gray-600">{section.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}