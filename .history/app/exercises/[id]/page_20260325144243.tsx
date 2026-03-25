"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { speak } from "@/app/utils/speech";
import { useApp } from "@/app/context";
import Link from "next/link";

type ExerciseData = {
  id: string;
  type: string;
  question: string;
  options: string | null;
  answer: string;
  explanation: string | null;
};

export default function ExercisePage() {
  const { id } = useParams();
  const [exercise, setExercise] = useState<ExerciseData | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const { progress, completeExercise } = useApp();

  useEffect(() => {
    fetch(`/api/exercises/${id}`)
      .then((res) => res.json())
      .then(setExercise);
  }, [id]);

  if (!exercise) return <div className="p-6">加载中...</div>;

  const isMultiple = exercise.type === "multiple_choice";
  const options: string[] = exercise.options ? JSON.parse(exercise.options) : [];
  const answerArray: string[] = JSON.parse(exercise.answer);

  const toggleOption = (option: string) => {
    if (checked) return;
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
    const sortedAnswer = [...answerArray].sort();
    const correct =
      sortedSelected.length === sortedAnswer.length &&
      sortedSelected.every((opt, idx) => opt === sortedAnswer[idx]);

    setIsCorrect(correct);
    setChecked(true);
    if (correct) {
      completeExercise(exercise.id);
    }
  };

  const goNext = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-100 text-emerald-900 p-6">
      <div className="mx-auto max-w-3xl">
        <Link href={`/topics/${id}`} className="inline-block mb-4 text-emerald-600">
          ← 返回主题
        </Link>
        <div className="bg-white rounded-xl p-6 shadow">
          <p className="text-sm font-medium text-emerald-600">题目</p>
          <h2 className="text-xl font-semibold mt-1">{exercise.question}</h2>
          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={() => speak(exercise.question, "en-US")}
              className="inline-flex items-center text-sm text-emerald-600 hover:text-emerald-800"
            >
              <svg className="mr-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
              朗读题目
            </button>
          </div>

          <div className="mt-6 grid gap-3">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => toggleOption(option)}
                className={`rounded-xl border p-3 text-left transition ${
                  selected.includes(option)
                    ? "border-emerald-700 bg-emerald-100"
                    : "border-slate-200 bg-white hover:border-emerald-300"
                } ${checked ? "cursor-not-allowed opacity-80" : ""}`}
                disabled={checked}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {/* 改为 div 并阻止事件冒泡，避免嵌套 button */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      speak(option, "en-US");
                    }}
                    className="ml-2 rounded-full p-1 text-emerald-500 hover:bg-emerald-100 cursor-pointer"
                    title="朗读选项"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={submitAnswer}
              disabled={checked || selected.length === 0}
              className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 disabled:bg-emerald-300"
            >
              提交答案
            </button>
            <button
              onClick={goNext}
              className="border border-emerald-300 bg-white text-emerald-700 px-4 py-2 rounded hover:bg-emerald-50"
            >
              返回
            </button>
          </div>

          {checked && isCorrect !== null && (
            <div
              className={`mt-4 p-4 rounded ${
                isCorrect ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-700"
              }`}
            >
              {isCorrect ? "✓ 回答正确！" : "✗ 回答错误"}
              <p className="mt-1 text-sm">正确答案：{answerArray.join("，")}</p>
              {exercise.explanation && <p className="mt-1 text-sm">解析：{exercise.explanation}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}