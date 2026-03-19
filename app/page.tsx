import Image from "next/image";

const user = {
  name: "小明",
  avatar: "/avatar.png",
};

const progress = {
  today: 38,
  totalPercentage: 62,
};

const continueLessons = [
  {
    id: "section-2",
    title: "日常交流句型",
    description: "继续学习日常沟通句型，提升口语流利度。",
    status: "进行中",
    progress: 45,
  },
  {
    id: "section-3",
    title: "旅行与购物",
    description: "巩固购物、点餐等实用场景表达。",
    status: "未开始",
    progress: 0,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-100 text-emerald-900">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-6 md:px-8">
        <header className="mb-6 flex items-center justify-between rounded-xl bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 overflow-hidden rounded-full border border-emerald-200">
              <Image
                src={user.avatar}
                width={48}
                height={48}
                alt="用户头像"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm text-emerald-600">欢迎回来</p>
              <h1 className="text-xl font-bold">{user.name}</h1>
            </div>
          </div>
        </header>

        <section className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium uppercase tracking-wide text-emerald-600">学习进度</p>
            <p className="text-sm font-semibold text-emerald-700">今日 {progress.today} 分钟</p>
          </div>
          <div className="h-4 rounded-full bg-emerald-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
              style={{ width: `${progress.totalPercentage}%` }}
            ></div>
          </div>
          <p className="mt-2 text-sm text-emerald-700">总体完成率 {progress.totalPercentage}%</p>
        </section>

        <section className="mb-20">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">继续学习</h2>
            <span className="text-sm text-emerald-600">保持进度，养成习惯</span>
          </div>
          <div className="grid gap-4">
            {continueLessons.map((lesson) => (
              <article
                key={lesson.id}
                className="rounded-xl border border-emerald-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-base font-semibold">{lesson.title}</h3>
                  <span className="text-xs font-medium text-emerald-600">{lesson.status}</span>
                </div>
                <p className="mb-3 text-sm text-emerald-600">{lesson.description}</p>
                <div className="h-2 rounded-full bg-emerald-100">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${lesson.progress}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-emerald-500">章节进度 {lesson.progress}%</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 border-t border-emerald-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl justify-around px-4 py-3 text-sm font-medium text-emerald-700">
          <a href="#" className="flex flex-col items-center gap-1 text-emerald-900">
            首页
          </a>
          <a href="/section" className="flex flex-col items-center gap-1 hover:text-emerald-900">
            课程
          </a>
          <a href="/profile" className="flex flex-col items-center gap-1 hover:text-emerald-900">
            我的
          </a>
        </div>
      </footer>
    </div>
  );
}
