"use client";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string | null;
  level: string;
  sections: Section[];
}

interface Section {
  id: string;
  title: string;
  order: number;
  topics: Topic[];
}

interface Topic {
  id: string;
  title: string;
  order: number;
  exercises: Exercise[];
}

interface Exercise {
  id: string;
  title: string;
  type: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export default function AssignExercises() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  if (!session || session.user.role !== "teacher") {
    router.push("/");
    return null;
  }

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      // 模拟获取课程数据
      // 实际项目中应该从API获取
      setCourse({
        id: courseId,
        title: "英语入门",
        description: "适合初学者的英语课程",
        level: "A1",
        sections: [
          {
            id: "1",
            title: "基础语法",
            order: 1,
            topics: [
              {
                id: "1",
                title: "动词变位",
                order: 1,
                exercises: [
                  {
                    id: "1",
                    title: "一般现在时练习",
                    type: "multiple-choice",
                    question: "选择正确的动词形式: I ___ to school every day.",
                    options: ["go", "goes", "went", "gone"],
                    correctAnswer: "go"
                  },
                  {
                    id: "2",
                    title: "现在进行时练习",
                    type: "multiple-choice",
                    question: "选择正确的动词形式: She ___ TV now.",
                    options: ["watch", "watches", "watching", "is watching"],
                    correctAnswer: "is watching"
                  }
                ]
              }
            ]
          },
          {
            id: "2",
            title: "基础词汇",
            order: 2,
            topics: [
              {
                id: "2",
                title: "日常生活词汇",
                order: 1,
                exercises: [
                  {
                    id: "3",
                    title: "家庭词汇练习",
                    type: "multiple-choice",
                    question: "选择正确的单词: The place where we live is called a ___.",
                    options: ["house", "car", "tree", "book"],
                    correctAnswer: "house"
                  }
                ]
              }
            ]
          }
        ]
      });
    } catch (error) {
      console.error("获取课程数据失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExerciseToggle = (exerciseId: string) => {
    setSelectedExercises(prev => 
      prev.includes(exerciseId)
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  const handleAssign = async () => {
    if (selectedExercises.length === 0) {
      alert("请至少选择一个练习");
      return;
    }

    setAssigning(true);
    try {
      // 模拟布置作业
      // 实际项目中应该调用API
      setTimeout(() => {
        setAssigning(false);
        alert("作业布置成功！");
        router.push("/teacher/dashboard");
      }, 1000);
    } catch (error) {
      console.error("布置作业失败:", error);
      setAssigning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载课程数据中...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">课程不存在</h2>
          <button 
            onClick={() => router.push("/teacher/dashboard")}
            className="mt-4 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            返回教师面板
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50 pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.push("/teacher/dashboard")}
            className="flex items-center text-emerald-600 hover:underline mb-6"
          >
            <ArrowLeft size={18} className="mr-2" />
            返回教师面板
          </button>

          <h1 className="text-2xl font-bold text-gray-800 mb-6">为课程布置作业</h1>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">{course.title}</h2>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">选择练习</h3>
            
            <div className="space-y-6">
              {course.sections.map((section) => (
                <div key={section.id}>
                  <h4 className="font-medium text-gray-700 mb-2">{section.title}</h4>
                  
                  <div className="ml-4 space-y-4">
                    {section.topics.map((topic) => (
                      <div key={topic.id}>
                        <h5 className="font-medium text-gray-600 mb-2">{topic.title}</h5>
                        
                        <div className="ml-4 space-y-2">
                          {topic.exercises.map((exercise) => (
                            <div 
                              key={exercise.id} 
                              className={`border border-gray-200 rounded-lg p-3 flex items-center ${selectedExercises.includes(exercise.id) ? 'bg-emerald-50 border-emerald-300' : 'hover:bg-gray-50'}`}
                              onClick={() => handleExerciseToggle(exercise.id)}
                            >
                              <input
                                type="checkbox"
                                checked={selectedExercises.includes(exercise.id)}
                                onChange={() => handleExerciseToggle(exercise.id)}
                                className="mr-3"
                              />
                              <div>
                                <p className="font-medium text-gray-800">{exercise.title}</p>
                                <p className="text-sm text-gray-500">{exercise.type}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => router.push("/teacher/dashboard")}
              className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleAssign}
              disabled={assigning || selectedExercises.length === 0}
              className="bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {assigning ? "布置中..." : `布置作业 (${selectedExercises.length})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}"use client";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string | null;
  level: string;
  sections: Section[];
}

interface Section {
  id: string;
  title: string;
  order: number;
  topics: Topic[];
}

interface Topic {
  id: string;
  title: string;
  order: number;
  exercises: Exercise[];
}

interface Exercise {
  id: string;
  title: string;
  type: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export default function AssignExercises() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  if (!session || session.user.role !== "teacher") {
    router.push("/");
    return null;
  }

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      // 模拟获取课程数据
      // 实际项目中应该从API获取
      setCourse({
        id: courseId,
        title: "英语入门",
        description: "适合初学者的英语课程",
        level: "A1",
        sections: [
          {
            id: "1",
            title: "基础语法",
            order: 1,
            topics: [
              {
                id: "1",
                title: "动词变位",
                order: 1,
                exercises: [
                  {
                    id: "1",
                    title: "一般现在时练习",
                    type: "multiple-choice",
                    question: "选择正确的动词形式: I ___ to school every day.",
                    options: ["go", "goes", "went", "gone"],
                    correctAnswer: "go"
                  },
                  {
                    id: "2",
                    title: "现在进行时练习",
                    type: "multiple-choice",
                    question: "选择正确的动词形式: She ___ TV now.",
                    options: ["watch", "watches", "watching", "is watching"],
                    correctAnswer: "is watching"
                  }
                ]
              }
            ]
          },
          {
            id: "2",
            title: "基础词汇",
            order: 2,
            topics: [
              {
                id: "2",
                title: "日常生活词汇",
                order: 1,
                exercises: [
                  {
                    id: "3",
                    title: "家庭词汇练习",
                    type: "multiple-choice",
                    question: "选择正确的单词: The place where we live is called a ___.",
                    options: ["house", "car", "tree", "book"],
                    correctAnswer: "house"
                  }
                ]
              }
            ]
          }
        ]
      });
    } catch (error) {
      console.error("获取课程数据失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExerciseToggle = (exerciseId: string) => {
    setSelectedExercises(prev => 
      prev.includes(exerciseId)
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  const handleAssign = async () => {
    if (selectedExercises.length === 0) {
      alert("请至少选择一个练习");
      return;
    }

    setAssigning(true);
    try {
      // 模拟布置作业
      // 实际项目中应该调用API
      setTimeout(() => {
        setAssigning(false);
        alert("作业布置成功！");
        router.push("/teacher/dashboard");
      }, 1000);
    } catch (error) {
      console.error("布置作业失败:", error);
      setAssigning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载课程数据中...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">课程不存在</h2>
          <button 
            onClick={() => router.push("/teacher/dashboard")}
            className="mt-4 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            返回教师面板
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50 pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.push("/teacher/dashboard")}
            className="flex items-center text-emerald-600 hover:underline mb-6"
          >
            <ArrowLeft size={18} className="mr-2" />
            返回教师面板
          </button>

          <h1 className="text-2xl font-bold text-gray-800 mb-6">为课程布置作业</h1>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">{course.title}</h2>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">选择练习</h3>
            
            <div className="space-y-6">
              {course.sections.map((section) => (
                <div key={section.id}>
                  <h4 className="font-medium text-gray-700 mb-2">{section.title}</h4>
                  
                  <div className="ml-4 space-y-4">
                    {section.topics.map((topic) => (
                      <div key={topic.id}>
                        <h5 className="font-medium text-gray-600 mb-2">{topic.title}</h5>
                        
                        <div className="ml-4 space-y-2">
                          {topic.exercises.map((exercise) => (
                            <div 
                              key={exercise.id} 
                              className={`border border-gray-200 rounded-lg p-3 flex items-center ${selectedExercises.includes(exercise.id) ? 'bg-emerald-50 border-emerald-300' : 'hover:bg-gray-50'}`}
                              onClick={() => handleExerciseToggle(exercise.id)}
                            >
                              <input
                                type="checkbox"
                                checked={selectedExercises.includes(exercise.id)}
                                onChange={() => handleExerciseToggle(exercise.id)}
                                className="mr-3"
                              />
                              <div>
                                <p className="font-medium text-gray-800">{exercise.title}</p>
                                <p className="text-sm text-gray-500">{exercise.type}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => router.push("/teacher/dashboard")}
              className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleAssign}
              disabled={assigning || selectedExercises.length === 0}
              className="bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {assigning ? "布置中..." : `布置作业 (${selectedExercises.length})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}