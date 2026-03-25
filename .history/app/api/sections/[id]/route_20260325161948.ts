import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const section = await prisma.section.findUnique({
    where: { id },
    include: {
      course: { select: { id: true, title: true } },
      topics: {
        orderBy: { order: "asc" },
        include: {
          exercises: { select: { id: true, type: true, question: true } },
          flashcards: { select: { id: true, front: true, order: true } }
        }
      },
    },
  });
  if (!section) {
    return NextResponse.json({ error: "章节不存在" }, { status: 404 });
  }
  return NextResponse.json(section);
}