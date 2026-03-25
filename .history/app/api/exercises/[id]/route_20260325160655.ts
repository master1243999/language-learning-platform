import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const exercise = await prisma.exercise.findUnique({
    where: { id },
  });
  if (!exercise) {
    return NextResponse.json({ error: "练习不存在" }, { status: 404 });
  }
  return NextResponse.json(exercise);
}