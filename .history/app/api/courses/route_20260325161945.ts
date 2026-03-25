import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  const courses = await prisma.course.findMany({
    select: { id: true, title: true, description: true, level: true, sections: { select: { id: true, title: true, order: true } } }
  });
  return NextResponse.json(courses);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'teacher') {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  try {
    const { title, description, level } = await request.json();
    if (!title || !level) {
      return NextResponse.json({ error: "标题和级别不能为空" }, { status: 400 });
    }

    const course = await prisma.course.create({
      data: { title, description, level }
    });
    return NextResponse.json(course);
  } catch (error) {
    console.error("创建课程失败:", error);
    return NextResponse.json({ error: "创建失败" }, { status: 500 });
  }
}