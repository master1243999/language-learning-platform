import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        sections: {
          orderBy: { order: "asc" },
          include: {
            topics: {
              orderBy: { order: "asc" },
              select: { id: true, title: true, order: true }
            }
          }
        }
      }
    });

    if (!course) {
      return NextResponse.json({ error: "课程不存在" }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error("获取课程详情失败:", error);
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'teacher') {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const { title, description, level } = await request.json();
    
    if (!title || !level) {
      return NextResponse.json({ error: "标题和级别不能为空" }, { status: 400 });
    }

    const course = await prisma.course.update({
      where: { id },
      data: { title, description, level }
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error("更新课程失败:", error);
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'teacher') {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  try {
    const { id } = await params;
    
    // 检查课程是否存在
    const course = await prisma.course.findUnique({ where: { id } });
    if (!course) {
      return NextResponse.json({ error: "课程不存在" }, { status: 404 });
    }

    // 删除课程（级联删除相关的章节、主题等）
    await prisma.course.delete({ where: { id } });

    return NextResponse.json({ message: "课程删除成功" });
  } catch (error) {
    console.error("删除课程失败:", error);
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }
}