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
    <div className="min-h-screen bg-gradient-modern pb-20 relative">
      <div className="container mx-auto px-4 py-8 relative z-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 page-title">AI语言伙伴</h1>
        
        {/* 语言水平选择 */}
        <div className="card-modern card-glow p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">选择您的语言水平：</label>
          <select 
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full input-modern px-4 py-3"
          >
            <option value="A1">A1 - 初学者</option>
            <option value="A2">A2 - 基础</option>
            <option value="B1">B1 - 中级</option>
            <option value="B2">B2 - 中高级</option>
          </select>
        </div>

        {/* 对话区域 */}
        <div className="card-modern card-glow p-6 h-[60vh] overflow-y-auto mb-6 relative">
          {/* 系统提示 */}
          {messages.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-lg font-medium mb-2">欢迎使用AI语言伙伴</h3>
              <p className="max-w-md mx-auto">选择您的语言水平，然后开始与我对话练习吧！我会根据您的水平调整语言难度。</p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <button 
                  className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm hover:bg-emerald-200 transition-colors"
                  onClick={() => {
                    setInput("How are you?");
                    handleSend();
                  }}
                >
                  How are you?
                </button>
                <button 
                  className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm hover:bg-emerald-200 transition-colors"
                  onClick={() => {
                    setInput("What's your name?");
                    handleSend();
                  }}
                >
                  What's your name?
                </button>
                <button 
                  className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm hover:bg-emerald-200 transition-colors"
                  onClick={() => {
                    setInput("How to learn English well?");
                    handleSend();
                  }}
                >
                  How to learn English well?
                </button>
              </div>
            </div>
          )}
          
          {/* 对话消息 */}
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`mb-6 flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
            >
              {message.role === "assistant" && (
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3 flex-shrink-0">
                  🤖
                </div>
              )}
              <div 
                className={`max-w-[80%] p-4 rounded-2xl ${message.role === "user" ? "bg-emerald-500 text-white rounded-tr-none" : "bg-white border border-gray-200 rounded-tl-none"}`}
              >
                {message.content}
              </div>
              {message.role === "user" && (
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 ml-3 flex-shrink-0">
                  👤
                </div>
              )}
            </div>
          ))}
          
          {/* 加载状态 */}
          {loading && (
            <div className="flex justify-start mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3 flex-shrink-0">
                🤖
              </div>
              <div className="max-w-[80%] p-4 rounded-2xl bg-white border border-gray-200 rounded-tl-none">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 输入区域 */}
        <div className="card-modern card-glow p-4">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="输入您的消息，按Enter发送..."
              className="flex-1 input-modern px-4 py-3"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg btn-modern disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  发送中...
                </div>
              ) : (
                <>
                  <span className="mr-1">发送</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      <Navbar />
    </div>
  );
}