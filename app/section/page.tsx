"use client";
import { useApp } from "@/app/context";
import Link from "next/link";


type SectionCard = {
  id: string;
  title: string;
  description: string;
  status: "completed" | "active" | "locked";
};

const sections: SectionCard[] = [
  {
    id: "1",
    title: "基础问候与自我介绍",
    description: "学习常用问候语与自我介绍句型，建立口语基础。",
    status: "completed",
  },
  {
    id: "2",
    title: "日常交流句型",
    description: "掌握问路、询问时间、表达喜好等句子。",
    status: "active",
  },
  {
    id: "3",
    title: "旅行与购物",
    description: "学会在旅行或购物场景中运用英语沟通。",
    status: "locked",
  },
  {
    id: "4",
    title: "商务沟通",
    description: "培养职场英语表达能力，介绍商务礼仪。",
    status: "locked",
  },
];

export default function SectionPage() {
  const currentLevel = "A1";
  const { progress } = useApp();
  const currentSectionIndex = sections.findIndex((item) => item.status === "active") + 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-100 text-emerald-900">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-6 md:px-8">
        <div className="mb-6 flex items-center gap-3">
          <Link
            href="/"
            className="rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm font-medium text-emerald-700 shadow-sm hover:bg-emerald-50"
          >
            返回
          </Link>
          <div className="ml-auto text-sm text-emerald-600 font-medium">
  积分: {progress.points}
</div>
          <h1 className="text-2xl font-bold">我的课程</h1>
        </div>

        <section className="mb-6 rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-emerald-600">学习进度</p>
              <p className="text-3xl font-extrabold text-emerald-900">等级 {currentLevel}</p>
              <p className="text-sm text-emerald-700">当前章节：第 {currentSectionIndex} 章</p>
            </div>
            <button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700">
              切换等级
            </button>
          </div>
        </section>

        
 <section className="grid gap-4">
  {sections.map((section, index) => {
    // 根据progress判断是否已完成
    const isCompleted = progress.completedSections.includes(section.id);
    // 原始锁定状态（如果原始是locked且未完成，则仍锁定）
    const isOriginallyLocked = section.status === "locked";
    // 实际是否锁定：如果未完成且原始锁定，则为锁定；否则可交互
    const isLocked = !isCompleted && isOriginallyLocked;

    // 确定状态标签
    let statusLabel = "未解锁";
    if (isCompleted) {
      statusLabel = "已完成";
    } else if (section.status === "active") {
      statusLabel = "进行中";
    }

    // 样式类
    const cardClasses = `rounded-xl p-4 transition-all ${
      isLocked
        ? "cursor-not-allowed border border-dashed border-emerald-200 bg-emerald-50 text-emerald-400"
        : "border border-emerald-200 bg-white text-emerald-900 shadow-sm hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
    }`;

    const cardContent = (
      <div className={cardClasses}>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-lg font-bold">第 {index + 1} 章 · {section.title}</span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              isCompleted
                ? "bg-emerald-100 text-emerald-700"
                : section.status === "active"
                ? "bg-emerald-50 text-emerald-800"
                : "bg-emerald-100 text-emerald-400"
            }`}
          >
            {statusLabel}
          </span>
        </div>
        <p className="text-sm text-emerald-600">{section.description}</p>
      </div>
    );

    return isLocked ? (
      <div key={section.id}>{cardContent}</div>
    ) : (
      <Link key={section.id} href={`/section/${section.id}`}>
        {cardContent}
      </Link>
    );
  })}
</section>
      </div>
    </div>
  );
}
