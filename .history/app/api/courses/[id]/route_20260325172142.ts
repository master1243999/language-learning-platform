import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: params.id },
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