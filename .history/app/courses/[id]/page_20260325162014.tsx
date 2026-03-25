"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "../../components/Navbar";

export default function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${id}`);
        const data = await response.json();
        setCourse(data);
      } catch (error) {
        console.error("获取课程详情失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center pb-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载课程详情中...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center pb-20">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Course not found</h2>
          <button 
            onClick={() => router.push("/courses")}
            className="mt-4 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50 pb-20">
      <div className="container mx-auto px-4 py-8">
        <button 
          onClick={() => router.push("/courses")}
          className="text-emerald-600 hover:text-emerald-800 mb-4 flex items-center"
        >
          ← Back to Courses
        </button>
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="inline-block bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-0.5 rounded mb-4">
            {course.level}
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{course.title}</h1>
          <p className="text-gray-600 mb-6">{course.description}</p>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">Sections</h2>
        {course.sections.map((section) => (
          <div key={section.id} className="bg-white rounded-lg shadow-sm p-6 mb-4">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Section {section.order}: {section.title}</h3>
            <div className="space-y-3">
              {section.topics.map((topic) => (
                <div 
                  key={topic.id} 
                  className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => router.push(`/topics/${topic.id}`)}
                >
                  <div>
                    <span className="text-sm text-gray-500 mr-2">{topic.order}.</span>
                    <span className="font-medium text-gray-800">{topic.title}</span>
                  </div>
                  <span className="text-emerald-600">→</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Navbar />
    </div>
  );
}"use client";
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
        {course.sections.map((section) => (
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