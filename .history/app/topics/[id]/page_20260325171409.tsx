"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Exercise = {
  id: string;
  type: string;
  question: string;
  options: string | null;
  answer: string;
  explanation: string | null;
};

type Topic = {
  id: string;
  title: string;
  content: string;
  exercises: Exercise[];
};

export default function TopicDetailPage() {
  const { id } = useParams();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/topics/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTopic(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-6">加载中...</div>;
  if (!topic) return <div className="p-6">主题不存在</div>;

  return (
    <div className="min-h-screen bg-emerald-50 p-6">
      <Link href="/courses" className="text-emerald-600 mb-4 inline-block">
        ← 返回课程
      </Link>
      <h1 className="text-2xl font-bold mb-2">{topic.title}</h1>
      <div
        className="bg-white p-6 rounded shadow mb-6"
        dangerouslySetInnerHTML={{ __html: topic.content }}
      />
      <h2 className="text-xl font-semibold mb-4">练习</h2>
      <div className="grid gap-4">
        {topic.exercises.map((exercise) => (
          <Link
            key={exercise.id}
            href={`/exercises/${exercise.id}`}
            className="block p-4 bg-white rounded shadow hover:shadow-md transition"
          >
            <p className="font-medium">{exercise.question}</p>
            <p className="text-sm text-gray-500 mt-1">
              类型：{exercise.type === "single_choice" ? "单选题" : "多选题"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}