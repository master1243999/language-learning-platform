import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const section = await prisma.section.findUnique({
    where: { id },
    include: {
      topics: {
        orderBy: { order: "asc" },
      },
    },
  });
  if (!section) {
    return NextResponse.json({ error: "章节不存在" }, { status: 404 });
  }
  return NextResponse.json(section);
}