"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { RefreshCw, ArrowRight, User, BookOpen } from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
  progress: number;
  lastActivity: string;
}

export default function StudentsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  if (!session || session.user.role !== "teacher") {
    router.push("/");
    return null;
  }

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      // 模拟获取学生数据
      // 实际项目中应该从API获取
      setStudents([
        {
          id: "1",
          name: "张三",
          email: "zhangsan@example.com",
          progress: 75,
          lastActivity: "2026-03-25 14:30"
        },
        {
          id: "2",
          name: "李四",
          email: "lisi@example.com",
          progress: 45,
          lastActivity: "2026-03-24 10:15"
        },
        {
          id: "3",
          name: "王五",
          email: "wangwu@example.com",
          progress: 90,
          lastActivity: "2026-03-25 16:45"
        },
        {
          id: "4",
          name: "赵六",
          email: "zhaoliu@example.com",
          progress: 30,
          lastActivity: "2026-03-23 09:00"
        }
      ]);
    } catch (error) {
      console.error("获取学生数据失败:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载学生数据中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50 pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800">学生管理</h1>
          <button
            onClick={fetchStudents}
            className="text-emerald-600 hover:underline flex items-center"
          >
            <RefreshCw size={16} className="mr-1" />
            刷新
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">所有学生</h2>
          
          {students.length === 0 ? (
            <p className="text-gray-500">暂无学生</p>
          ) : (
            <div className="space-y-3">
              {students.map((student) => (
                <div key={student.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mr-3">
                        <User size={18} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{student.name}</h3>
                        <p className="text-sm text-gray-500">{student.email}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{student.lastActivity}</span>
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">学习进度</span>
                      <span className="text-emerald-600 font-medium">{student.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-emerald-600 h-2 rounded-full" 
                        style={{ width: `${student.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => router.push(`/teacher/students/${student.id}`)}
                      className="text-emerald-600 hover:underline flex items-center"
                    >
                      查看详情
                      <ArrowRight size={14} className="ml-1" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}