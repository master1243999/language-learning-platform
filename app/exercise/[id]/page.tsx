"use client";

import { useApp } from "@/app/context";
import { speak } from "@/app/utils/speech";
import { useMemo, useState } from "react";
import Link from "next/link";

type ExerciseItem = {
  id: string;
  title: string;
  type: "single" | "multiple";
  question: string;
  options: string[];
  answer: string[];
  explanation: string;
};

const exercises: ExerciseItem[] = [
  {
    id: "t1",
    title: "英语问候语",
    type: "single",
    question: "‘你好’最合适的英语表达是哪个？",
    options: ["Goodbye", "Hello", "Thank you", "Please"],
    answer: ["Hello"],
    explanation: "Hello 是最常用的问候语。",
  },
  {
    id: "t2",
    title: "自我介绍",
    type: "multiple",
    question: "下列哪些是自我介绍的常见句型？",
    options: ["My name is ...", "I like pizza", "I am a student", "It is raining"],
    answer: ["My name is ...", "I am a student"],
    explanation: "自我介绍常用句型包含名字和身份。",
  },
  {
    id: "t3",
    title: "礼貌用语",
    type: "single",
    question: "‘谢谢’正确的英文表达是？",
    options: ["Sorry", "Please", "Thank you", "Excuse me"],
    answer: ["Thank you"],
    explanation: "Thank you 表示感谢。",
  },
];

export default function ExercisePage({ params }: { params: { id: string } }) {
  const currentIndex = useMemo(
    () => exercises.findIndex((item) => item.id === params.id),
    [params.id]
  );
  const [selected, setSelected] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const { progress, completeExercise } = useApp();

  if (currentIndex === -1) {
    return (
      <div className="min-h-screen bg-emerald-50 p-6 text-emerald-900">
        <div className="mx-auto max-w-3xl rounded-2xl border border-emerald-200 bg-white p-8 shadow">
          <h1 className="text-2xl font-bold">练习不存在</h1>
          <p className="mt-3 text-emerald-700">请返回章节或主题页面选择有效练习。</p>
          <Link href="/section" className="mt-4 inline-block rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">
            返回课程
          </Link>
        </div>
      </div>
    );
  }

  const exercise = exercises[currentIndex];
  const isMultiple = exercise.type === "multiple";

  const toggleOption = (option: string) => {
    if (checked) return; // 评判后不可再选择
    if (isMultiple) {
      setSelected((prev) =>
        prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
      );
    } else {
      setSelected([option]);
    }
  };

  const submitAnswer = () => {
  if (selected.length === 0) return;
  const sortedSelected = [...selected].sort();
  const sortedAnswer = [...exercise.answer].sort();
  const correct =
    sortedSelected.length === sortedAnswer.length &&
    sortedSelected.every((option, idx) => option === sortedAnswer[idx]);

  setIsCorrect(correct);
  setChecked(true);

  // 如果正确，调用 completeExercise 增加积分
  if (correct) {
    completeExercise(exercise.id);
  }
};

  const goNext = () => {
    setChecked(false);
    setIsCorrect(null);
    setSelected([]);
    const next = (currentIndex + 1) % exercises.length;
    window.location.href = `/exercise/${exercises[next].id}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-100 text-emerald-900">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 py-6 md:px-8">
        <div className="mb-6 flex items-center gap-3">
          <Link
            href="/topic/1"
            className="rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm font-medium text-emerald-700 shadow-sm hover:bg-emerald-50"
          >
            返回
          </Link>
          <div className="ml-auto text-sm text-emerald-600 font-medium">
  积分: {progress.points}
</div>
          <h1 className="text-2xl font-bold">练习：{exercise.title}</h1>
        </div>

        <article className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-wider text-emerald-600">题目</p>
          <h2 className="mt-2 text-xl font-semibold text-emerald-900">{exercise.question}</h2>
          <div className="mt-2 flex items-center gap-2">
  <button
    onClick={() => speak(exercise.question, 'en-US')}
    className="inline-flex items-center text-sm text-emerald-600 hover:text-emerald-800"
    title="点击发音"
  >
    <svg className="mr-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
    朗读题目
  </button>
</div>

          <div className="mt-4 grid gap-3">
            {exercise.options.map((option) => {
              const selectedClass = selected.includes(option)
                ? "border-emerald-700 bg-emerald-100"
                : "border-slate-200 bg-white";

              return (
                <button
                  key={option}
                  onClick={() => toggleOption(option)}
                  className={`rounded-xl border p-3 text-left transition ${selectedClass} ${checked ? "cursor-not-allowed opacity-80" : "hover:border-emerald-300"}`}
                  disabled={checked}
                >
                  <div className="flex items-center justify-between">
  <span className="text-base font-medium">{option}</span>
  <button
    onClick={(e) => {
      e.stopPropagation();
      speak(option, 'en-US');
    }}
    className="ml-2 rounded-full p-1 text-emerald-500 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
    disabled={checked}
    title="朗读选项"
  >
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
  </button>
</div>
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={submitAnswer}
              disabled={checked || selected.length === 0}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
            >
              提交答案
            </button>
            <button
              onClick={goNext}
              className="rounded-lg border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
            >
              下一题
            </button>
          </div>

          {checked && isCorrect !== null && (
            <div
              className={`mt-4 rounded-lg p-4 text-sm font-medium ${
                isCorrect ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-700"
              }`}
            >
              {isCorrect ? "恭喜你回答正确！" : "回答错误，再试试吧。"}
              <p className="mt-2 text-emerald-700">正确答案：{exercise.answer.join("，")}</p>
              <p className="mt-1 text-emerald-600">解析：{exercise.explanation}</p>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
