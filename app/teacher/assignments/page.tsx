"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { RefreshCw, ArrowRight } from "lucide-react";

interface Assignment {
  id: string;
  studentName: string;
  exerciseTitle: string;
  status: string;
  submittedAt: string;
}

export default function AssignmentsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  if (!session || session.user.role !== "teacher") {
    router.push("/");
    return null;
  }

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      // 模拟获取作业数据
      // 实际项目中应该从API获取
      setAssignments([
        {
          id: "1",
          studentName: "张三",
          exerciseTitle: "英语语法练习",
          status: "已提交",
          submittedAt: "2026-03-25 14:30"
        },
        {
          id: "2",
          studentName: "李四",
          exerciseTitle: "词汇填空练习",
          status: "已批改",
          submittedAt: "2026-03-24 10:15"
        },
        {
          id: "3",
          studentName: "王五",
          exerciseTitle: "听力理解练习",
          status: "已提交",
          submittedAt: "2026-03-25 16:45"
        },
        {
          id: "4",
          studentName: "赵六",
          exerciseTitle: "口语练习",
          status: "未提交",
          submittedAt: ""
        }
      ]);
    } catch (error) {
      console.error("获取作业数据失败:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载作业数据中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50 pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800">作业管理</h1>
          <button
            onClick={fetchAssignments}
            className="text-emerald-600 hover:underline flex items-center"
          >
            <RefreshCw size={16} className="mr-1" />
            刷新
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">所有作业</h2>
          
          {assignments.length === 0 ? (
            <p className="text-gray-500">暂无作业</p>
          ) : (
            <div className="space-y-3">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-800">{assignment.exerciseTitle}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${assignment.status === '已提交' ? 'bg-yellow-100 text-yellow-800' : assignment.status === '已批改' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {assignment.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>学生: {assignment.studentName}</span>
                    {assignment.submittedAt && (
                      <span>提交时间: {assignment.submittedAt}</span>
                    )}
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => router.push(`/teacher/assignments/${assignment.id}`)}
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