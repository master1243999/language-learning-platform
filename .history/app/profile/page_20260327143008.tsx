"use client";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import Navbar from "../components/Navbar";

interface Stats {
  learningDays: number;
  totalDuration: number;
  completedSections: number;
  accuracy: number;
  pointsTrend: Array<{
    date: string;
    points: number;
  }>;
}

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("获取学习统计失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  const handleRoleToggle = async () => {
    console.log('开始执行角色切换函数');
    if (!session) {
      console.error('用户未登录，session不存在');
      return;
    }
    if (!session.user) {
      console.error('用户信息不完整，user不存在');
      return;
    }
    if (!session.user.id) {
      console.error('用户信息不完整，id不存在');
      return;
    }
    
    console.log('用户当前角色:', session.user.role);
    
    // 确定目标角色，总是切换到相反的角色
    const currentRole = session.user.role || 'student';
    const targetRole = currentRole === 'teacher' ? 'student' : 'teacher';
    
    console.log('当前角色:', currentRole);
    console.log('目标角色:', targetRole);
    
    setRoleLoading(true);
    try {
      console.log('发送API请求到 /api/user/role，目标角色:', targetRole);
      const response = await fetch('/api/user/role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: targetRole }),
      });
      
      console.log('API响应状态:', response.status);
      console.log('API响应状态文本:', response.statusText);
      
      if (response.ok) {
        console.log('API响应成功，解析响应数据');
        const data = await response.json();
        console.log('API响应数据:', data);
        
        // 先更新session中的角色
        if (update) {
          console.log('更新session中的角色');
          try {
            await update({
              ...session,
              user: {
                ...session.user,
                role: targetRole,
              },
            });
            console.log('Session更新完成');
          } catch (updateError) {
            console.error('Session更新失败:', updateError);
          }
        } else {
          console.error('update函数不存在');
        }
        
        // 使用router.push跳转到教师端仪表盘，保持session状态
        console.log('跳转到教师端仪表盘');
        if (targetRole === 'teacher') {
          console.log('跳转到教师端仪表盘');
          router.push('/teacher/dashboard');
        } else {
          console.log('跳转到学生端首页');
          router.push('/');
        }
      } else {
        console.error('API响应失败');
        try {
          const error = await response.json();
          console.error('切换角色失败:', error);
        } catch (parseError) {
          console.error('解析错误响应失败:', parseError);
        }
      }
    } catch (error) {
      console.error('切换角色失败:', error);
    } finally {
      setRoleLoading(false);
      console.log('角色切换操作完成');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center pb-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载个人资料中...</p>
        </div>
      </div>
    );
  }

  if (!session || !session.user) {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center pb-20">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">请先登录</h2>
          <button 
            onClick={() => router.push("/login")}
            className="mt-4 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            去登录
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-modern pb-20 relative">
      <div className="container mx-auto px-4 py-8 relative z-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-8 page-title">个人资料</h1>
        
        {/* 用户基本信息 */}
        <div className="card-modern card-glow p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-semibold text-xl mr-4">
                {(session.user.name || session.user.email || '?').charAt(0)}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{session.user.name || session.user.email || '未知用户'}</h2>
                <p className="text-gray-600">{session.user.email || '无邮箱'}</p>
                <p className="text-sm text-gray-500">角色: {session.user.role || '学生'}</p>
              </div>
            </div>
            <button
              onClick={handleRoleToggle}
              disabled={roleLoading}
              className="bg-emerald-600 text-white py-2 px-4 rounded-lg btn-modern flex items-center disabled:opacity-50"
            >
              {roleLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <>
                  {session.user.role === 'teacher' ? '切换到学生端' : '切换到教师端'}
                </>
              )}
            </button>
          </div>
        </div>

        {/* 学习统计 */}
        <div className="card-modern card-glow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">学习统计</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-emerald-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">学习天数</p>
              <p className="text-2xl font-bold text-emerald-600">{stats?.learningDays || 0}</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">总学习时长</p>
              <p className="text-2xl font-bold text-emerald-600">{stats?.totalDuration || 0} min</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">已完成章节</p>
              <p className="text-2xl font-bold text-emerald-600">{stats?.completedSections || 0}</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">准确率</p>
              <p className="text-2xl font-bold text-emerald-600">{stats?.accuracy || 0}%</p>
            </div>
          </div>
          <div className="h-64">
            <p className="text-sm font-medium text-gray-700 mb-2">积分趋势（最近7天）</p>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.pointsTrend || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="points" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 最近学习活动 */}
        <div className="card-modern card-glow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">最近活动</h2>
          <div className="space-y-3">
            {/* 模拟最近学习活动数据 */}
            <div className="flex items-center p-3 border border-gray-100 rounded-lg">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mr-3">
                📚
              </div>
              <div>
                <p className="font-medium text-gray-800">完成练习</p>
                <p className="text-sm text-gray-500">英语语法入门</p>
              </div>
            </div>
            <div className="flex items-center p-3 border border-gray-100 rounded-lg">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mr-3">
                💬
              </div>
              <div>
                <p className="font-medium text-gray-800">AI对话</p>
                <p className="text-sm text-gray-500">练习英语对话</p>
              </div>
            </div>
            <div className="flex items-center p-3 border border-gray-100 rounded-lg">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mr-3">
                🃏
              </div>
              <div>
                <p className="font-medium text-gray-800">学习闪卡</p>
                <p className="text-sm text-gray-500">词汇：日常生活</p>
              </div>
            </div>
          </div>
        </div>

        {/* 我的课程 */}
        <div className="card-modern card-glow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">我的课程</h2>
          <div className="space-y-3">
            {/* 模拟我的课程数据 */}
            <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => router.push("/courses/1")}>
              <div>
                <p className="font-medium text-gray-800">英语入门</p>
                <p className="text-sm text-gray-500">级别: A1</p>
              </div>
              <span className="text-emerald-600">→</span>
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => router.push("/courses/2")}>
              <div>
                <p className="font-medium text-gray-800">中级英语</p>
                <p className="text-sm text-gray-500">级别: B1</p>
              </div>
              <span className="text-emerald-600">→</span>
            </div>
          </div>
        </div>

        {/* 退出登录按钮 */}
        <button
          onClick={handleSignOut}
          className="w-full bg-red-600 text-white py-3 px-4 rounded-lg btn-modern hover:bg-red-700"
        >
          退出登录
        </button>
      </div>
      <Navbar />
    </div>
  );
}