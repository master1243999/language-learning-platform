"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BookOpen, CheckSquare, FileText, Users, ArrowRight, RefreshCw } from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string | null;
  level: string;
}

interface Assignment {
  id: string;
  studentName: string;
  exerciseTitle: string;
  status: string;
  submittedAt: string;
}

export default function TeacherDashboard() {
  const { data: session, update } = useSession();
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/");
      return;
    }
    // 暂时移除角色检查，让页面能够加载
    // 后续可以通过API调用来验证用户角色
    fetchData();
  }, [session, router]);

  const fetchData = async () => {
    try {
      // 获取课程数据
      const coursesRes = await fetch("/api/courses");
      if (coursesRes.ok) {
        const coursesData = await coursesRes.json();
        setCourses(coursesData);
      }

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
        }
      ]);
    } catch (error) {
      console.error("获取数据失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = async () => {
    if (!session || !session.user) {
      console.error('用户未登录或用户信息不完整');
      return;
    }
    
    setRoleLoading(true);
    try {
      const newRole = 'student';
      
      const response = await fetch('/api/user/role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });
      
      if (response.ok) {
        // 更新session中的角色
        if (update) {
          await update({
            ...session,
            user: {
              ...session.user,
              role: newRole,
            },
          });
        }
        
        // 跳转到学生端首页
        router.push('/');
      } else {
        const error = await response.json();
        console.error('切换角色失败:', error);
      }
    } catch (error) {
      console.error('切换角色失败:', error);
    } finally {
      setRoleLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载教师面板中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-modern pb-20 relative">
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800 page-title">教师管理面板</h1>
          <button
            onClick={handleRoleToggle}
            disabled={roleLoading}
            className="bg-emerald-600 text-white py-2 px-4 rounded-lg btn-modern flex items-center disabled:opacity-50"
          >
            {roleLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <>
                <RefreshCw size={16} className="mr-2" />
                切换到学生端
              </>
            )}
          </button>
        </div>

        {/* 功能卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => router.push("/teacher/courses/create")}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg p-6 flex items-center justify-between btn-modern"
          >
            <div>
              <h2 className="text-xl font-semibold mb-2">创建课程</h2>
              <p className="text-emerald-100">创建新的语言课程</p>
            </div>
            <BookOpen size={24} />
          </button>
          <button
            onClick={() => router.push("/teacher/assignments")}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6 flex items-center justify-between btn-modern"
          >
            <div>
              <h2 className="text-xl font-semibold mb-2">布置作业</h2>
              <p className="text-blue-100">为学生布置练习作业</p>
            </div>
            <FileText size={24} />
          </button>
          <button
            onClick={() => router.push("/teacher/grading")}
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6 flex items-center justify-between btn-modern"
          >
            <div>
              <h2 className="text-xl font-semibold mb-2">批阅作业</h2>
              <p className="text-purple-100">批改学生提交的作业</p>
            </div>
            <CheckSquare size={24} />
          </button>
        </div>

        {/* 待批改作业 */}
        <div className="card-modern card-glow p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">待批改作业</h2>
            <button
              onClick={fetchData}
              className="text-emerald-600 hover:underline flex items-center"
            >
              <RefreshCw size={16} className="mr-1" />
              刷新
            </button>
          </div>
          {assignments.length === 0 ? (
            <p className="text-gray-500">暂无待批改作业</p>
          ) : (
            <div className="space-y-3">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-800">{assignment.exerciseTitle}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${assignment.status === '已提交' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                      {assignment.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>学生: {assignment.studentName}</span>
                    <span>提交时间: {assignment.submittedAt}</span>
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

        {/* 我的课程 */}
        <div className="card-modern card-glow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">我的课程</h2>
          {courses.length === 0 ? (
            <p className="text-gray-500">暂无课程</p>
          ) : (
            <div className="space-y-3">
              {courses.map((course) => (
                <div key={course.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50">
                  <h3 className="font-medium text-gray-800 mb-1">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{course.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded">
                      级别: {course.level}
                    </span>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => router.push(`/courses/${course.id}`)}
                        className="text-emerald-600 hover:underline text-sm"
                      >
                        查看
                      </button>
                      <button
                        onClick={() => router.push(`/teacher/courses/${course.id}/edit`)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => router.push(`/teacher/courses/${course.id}/assign`)}
                        className="text-purple-600 hover:underline text-sm"
                      >
                        布置作业
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 学生管理 */}
        <div className="card-modern card-glow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">学生管理</h2>
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => router.push("/teacher/students")}>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mr-4">
                <Users size={24} />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">查看所有学生</h3>
                <p className="text-sm text-gray-500">管理学生账户和学习进度</p>
              </div>
            </div>
            <ArrowRight size={18} className="text-emerald-600" />
          </div>
        </div>
      </div>
    </div>
  );
}