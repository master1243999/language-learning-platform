"use client";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft, BookOpen, CheckSquare, User } from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
  progress: number;
  lastActivity: string;
  courses: Course[];
  completedExercises: number;
  totalExercises: number;
}

interface Course {
  id: string;
  title: string;
  progress: number;
}

export default function StudentDetail() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const studentId = params.id as string;
  
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  if (!session || session.user.role !== "teacher") {
    router.push("/");
    return null;
  }

  useEffect(() => {
    fetchStudent();
  }, [studentId]);

  const fetchStudent = async () => {
    try {
      // 模拟获取学生详情数据
      // 实际项目中应该从API获取
      setStudent({
        id: studentId,
        name: "张三",
        email: "zhangsan@example.com",
        progress: 75,
        lastActivity: "2026-03-25 14:30",
        courses: [
          { id: "1", title: "英语入门", progress: 90 },
          { id: "2", title: "中级英语", progress: 60 }
        ],
        completedExercises: 25,
        totalExercises: 30
      });
    } catch (error) {
      console.error("获取学生详情失败:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载学生详情中...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">学生不存在</h2>
          <button 
            onClick={() => router.push("/teacher/students")}
            className="mt-4 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            返回学生列表
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
            onClick={() => router.push("/teacher/students")}
            className="flex items-center text-emerald-600 hover:underline mb-6"
          >
            <ArrowLeft size={18} className="mr-2" />
            返回学生列表
          </button>

          <h1 className="text-2xl font-bold text-gray-800 mb-6">学生详情</h1>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mr-4">
                <User size={24} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{student.name}</h2>
                <p className="text-gray-600">{student.email}</p>
                <p className="text-sm text-gray-500">最后活动: {student.lastActivity}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-emerald-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">学习进度</p>
                <p className="text-2xl font-bold text-emerald-600">{student.progress}%</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">已完成练习</p>
                <p className="text-2xl font-bold text-emerald-600">{student.completedExercises}</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">总练习数</p>
                <p className="text-2xl font-bold text-emerald-600">{student.totalExercises}</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">课程数</p>
                <p className="text-2xl font-bold text-emerald-600">{student.courses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">课程进度</h2>
            <div className="space-y-4">
              {student.courses.map((course) => (
                <div key={course.id} className="border border-gray-100 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-800">{course.title}</h3>
                    <span className="text-emerald-600 font-medium">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-emerald-600 h-2 rounded-full" 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">学习活动</h2>
            <div className="space-y-3">
              <div className="flex items-center p-3 border border-gray-100 rounded-lg">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mr-3">
                  <CheckSquare size={18} />
                </div>
                <div>
                  <p className="font-medium text-gray-800">完成练习</p>
                  <p className="text-sm text-gray-500">英语语法练习 - 2026-03-25 14:30</p>
                </div>
              </div>
              <div className="flex items-center p-3 border border-gray-100 rounded-lg">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mr-3">
                  <BookOpen size={18} />
                </div>
                <div>
                  <p className="font-medium text-gray-800">学习课程</p>
                  <p className="text-sm text-gray-500">英语入门 - 2026-03-24 10:15</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}