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
        title: 'English for Beginners',
        description: 'Learn the basics of English grammar and vocabulary',
        level: 'A1'
      },
      {
        title: 'Intermediate English',
        description: 'Improve your English with more complex grammar and vocabulary',
        level: 'B1'
      },
      {
        title: 'Business English',
        description: 'Learn English for professional settings',
        level: 'B2'
      },
      {
        title: 'English for Travel',
        description: 'Essential English phrases for traveling',
        level: 'A2'
      },
      {
        title: 'Academic English',
        description: 'English for academic writing and research',
        level: 'C1'
      }
    ],
    skipDuplicates: true
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
          title: `Section 1: Basics`,
          description: 'Introduction to the course',
          order: 1,
          courseId: course.id
        },
        {
          title: `Section 2: Intermediate`,
          description: 'More advanced topics',
          order: 2,
          courseId: course.id
        },
        ...(i % 2 === 0 ? [{
          title: `Section 3: Advanced`,
          description: 'Advanced concepts',
          order: 3,
          courseId: course.id
        }] : [])
      ],
      skipDuplicates: true
    });

    // 获取所有章节
    const allSections = await prisma.section.findMany({ where: { courseId: course.id } });

    // 为每个章节创建2个主题
    for (let j = 0; j < allSections.length; j++) {
      const section = allSections[j];
      
      const topics = await prisma.topic.createMany({
        data: [
          {
            title: `Topic ${j + 1}.1: Introduction`,
            content: `This is the content for topic ${j + 1}.1 in ${section.title}`,
            order: 1,
            sectionId: section.id
          },
          {
            title: `Topic ${j + 1}.2: Practice`,
            content: `This is the content for topic ${j + 1}.2 in ${section.title}`,
            order: 2,
            sectionId: section.id
          }
        ],
        skipDuplicates: true
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
              question: 'What is the correct answer to this question?',
              options: JSON.stringify(['Option 1', 'Option 2', 'Option 3', 'Option 4']),
              answer: 'Option 2',
              explanation: 'Option 2 is the correct answer because...',
              topicId: topic.id
            },
            {
              type: 'fill_blank',
              question: 'Complete the sentence: I ___ to school every day.',
              answer: 'go',
              explanation: 'The correct verb is "go" because it matches the subject "I" and the present simple tense.',
              topicId: topic.id
            },
            ...(k % 2 === 0 ? [{
              type: 'single_choice',
              question: 'Which of the following is correct?',
              options: JSON.stringify(['I am go to school', 'I goes to school', 'I go to school', 'I going to school']),
              answer: 'I go to school',
              explanation: '"I go to school" is correct because it uses the present simple tense correctly.',
              topicId: topic.id
            }] : [])
          ],
          skipDuplicates: true
        });

        // 创建闪卡
        await prisma.flashcard.createMany({
          data: [
            {
              front: 'Hello',
              back: 'Used as a greeting',
              order: 1,
              topicId: topic.id
            },
            {
              front: 'Goodbye',
              back: 'Used when leaving',
              order: 2,
              topicId: topic.id
            },
            {
              front: 'Thank you',
              back: 'Used to express gratitude',
              order: 3,
              topicId: topic.id
            },
            {
              front: 'Please',
              back: 'Used to make a request',
              order: 4,
              topicId: topic.id
            }
          ],
          skipDuplicates: true
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