import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const courses = await prisma.course.findMany({
    select: { id: true, title: true, description: true, level: true }
  });
  return NextResponse.json(courses);
}