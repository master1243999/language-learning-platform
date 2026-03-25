import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const exercise = await prisma.exercise.findUnique({
    where: { id },
  });
  if (!exercise) {
    return NextResponse.json({ error: "练习不存在" }, { status: 404 });
  }
  return NextResponse.json(exercise);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  try {
    const { answer } = await request.json();
    const { id } = await params;
    const exercise = await prisma.exercise.findUnique({ where: { id } });

    if (!exercise) {
      return NextResponse.json({ error: "练习不存在" }, { status: 404 });
    }

    // 判断答案是否正确
    let isCorrect = false;
    if (exercise.type === "single_choice") {
      isCorrect = answer === exercise.answer;
    } else if (exercise.type === "fill_blank") {
      // 简单的填空题判分逻辑，实际项目中可能需要更复杂的处理
      isCorrect = answer.toLowerCase() === exercise.answer.toLowerCase();
    }

    // 记录练习结果
    await prisma.exerciseRecord.create({
      data: {
        userId: session.user.id,
        exerciseId: exercise.id,
        isCorrect
      }
    });

    return NextResponse.json({
      isCorrect,
      explanation: exercise.explanation,
      correctAnswer: exercise.answer
    });
  } catch (error) {
    console.error("提交练习失败:", error);
    return NextResponse.json({ error: "提交失败" }, { status: 500 });
  }
}