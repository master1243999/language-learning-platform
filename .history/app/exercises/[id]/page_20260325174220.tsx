"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "../../components/Navbar";

interface Exercise {
  id: string;
  type: string;
  question: string;
  options?: string;
  answer: string;
  explanation?: string;
  topicId: string;
}

interface Result {
  isCorrect: boolean;
  correctAnswer: string;
  explanation?: string;
}

export default function ExerciseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const response = await fetch(`/api/exercises/${id}`);
        const data = await response.json();
        setExercise(data);
      } catch (error) {
        console.error("获取练习详情失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/exercises/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ answer: userAnswer })
      });
      const data = await response.json();
      setResult(data);
      setSubmitted(true);
    } catch (error) {
      console.error("提交练习失败:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center pb-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载练习详情中...</p>
        </div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center pb-20">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">练习不存在</h2>
          <button 
            onClick={() => router.push("/courses")}
            className="mt-4 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            返回课程
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50 pb-20">
      <div className="container mx-auto px-4 py-8">
        <button 
          onClick={() => router.back()}
          className="text-emerald-600 hover:text-emerald-800 mb-4 flex items-center"
        >
          ← 返回
        </button>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-xl font-bold text-gray-800 mb-4">练习: {exercise.type}</h1>
          <p className="text-gray-600 mb-6">{exercise.question}</p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {exercise.type === "single_choice" && exercise.options && (
                <div className="space-y-2">
                  {JSON.parse(exercise.options).map((option, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="radio"
                        id={`option-${index}`}
                        name="answer"
                        value={option}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        className="mr-2"
                      />
                      <label htmlFor={`option-${index}`} className="text-gray-700">{option}</label>
                    </div>
                  ))}
                </div>
              )}
              {exercise.type === "fill_blank" && (
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="输入您的答案"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              )}
              <button 
                type="submit" 
                className="bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                提交
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${result.isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                <p className="font-medium">{result.isCorrect ? "正确！" : "错误！"}</p>
              </div>
              {!result.isCorrect && (
                <div className="p-4 bg-yellow-100 text-yellow-800 rounded-lg">
                  <p className="font-medium">正确答案：</p>
                  <p>{result.correctAnswer}</p>
                </div>
              )}
              {result.explanation && (
                <div className="p-4 bg-blue-100 text-blue-800 rounded-lg">
                  <p className="font-medium">解析：</p>
                  <p>{result.explanation}</p>
                </div>
              )}
              <button 
                onClick={() => router.back()}
                className="bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                返回主题
              </button>
            </div>
          )}
        </div>
      </div>
      <Navbar />
    </div>
  );
}