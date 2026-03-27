import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import axios from "axios";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  try {
    const { message, level } = await request.json();
    if (!message) {
      return NextResponse.json({ error: "消息不能为空" }, { status: 400 });
    }

    // 调用 DeepSeek API
    const response = await axios.post(
      "https://api.deepseek.com/v1/chat/completions",
      {
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: `你是一个语言学习伙伴，帮助用户练习英语。用户的语言水平是 ${level}。请纠正用户的语法错误，提供自然的回复，并给出适当的语言学习建议。`
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`
        }
      }
    );

    return NextResponse.json({
      response: response.data.choices[0].message.content
    });
  } catch (error) {
    console.error("AI 对话失败:", error);
    return NextResponse.json({ error: "对话失败" }, { status: 500 });
  }
}