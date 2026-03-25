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
      exercises: true,
    },
  });
  if (!topic) {
    return NextResponse.json({ error: "主题不存在" }, { status: 404 });
  }
  return NextResponse.json(topic);
}