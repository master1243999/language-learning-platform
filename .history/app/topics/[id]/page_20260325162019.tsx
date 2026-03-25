"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "../../components/Navbar";

export default function TopicDetailPage() {
  const { id } = useParams();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const response = await fetch(`/api/topics/${id}`);
        const data = await response.json();
        setTopic(data);
      } catch (error) {
        console.error("获取主题详情失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopic();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center pb-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载主题详情中...</p>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center pb-20">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Topic not found</h2>
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
        <div className="flex items-center mb-4">
          <button 
            onClick={() => router.push(`/courses/${topic.section.course.id}`)}
            className="text-emerald-600 hover:text-emerald-800 mr-4 flex items-center"
          >
            ← Back to Course
          </button>
          <span className="text-gray-500">{topic.section.course.title} / {topic.section.title}</span>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{topic.title}</h1>
          <div className="text-gray-600 mb-6">
            {/* 实际项目中这里应该渲染富文本内容 */}
            <p>This is the content of the topic. It can include text, images, and other multimedia elements.</p>
          </div>
        </div>

        {/* 练习题部分 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Exercises</h2>
          <div className="space-y-4">
            {topic.exercises.map((exercise, index) => (
              <div key={exercise.id} className="p-4 border border-gray-100 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">Exercise {index + 1}: {exercise.type}</h3>
                <p className="text-gray-600 mb-4">{exercise.question}</p>
                <button 
                  onClick={() => router.push(`/exercises/${exercise.id}`)}
                  className="bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Start Exercise
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 闪卡部分 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Flashcards</h2>
          <button 
            onClick={() => router.push(`/flashcards/${id}`)}
            className="bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Study Flashcards
          </button>
        </div>
      </div>
      <Navbar />
    </div>
  );
}"use client";
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