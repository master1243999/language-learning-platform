"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Topic = {
  id: string;
  title: string;
  content: string;
  order: number;
};

type Section = {
  id: string;
  title: string;
  description: string | null;
  topics: Topic[];
};

export default function SectionDetailPage() {
  const { id } = useParams();
  const [section, setSection] = useState<Section | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/sections/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setSection(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-6">加载中...</div>;
  if (!section) return <div className="p-6">章节不存在</div>;

  return (
    <div className="min-h-screen bg-emerald-50 p-6">
      <Link href="/courses" className="text-emerald-600 mb-4 inline-block">
        ← 返回课程
      </Link>
      <h1 className="text-2xl font-bold mb-2">{section.title}</h1>
      <p className="text-gray-600 mb-4">{section.description}</p>
      <div className="grid gap-4">
        {section.topics.map((topic) => (
          <Link
            key={topic.id}
            href={`/topics/${topic.id}`}
            className="block p-4 bg-white rounded shadow hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold">{topic.title}</h2>
            <div className="text-gray-600 mt-1" dangerouslySetInnerHTML={{ __html: topic.content }} />
          </Link>
        ))}
      </div>
    </div>
  );
}