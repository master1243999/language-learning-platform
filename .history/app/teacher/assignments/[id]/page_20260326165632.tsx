"use client";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";

interface Assignment {
  id: string;
  studentName: string;
  exerciseTitle: string;
  status: string;
  submittedAt: string;
  answers: string[];
  questions: string[];
  score: number | null;
}

export default function AssignmentDetail() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const assignmentId = params.id as string;
  
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [scoring, setScoring] = useState(false);
  const [score, setScore] = useState(0);

  if (!session || session.user.role !== "teacher") {
    router.push("/");
    return null;
  }

  useEffect(() => {
    fetchAssignment();
  }, [assignmentId]);

  const fetchAssignment = async () => {
    try {
      // 模拟获取作业详情数据
      // 实际项目中应该从API获取
      setAssignment({
        id: assignmentId,
        studentName: "张三",
        exerciseTitle: "英语语法练习",
        status: "已提交",
        submittedAt: "2026-03-25 14:30",
        questions: [
          "选择正确的动词形式: I ___ to school every day.",
          "选择正确的介词: She is good ___ English.",
          "选择正确的时态: They ___ to the park yesterday."
        ],
        answers: ["go", "at", "went"],
        score: null
      });
    } catch (error) {
      console.error("获取作业详情失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGrade = async () => {
    setScoring(true);
    try {
      // 模拟提交评分
      // 实际项目中应该调用API
      setTimeout(() => {
        setScoring(false);
        if (assignment) {
          const updatedAssignment = { ...assignment, score, status: "已批改" };
          setAssignment(updatedAssignment);
        }
      }, 1000);
    } catch (error) {
      console.error("评分失败:", error);
      setScoring(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载作业详情中...</p>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">作业不存在</h2>
          <button 
            onClick={() => router.push("/teacher/assignments")}
            className="mt-4 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            返回作业列表
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
            onClick={() => router.push("/teacher/assignments")}
            className="flex items-center text-emerald-600 hover:underline mb-6"
          >
            <ArrowLeft size={18} className="mr-2" />
            返回作业列表
          </button>

          <h1 className="text-2xl font-bold text-gray-800 mb-6">作业详情</h1>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">{assignment.exerciseTitle}</h2>
              <span className={`px-2 py-1 text-xs rounded-full ${assignment.status === '已提交' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                {assignment.status}
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-500 mb-4">
              <span>学生: {assignment.studentName}</span>
              <span>提交时间: {assignment.submittedAt}</span>
            </div>
            {assignment.score !== null && (
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-700">得分: </span>
                <span className="text-lg font-bold text-emerald-600">{assignment.score}/100</span>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">学生答案</h2>
            <div className="space-y-4">
              {assignment.questions.map((question, index) => (
                <div key={index} className="border border-gray-100 rounded-lg p-4">
                  <p className="text-gray-800 mb-2">{index + 1}. {question}</p>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-700 mr-2">学生答案: </span>
                    <span className="text-gray-800">{assignment.answers[index]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {assignment.status === "已提交" && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">批改作业</h2>
              <div className="mb-4">
                <label htmlFor="score" className="block text-gray-700 font-medium mb-2">
                  评分
                </label>
                <input
                  type="number"
                  id="score"
                  min="0"
                  max="100"
                  value={score}
                  onChange={(e) => setScore(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button
                onClick={handleGrade}
                disabled={scoring}
                className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {scoring ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    评分中...
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} className="mr-2" />
                    提交评分
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}