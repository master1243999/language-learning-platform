// app/context.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// 定义学习进度的数据结构（TypeScript接口）
interface LearningProgress {
  currentSection: string;        // 当前学习的章节ID
  completedSections: string[];   // 已完成章节的ID列表
  completedTopics: string[];     // 已完成主题的ID列表
  completedExercises: string[];  // 已完成练习的ID列表
  points: number;                // 积分
  streakDays: number;            // 连续学习天数
}

// 定义上下文的数据类型（包含状态和更新方法）
interface AppContextType {
  progress: LearningProgress;
  updateProgress: (key: keyof LearningProgress, value: any) => void;
  completeExercise: (exerciseId: string) => void;
}

// 默认初始数据（用于第一次访问时）
const defaultProgress: LearningProgress = {
  currentSection: "1",
  completedSections: ["1"],
  completedTopics: ["1-1", "1-2"],
  completedExercises: [],
  points: 120,
  streakDays: 3,
};

// 创建上下文对象
const AppContext = createContext<AppContextType | undefined>(undefined);

// 提供者组件：包裹整个应用，使所有子组件都能访问状态
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<LearningProgress>(defaultProgress);

  // 从localStorage加载数据（组件挂载时执行一次）
  useEffect(() => {
    const saved = localStorage.getItem("learning-progress");
    if (saved) {
      try {
        setProgress(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load progress", e);
      }
    }
  }, []);

  // 每当progress变化时，自动保存到localStorage
  useEffect(() => {
    localStorage.setItem("learning-progress", JSON.stringify(progress));
  }, [progress]);

  // 通用的更新方法
  const updateProgress = (key: keyof LearningProgress, value: any) => {
    setProgress((prev) => ({ ...prev, [key]: value }));
  };

  // 完成练习的专用方法（增加积分）
  const completeExercise = (exerciseId: string) => {
    setProgress((prev) => ({
      ...prev,
      completedExercises: [...prev.completedExercises, exerciseId],
      points: prev.points + 10,
    }));
  };

  return (
    <AppContext.Provider value={{ progress, updateProgress, completeExercise }}>
      {children}
    </AppContext.Provider>
  );
}

// 自定义钩子，方便在组件中获取上下文
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}