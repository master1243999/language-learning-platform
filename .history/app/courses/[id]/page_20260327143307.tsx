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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-modern flex items-center justify-center">
        <div className="text-center relative z-10">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">加载课程中...</p>
        </div>
      </div>
    );
  }
  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-modern flex items-center justify-center">
        <div className="text-center relative z-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">课程不存在</h2>
          <Link 
            href="/courses" 
            className="inline-block bg-emerald-600 text-white py-2 px-4 rounded-lg btn-modern"
          >
            返回课程列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-modern p-6 relative">
      <div className="container mx-auto max-w-4xl relative z-10">
        <Link 
          href="/courses" 
          className="text-emerald-600 mb-4 inline-block hover:underline"
        >
          ← 返回课程列表
        </Link>
        <h1 className="text-2xl font-bold mb-2 page-title">{course.title}</h1>
        <p className="text-gray-600 mb-8">{course.description}</p>
        <div className="grid gap-6">
          {(course.sections || []).map((section) => (
            <Link
              key={section.id}
              href={`/sections/${section.id}`}
              className="block card-modern card-glow p-6 hover:translate-y-[-4px] transition-all duration-300"
            >
              <h2 className="text-xl font-semibold mb-2 hover:text-emerald-600 transition-colors">第{section.order}章：{section.title}</h2>
              <p className="text-gray-600">{section.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}