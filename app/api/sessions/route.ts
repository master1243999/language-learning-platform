import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  try {
    const { topicId, duration, points } = await request.json();
    
    const session = await prisma.learningSession.create({
      data: {
        userId: session.user.id,
        topicId,
        duration,
        points,
        endTime: new Date()
      }
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error("创建学习会话失败:", error);
    return NextResponse.json({ error: "创建失败" }, { status: 500 });
  }
}