import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: {
        exercise: true,
        teacher: { select: { name: true } },
        submissions: {
          where: { userId: session.user.id },
          select: { answer: true, score: true, feedback: true }
        }
      }
    });

    if (!assignment) {
      return NextResponse.json({ error: "作业不存在" }, { status: 404 });
    }

    // 检查权限：教师或分配的学生
    if (session.user.role !== 'teacher' && assignment.studentId !== session.user.id) {
      return NextResponse.json({ error: "无权限" }, { status: 403 });
    }

    return NextResponse.json(assignment);
  } catch (error) {
    console.error("获取作业失败:", error);
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }
}