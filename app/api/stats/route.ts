import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  try {
    // 获取学习天数
    const learningDays = await prisma.learningSession.groupBy({
      by: ["startTime"],
      where: { userId: session.user.id },
      _count: { id: true }
    });

    // 获取总学习时长
    const totalDuration = await prisma.learningSession.aggregate({
      where: { userId: session.user.id },
      _sum: { duration: true }
    });

    // 获取完成章节数
    const completedSections = await prisma.progress.count({
      where: { userId: session.user.id, completed: true }
    });

    // 获取正确率
    const exerciseRecords = await prisma.exerciseRecord.groupBy({
      by: ["isCorrect"],
      where: { userId: session.user.id },
      _count: { id: true }
    });

    let correctCount = 0;
    let totalCount = 0;
    exerciseRecords.forEach(record => {
      totalCount += record._count.id;
      if (record.isCorrect) {
        correctCount += record._count.id;
      }
    });

    const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

    // 获取最近7天的积分趋势
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const pointsTrend = await prisma.learningSession.groupBy({
      by: ["startTime"],
      where: {
        userId: session.user.id,
        startTime: { gte: sevenDaysAgo }
      },
      _sum: { points: true }
    });

    return NextResponse.json({
      learningDays: learningDays.length,
      totalDuration: totalDuration._sum.duration || 0,
      completedSections,
      accuracy,
      pointsTrend: pointsTrend.map(item => ({
        date: item.startTime.toISOString().split('T')[0],
        points: item._sum.points || 0
      }))
    });
  } catch (error) {
    console.error("获取学习统计失败:", error);
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }
}