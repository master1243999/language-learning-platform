import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const flashcard = await prisma.flashcard.findUnique({
      where: { id },
      include: {
        topic: { select: { id: true, title: true, section: { select: { id: true, title: true } } } }
      },
    });
    if (!flashcard) {
      return NextResponse.json({ error: "闪卡不存在" }, { status: 404 });
    }
    return NextResponse.json(flashcard);
  } catch (error) {
    console.error("获取闪卡详情失败:", error);
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }
}