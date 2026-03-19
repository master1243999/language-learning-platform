// app/data.ts
export interface Section {
  id: string;
  title: string;
  description: string;
  status: "locked" | "in-progress" | "completed";
  order: number;
}

export const sections: Section[] = [
  {
    id: "1",
    title: "基础入门",
    description: "学习字母、发音和基本问候语",
    status: "completed",
    order: 1,
  },
  {
    id: "2",
    title: "日常会话",
    description: "购物、点餐、问路等实用对话",
    status: "in-progress",
    order: 2,
  },
  {
    id: "3",
    title: "语法基础",
    description: "时态、句型结构基础",
    status: "locked",
    order: 3,
  },
  {
    id: "4",
    title: "词汇拓展",
    description: "日常生活常用词汇",
    status: "locked",
    order: 4,
  },
];