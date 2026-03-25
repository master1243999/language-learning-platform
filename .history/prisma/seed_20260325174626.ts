import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 检查是否已存在课程，避免重复插入
  const existingCourses = await prisma.course.count();
  if (existingCourses > 0) {
    console.log('✅ 数据库已有数据，跳过初始化');
    return;
  }

  // 创建课程
  const courses = await prisma.course.createMany({
    data: [
      {
        title: '英语入门',
        description: '学习英语基础语法和词汇',
        level: 'A1'
      },
      {
        title: '中级英语',
        description: '通过更复杂的语法和词汇提高英语水平',
        level: 'B1'
      },
      {
        title: '商务英语',
        description: '学习职场英语',
        level: 'B2'
      },
      {
        title: '旅游英语',
        description: '旅游必备英语短语',
        level: 'A2'
      },
      {
        title: '学术英语',
        description: '学术写作和研究英语',
        level: 'C1'
      }
    ]
  });

  // 获取所有课程
  const allCourses = await prisma.course.findMany();

  // 为每门课程创建章节和主题
  for (let i = 0; i < allCourses.length; i++) {
    const course = allCourses[i];
    
    // 创建2-3个章节
    const sections = await prisma.section.createMany({
      data: [
        {
          title: `第1章：基础`,
          description: '课程介绍',
          order: 1,
          courseId: course.id
        },
        {
          title: `第2章：中级`,
          description: '更高级的主题',
          order: 2,
          courseId: course.id
        },
        ...(i % 2 === 0 ? [{
          title: `第3章：高级`,
          description: '高级概念',
          order: 3,
          courseId: course.id
        }] : [])
      ]
    });

    // 获取所有章节
    const allSections = await prisma.section.findMany({ where: { courseId: course.id } });

    // 为每个章节创建2个主题
    for (let j = 0; j < allSections.length; j++) {
      const section = allSections[j];
      
      const topics = await prisma.topic.createMany({
        data: [
          {
            title: `主题 ${j + 1}.1：介绍`,
            content: `这是${section.title}中主题 ${j + 1}.1 的内容`,
            order: 1,
            sectionId: section.id
          },
          {
            title: `主题 ${j + 1}.2：练习`,
            content: `这是${section.title}中主题 ${j + 1}.2 的内容`,
            order: 2,
            sectionId: section.id
          }
        ]
      });

      // 获取所有主题
      const allTopics = await prisma.topic.findMany({ where: { sectionId: section.id } });

      // 为每个主题创建2-3个练习题和若干闪卡
      for (let k = 0; k < allTopics.length; k++) {
        const topic = allTopics[k];
        
        // 创建练习题
        await prisma.exercise.createMany({
          data: [
            {
              type: 'single_choice',
              question: '这个问题的正确答案是什么？',
              options: JSON.stringify(['选项 1', '选项 2', '选项 3', '选项 4']),
              answer: '选项 2',
              explanation: '选项 2 是正确答案，因为...',
              topicId: topic.id
            },
            {
              type: 'fill_blank',
              question: '完成句子：我每天 ___ 学校。',
              answer: '去',
              explanation: '正确的动词是"去"，因为它与主语"我"和一般现在时匹配。',
              topicId: topic.id
            },
            ...(k % 2 === 0 ? [{
              type: 'single_choice',
              question: '以下哪项是正确的？',
              options: JSON.stringify(['I am go to school', 'I goes to school', 'I go to school', 'I going to school']),
              answer: 'I go to school',
              explanation: '"I go to school"是正确的，因为它正确使用了一般现在时。',
              topicId: topic.id
            }] : [])
          ]
        });

        // 创建闪卡
        await prisma.flashcard.createMany({
          data: [
            {
              front: '你好',
              back: '用作问候语',
              order: 1,
              topicId: topic.id
            },
            {
              front: '再见',
              back: '离开时使用',
              order: 2,
              topicId: topic.id
            },
            {
              front: '谢谢',
              back: '用来表达感谢',
              order: 3,
              topicId: topic.id
            },
            {
              front: '请',
              back: '用来提出请求',
              order: 4,
              topicId: topic.id
            }
          ]
        });
      }
    }
  }

  console.log('✅ 数据库初始化完成');
}

main()
  .catch((e) => {
    console.error('❌ 初始化失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });