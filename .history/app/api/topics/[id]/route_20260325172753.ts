import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const topic = await prisma.topic.findUnique({
    where: { id },
    include: {
      section: { select: { id: true, title: true, course: { select: { id: true, title: true } } } },
      exercises: {
        orderBy: { id: "asc" },
        select: { id: true, type: true, question: true, options: true, answer: true, explanation: true }
      },
      flashcards: {
        orderBy: { order: "asc" },
        select: { id: true, front: true, back: true, order: true }
      }
    },
  });
  if (!topic) {
    return NextResponse.json({ error: "主题不存在" }, { status: 404 });
  }
  return NextResponse.json(topic);
}