import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 检查是否已存在课程，避免重复插入
  const existingCourses = await prisma.course.count()
  if (existingCourses > 0) {
    console.log('✅ 数据库已有数据，跳过初始化')
    return
  }

  // 创建课程
  const course1 = await prisma.course.create({
    data: {
      title: '基础英语 A1',
      description: '适合零基础学习者的入门课程',
      level: 'A1',
    },
  })
  const course2 = await prisma.course.create({
    data: {
      title: '日常会话 A2',
      description: '学习日常交流常用句型',
      level: 'A2',
    },
  })

  // 为 course1 创建章节
  const section1 = await prisma.section.create({
    data: {
      title: '问候与介绍',
      description: '学习基本问候和自我介绍',
      order: 1,
      courseId: course1.id,
    },
  })
  const section2 = await prisma.section.create({
    data: {
      title: '日常用语',
      description: '学习日常简单句子',
      order: 2,
      courseId: course1.id,
    },
  })

  // 为 section1 创建主题
  const topic1 = await prisma.topic.create({
    data: {
      title: '你好与再见',
      content: '<p>Hello 你好，Goodbye 再见。</p>',
      order: 1,
      sectionId: section1.id,
    },
  })
  const topic2 = await prisma.topic.create({
    data: {
      title: '自我介绍',
      content: '<p>My name is ... 我叫...</p>',
      order: 2,
      sectionId: section1.id,
    },
  })

  // 为主题1创建练习题
  await prisma.exercise.create({
    data: {
      type: 'single_choice',
      question: '“你好”的英文是？',
      options: JSON.stringify(['Hello', 'Goodbye', 'Thanks', 'Sorry']),
      answer: JSON.stringify(['Hello']),
      explanation: 'Hello 是常用的问候语。',
      topicId: topic1.id,
    },
  })
  await prisma.exercise.create({
    data: {
      type: 'single_choice',
      question: '“再见”的英文是？',
      options: JSON.stringify(['Hello', 'Goodbye', 'Thanks', 'Sorry']),
      answer: JSON.stringify(['Goodbye']),
      explanation: 'Goodbye 表示再见。',
      topicId: topic1.id,
    },
  })

  console.log('✅ 数据库初始化完成')
}

main()
  .catch((e) => {
    console.error('❌ 初始化失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })