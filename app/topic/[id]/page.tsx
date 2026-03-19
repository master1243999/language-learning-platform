import Link from "next/link";

type TopicCard = {
  id: string;
  title: string;
  summary: string;
  status: "completed" | "active" | "locked";
};

const sectionTopics: Record<string, { title: string; topics: TopicCard[] }> = {
  "1": {
    title: "基础问候与自我介绍",
    topics: [
      {
        id: "t1",
        title: "英语问候语",
        summary: "学习 Hello / Hi / Good morning 等表达。",
        status: "completed",
      },
      {
        id: "t2",
        title: "简单自我介绍",
        summary: "练习 I am ... / My name is ...。",
        status: "active",
      },
      {
        id: "t3",
        title: "礼貌用语",
        summary: "学习 Please / Thank you / Sorry 等礼貌短语。",
        status: "locked",
      },
    ],
  },
  "2": {
    title: "日常交流句型",
    topics: [
      {
        id: "t4",
        title: "询问时间地点",
        summary: "How do I ask where and when?",
        status: "completed",
      },
      {
        id: "t5",
        title: "表达兴趣爱好",
        summary: "I like ... / I don't like ...。",
        status: "active",
      },
      {
        id: "t6",
        title: "订餐购物用语",
        summary: "学会点餐、买东西的基本句型。",
        status: "locked",
      },
    ],
  },
};

export default function TopicPage({ params }: { params: { id: string } }) {
  const data = sectionTopics[params.id];

  if (!data) {
    return (
      <div className="min-h-screen bg-emerald-50 p-6 text-emerald-900">
        <div className="mx-auto max-w-4xl rounded-2xl border border-emerald-200 bg-white p-8 shadow">
          <h1 className="text-2xl font-bold">章节未找到</h1>
          <p className="mt-3 text-emerald-700">请返回章节页面并选择有效课程章节。</p>
          <Link href="/section" className="mt-4 inline-block rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">
            返回我的课程
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-100 text-emerald-900">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-6 md:px-8">
        <div className="mb-6 flex items-center gap-3">
          <Link
            href="/section"
            className="rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm font-medium text-emerald-700 shadow-sm hover:bg-emerald-50"
          >
            返回
          </Link>
          <h1 className="text-2xl font-bold">{data.title}</h1>
        </div>

        <section className="mb-6 rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-emerald-600">主题列表</p>
              <p className="text-2xl font-bold text-emerald-800">
                共 {data.topics.length} 个主题
              </p>
            </div>
            <p className="rounded-full bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-800">
              章节：{data.title}
            </p>
          </div>
        </section>

        <section className="grid gap-4">
          {data.topics.map((topic) => {
            const isLocked = topic.status === "locked";
            const statusCss =
              topic.status === "completed"
                ? "bg-emerald-100 text-emerald-700"
                : topic.status === "active"
                ? "bg-emerald-50 text-emerald-800"
                : "bg-emerald-100 text-emerald-400";

            const card = (
              <div
                className={`rounded-xl p-4 transition-all ${
                  isLocked
                    ? "border border-dashed border-emerald-200 bg-emerald-50 text-emerald-400"
                    : "border border-emerald-200 bg-white text-emerald-900 shadow hover:-translate-y-0.5 hover:shadow-md"
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">{topic.title}</h2>
                  <span className={`rounded-full px-2 py-1 text-xs font-bold ${statusCss}`}>{topic.status === "completed" ? "已完成" : topic.status === "active" ? "进行中" : "未解锁"}</span>
                </div>
                <p className="text-sm text-emerald-600">{topic.summary}</p>
              </div>
            );

            return isLocked ? (
              <div key={topic.id}>{card}</div>
            ) : (
              <Link key={topic.id} href={`/exercise/${topic.id}`}>
                {card}
              </Link>
            );
          })}
        </section>
      </div>
    </div>
  );
}
