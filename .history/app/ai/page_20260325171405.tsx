"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Navbar from "../components/Navbar";

export default function AIPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState("A1");

  const handleSend = async () => {
    if (!input.trim()) return;

    // 添加用户消息
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // 调用 AI 对话 API
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: input, level })
      });
      const data = await response.json();

      // 添加 AI 回复
      setMessages([...newMessages, { role: "assistant", content: data.response }]);
    } catch (error) {
      console.error("AI 对话失败:", error);
      setMessages([...newMessages, { role: "assistant", content: "抱歉，我无法处理您的请求。请重试。" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 pb-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">AI语言伙伴</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">选择您的语言水平：</label>
          <select 
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="A1">A1 - 初学者</option>
            <option value="A2">A2 - 基础</option>
            <option value="B1">B1 - 中级</option>
            <option value="B2">B2 - 中高级</option>
          </select>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 h-96 overflow-y-auto mb-4">
          {messages.map((message, index) => (
            <div key={index} className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
              <div className={`inline-block max-w-[80%] p-3 rounded-lg ${message.role === "user" ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-800"}`}>
                {message.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-left mb-4">
              <div className="inline-block max-w-[80%] p-3 rounded-lg bg-gray-100 text-gray-800">
                <div className="animate-pulse">正在输入...</div>
              </div>
            </div>
          )}
        </div>

        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="在此输入您的消息..."
            className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-emerald-600 text-white px-6 py-3 rounded-r-lg hover:bg-emerald-700 transition-colors disabled:bg-gray-400"
          >
            {loading ? "发送中..." : "发送"}
          </button>
        </div>
      </div>
      <Navbar />
    </div>
  );
}