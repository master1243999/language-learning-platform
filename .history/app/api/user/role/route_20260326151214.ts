import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }
    
    const { role } = await request.json();
    
    if (!role || (role !== 'student' && role !== 'teacher')) {
      return NextResponse.json({ error: '无效的角色' }, { status: 400 });
    }
    
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { role }
    });
    
    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('切换角色失败:', error);
    return NextResponse.json({ error: '切换角色失败' }, { status: 500 });
  }
}