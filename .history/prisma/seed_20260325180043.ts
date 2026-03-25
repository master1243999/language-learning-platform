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
        description: '从零开始学习英语，掌握基础语法、词汇和日常用语，为进一步学习打下坚实基础。',
        level: 'A1'
      },
      {
        title: '中级英语',
        description: '学习更复杂的语法结构和词汇，提高听说读写能力，能够进行日常交流和简单的商务沟通。',
        level: 'B1'
      },
      {
        title: '商务英语',
        description: '掌握职场必备的英语表达，包括会议、邮件、谈判等场景的专业用语，提升职业竞争力。',
        level: 'B2'
      },
      {
        title: '旅游英语',
        description: '学习旅游中常用的英语短语和表达，包括预订酒店、问路、购物等实用场景。',
        level: 'A2'
      },
      {
        title: '学术英语',
        description: '掌握学术写作和研究所需的英语表达，包括论文写作、学术演讲等专业技能。',
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
    let sectionsData = [];
    if (course.title === '英语入门') {
      sectionsData = [
        {
          title: '第1章：基础入门',
          description: '学习英语字母、发音和基本问候语',
          order: 1,
          courseId: course.id
        },
        {
          title: '第2章：日常用语',
          description: '掌握日常生活中常用的英语表达',
          order: 2,
          courseId: course.id
        },
        {
          title: '第3章：基础语法',
          description: '学习基本的英语语法规则',
          order: 3,
          courseId: course.id
        }
      ];
    } else if (course.title === '中级英语') {
      sectionsData = [
        {
          title: '第1章：进阶语法',
          description: '学习更复杂的语法结构',
          order: 1,
          courseId: course.id
        },
        {
          title: '第2章：主题对话',
          description: '针对不同场景的英语对话练习',
          order: 2,
          courseId: course.id
        },
        {
          title: '第3章：阅读与写作',
          description: '提高英语阅读和写作能力',
          order: 3,
          courseId: course.id
        }
      ];
    } else if (course.title === '商务英语') {
      sectionsData = [
        {
          title: '第1章：职场沟通',
          description: '学习职场中的英语沟通技巧',
          order: 1,
          courseId: course.id
        },
        {
          title: '第2章：商务会议',
          description: '掌握商务会议中的英语表达',
          order: 2,
          courseId: course.id
        },
        {
          title: '第3章：商务邮件',
          description: '学习撰写专业的商务邮件',
          order: 3,
          courseId: course.id
        }
      ];
    } else if (course.title === '旅游英语') {
      sectionsData = [
        {
          title: '第1章：旅行准备',
          description: '学习旅行前的英语表达',
          order: 1,
          courseId: course.id
        },
        {
          title: '第2章：旅途中',
          description: '掌握旅途中的英语沟通',
          order: 2,
          courseId: course.id
        },
        {
          title: '第3章：旅游服务',
          description: '学习与旅游服务相关的英语',
          order: 3,
          courseId: course.id
        }
      ];
    } else if (course.title === '学术英语') {
      sectionsData = [
        {
          title: '第1章：学术写作',
          description: '学习学术论文的写作技巧',
          order: 1,
          courseId: course.id
        },
        {
          title: '第2章：研究方法',
          description: '掌握学术研究中的英语表达',
          order: 2,
          courseId: course.id
        },
        {
          title: '第3章：学术演讲',
          description: '学习如何进行学术演讲',
          order: 3,
          courseId: course.id
        }
      ];
    }
    
    const sections = await prisma.section.createMany({
      data: sectionsData
    });

    // 获取所有章节
    const allSections = await prisma.section.findMany({ where: { courseId: course.id } });

    // 为每个章节创建2个主题
    for (let j = 0; j < allSections.length; j++) {
      const section = allSections[j];
      
      // 根据课程和章节创建有针对性的主题
      let topicsData = [];
      if (course.title === '英语入门') {
        if (section.title === '第1章：基础入门') {
          topicsData = [
            {
              title: '1.1 英语字母与发音',
              content: '<h3>英语字母表</h3><p>英语共有26个字母，包括5个元音字母（A, E, I, O, U）和21个辅音字母。</p><h3>基本发音规则</h3><p>掌握英语字母的基本发音，注意元音和辅音的区别。</p>',
              order: 1,
              sectionId: section.id
            },
            {
              title: '1.2 基本问候语',
              content: '<h3>日常问候</h3><p>学习基本的问候语，如：Hello, Hi, Good morning, Good afternoon, Good evening等。</p><h3>自我介绍</h3><p>学习如何用英语介绍自己，包括姓名、年龄、职业等。</p>',
              order: 2,
              sectionId: section.id
            }
          ];
        } else if (section.title === '第2章：日常用语') {
          topicsData = [
            {
              title: '2.1 数字与时间',
              content: '<h3>数字表达</h3><p>学习1-100的数字表达，掌握基本的计数能力。</p><h3>时间表达</h3><p>学习如何用英语表达时间，包括整点、半点、刻钟等。</p>',
              order: 1,
              sectionId: section.id
            },
            {
              title: '2.2 家庭与朋友',
              content: '<h3>家庭成员</h3><p>学习家庭成员的英语表达，如father, mother, brother, sister等。</p><h3>朋友关系</h3><p>学习如何用英语谈论朋友，表达友谊。</p>',
              order: 2,
              sectionId: section.id
            }
          ];
        } else if (section.title === '第3章：基础语法') {
          topicsData = [
            {
              title: '3.1 简单现在时',
              content: '<h3>be动词</h3><p>学习be动词的基本用法，包括am, is, are的使用。</p><h3>实义动词</h3><p>学习实义动词在一般现在时中的基本用法。</p>',
              order: 1,
              sectionId: section.id
            },
            {
              title: '3.2 简单疑问句',
              content: '<h3>一般疑问句</h3><p>学习如何构成一般疑问句，以及肯定和否定回答。</p><h3>特殊疑问句</h3><p>学习使用疑问词（what, where, when, who, why, how）构成特殊疑问句。</p>',
              order: 2,
              sectionId: section.id
            }
          ];
        }
      } else if (course.title === '中级英语') {
        if (section.title === '第1章：进阶语法') {
          topicsData = [
            {
              title: '1.1 现在进行时',
              content: '<h3>构成与用法</h3><p>学习现在进行时的构成（be + 动词ing）和基本用法。</p><h3>时间标志词</h3><p>掌握现在进行时的时间标志词，如now, at the moment等。</p>',
              order: 1,
              sectionId: section.id
            },
            {
              title: '1.2 一般过去时',
              content: '<h3>规则动词与不规则动词</h3><p>学习规则动词和不规则动词的过去式变化。</p><h3>时间标志词</h3><p>掌握一般过去时的时间标志词，如yesterday, last week等。</p>',
              order: 2,
              sectionId: section.id
            }
          ];
        } else if (section.title === '第2章：主题对话') {
          topicsData = [
            {
              title: '2.1 购物对话',
              content: '<h3>购物用语</h3><p>学习在商店购物时的常用英语表达，如询问价格、试穿、付款等。</p><h3>对话练习</h3><p>通过模拟对话练习，提高实际交流能力。</p>',
              order: 1,
              sectionId: section.id
            },
            {
              title: '2.2 餐厅对话',
              content: '<h3>点餐用语</h3><p>学习在餐厅点餐时的常用英语表达，如看菜单、点餐、付账等。</p><h3>对话练习</h3><p>通过模拟对话练习，提高实际交流能力。</p>',
              order: 2,
              sectionId: section.id
            }
          ];
        } else if (section.title === '第3章：阅读与写作') {
          topicsData = [
            {
              title: '3.1 短文阅读',
              content: '<h3>阅读技巧</h3><p>学习基本的阅读技巧，如快速阅读、略读、扫读等。</p><h3>阅读练习</h3><p>通过阅读短文，提高理解能力和词汇量。</p>',
              order: 1,
              sectionId: section.id
            },
            {
              title: '3.2 简单写作',
              content: '<h3>句子结构</h3><p>学习基本的句子结构，如简单句、复合句等。</p><h3>写作练习</h3><p>通过写作练习，提高英语表达能力。</p>',
              order: 2,
              sectionId: section.id
            }
          ];
        }
      } else if (course.title === '商务英语') {
        if (section.title === '第1章：职场沟通') {
          topicsData = [
            {
              title: '1.1 职场介绍',
              content: '<h3>自我介绍</h3><p>学习在工作场合如何进行专业的自我介绍。</p><h3>团队沟通</h3><p>学习如何与同事进行有效的英语沟通。</p>',
              order: 1,
              sectionId: section.id
            },
            {
              title: '1.2 电话沟通',
              content: '<h3>电话用语</h3><p>学习电话接通、转接、留言等基本用语。</p><h3>电话会议</h3><p>学习电话会议中的常用表达。</p>',
              order: 2,
              sectionId: section.id
            }
          ];
        } else if (section.title === '第2章：商务会议') {
          topicsData = [
            {
              title: '2.1 会议准备',
              content: '<h3>会议议程</h3><p>学习如何用英语准备会议议程。</p><h3>会议邀请</h3><p>学习如何用英语发送会议邀请。</p>',
              order: 1,
              sectionId: section.id
            },
            {
              title: '2.2 会议进行',
              content: '<h3>会议开场</h3><p>学习会议开场的常用表达。</p><h3>讨论与决策</h3><p>学习如何在会议中表达意见、提出建议等。</p>',
              order: 2,
              sectionId: section.id
            }
          ];
        } else if (section.title === '第3章：商务邮件') {
          topicsData = [
            {
              title: '3.1 邮件格式',
              content: '<h3>邮件结构</h3><p>学习商务邮件的基本结构，包括称呼、正文、结尾等。</p><h3>正式与非正式邮件</h3><p>学习不同场合下的邮件用语。</p>',
              order: 1,
              sectionId: section.id
            },
            {
              title: '3.2 邮件类型',
              content: '<h3>询问与回复</h3><p>学习如何用英语写询问邮件和回复邮件。</p><h3>通知与邀请</h3><p>学习如何用英语写通知和邀请邮件。</p>',
              order: 2,
              sectionId: section.id
            }
          ];
        }
      } else if (course.title === '旅游英语') {
        if (section.title === '第1章：旅行准备') {
          topicsData = [
            {
              title: '1.1 预订机票',
              content: '<h3>机票预订</h3><p>学习如何用英语预订机票，包括询问航班、价格、座位等。</p><h3>机场用语</h3><p>学习机场办理登机手续时的常用表达。</p>',
              order: 1,
              sectionId: section.id
            },
            {
              title: '1.2 预订酒店',
              content: '<h3>酒店预订</h3><p>学习如何用英语预订酒店，包括询问房间类型、价格、设施等。</p><h3>入住与退房</h3><p>学习酒店入住和退房时的常用表达。</p>',
              order: 2,
              sectionId: section.id
            }
          ];
        } else if (section.title === '第2章：旅途中') {
          topicsData = [
            {
              title: '2.1 交通出行',
              content: '<h3>问路</h3><p>学习如何用英语问路，包括方向、距离等。</p><h3>公共交通</h3><p>学习如何使用公共交通工具，如地铁、公交车等。</p>',
              order: 1,
              sectionId: section.id
            },
            {
              title: '2.2 货币兑换',
              content: '<h3>货币兑换</h3><p>学习如何用英语进行货币兑换，包括汇率、手续费等。</p><h3>购物付款</h3><p>学习购物时的付款用语，如信用卡、现金等。</p>',
              order: 2,
              sectionId: section.id
            }
          ];
        } else if (section.title === '第3章：旅游服务') {
          topicsData = [
            {
              title: '3.1 景点参观',
              content: '<h3>购票</h3><p>学习如何用英语购买景点门票。</p><h3>导游服务</h3><p>学习如何使用导游服务，询问景点信息等。</p>',
              order: 1,
              sectionId: section.id
            },
            {
              title: '3.2 餐饮服务',
              content: '<h3>餐厅预订</h3><p>学习如何用英语预订餐厅。</p><h3>点餐用语</h3><p>学习如何用英语点餐，包括特殊要求、 dietary restrictions等。</p>',
              order: 2,
              sectionId: section.id
            }
          ];
        }
      } else if (course.title === '学术英语') {
        if (section.title === '第1章：学术写作') {
          topicsData = [
            {
              title: '1.1 论文结构',
              content: '<h3>论文组成部分</h3><p>学习学术论文的基本结构，包括摘要、引言、方法、结果、讨论、结论等。</p><h3>学术语言</h3><p>学习学术论文中的正式语言和表达。</p>',
              order: 1,
              sectionId: section.id
            },
            {
              title: '1.2 文献引用',
              content: '<h3>引用格式</h3><p>学习不同的引用格式，如APA、MLA等。</p><h3>参考文献</h3><p>学习如何正确列出参考文献。</p>',
              order: 2,
              sectionId: section.id
            }
          ];
        } else if (section.title === '第2章：研究方法') {
          topicsData = [
            {
              title: '2.1 研究设计',
              content: '<h3>研究类型</h3><p>学习不同类型的研究方法，如定量研究、定性研究等。</p><h3>研究步骤</h3><p>学习研究的基本步骤，从选题到数据收集和分析。</p>',
              order: 1,
              sectionId: section.id
            },
            {
              title: '2.2 数据分析',
              content: '<h3>数据收集</h3><p>学习如何用英语描述数据收集过程。</p><h3>结果呈现</h3><p>学习如何用英语呈现研究结果，包括表格、图表等。</p>',
              order: 2,
              sectionId: section.id
            }
          ];
        } else if (section.title === '第3章：学术演讲') {
          topicsData = [
            {
              title: '3.1 演讲准备',
              content: '<h3>演讲结构</h3><p>学习学术演讲的基本结构，包括开场、主体、结尾等。</p><h3>视觉辅助</h3><p>学习如何使用PPT等视觉辅助工具。</p>',
              order: 1,
              sectionId: section.id
            },
            {
              title: '3.2 演讲技巧',
              content: '<h3>语言表达</h3><p>学习学术演讲中的语言表达技巧，如语速、语调等。</p><h3>问答环节</h3><p>学习如何应对演讲后的问答环节。</p>',
              order: 2,
              sectionId: section.id
            }
          ];
        }
      }
      
      // 如果没有特定主题数据，使用默认主题
      if (topicsData.length === 0) {
        topicsData = [
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
        ];
      }
      
      const topics = await prisma.topic.createMany({
        data: topicsData
      });

      // 获取所有主题
      const allTopics = await prisma.topic.findMany({ where: { sectionId: section.id } });

      // 为每个主题创建2-3个练习题和若干闪卡
      for (let k = 0; k < allTopics.length; k++) {
        const topic = allTopics[k];
        
        // 根据主题创建有针对性的练习题
        let exercisesData = [];
        if (course.title === '英语入门') {
          if (topic.title.includes('字母与发音')) {
            exercisesData = [
              {
                type: 'single_choice',
                question: '以下哪个是元音字母？',
                options: JSON.stringify(['B', 'C', 'E', 'F']),
                answer: 'E',
                explanation: 'E是元音字母，元音字母包括A, E, I, O, U。',
                topicId: topic.id
              },
              {
                type: 'fill_blank',
                question: '英语共有___个字母。',
                answer: '26',
                explanation: '英语共有26个字母，包括5个元音字母和21个辅音字母。',
                topicId: topic.id
              }
            ];
          } else if (topic.title.includes('问候语')) {
            exercisesData = [
              {
                type: 'single_choice',
                question: '早上见面时应该说什么？',
                options: JSON.stringify(['Good night', 'Good morning', 'Good afternoon', 'Good evening']),
                answer: 'Good morning',
                explanation: '早上见面时应该说Good morning。',
                topicId: topic.id
              },
              {
                type: 'fill_blank',
                question: '你好，我是李明。用英语怎么说？',
                answer: 'Hello, I am Li Ming.',
                explanation: '自我介绍时可以说Hello, I am [名字]。',
                topicId: topic.id
              }
            ];
          } else if (topic.title.includes('数字与时间')) {
            exercisesData = [
              {
                type: 'single_choice',
                question: '15用英语怎么说？',
                options: JSON.stringify(['Fifteen', 'Fifty', 'Fiveteen', 'Fifthy']),
                answer: 'Fifteen',
                explanation: '15的英语表达是Fifteen。',
                topicId: topic.id
              },
              {
                type: 'fill_blank',
                question: '现在是3点。用英语怎么说？',
                answer: 'It is three o\'clock.',
                explanation: '表达整点时间可以说It is [数字] o\'clock。',
                topicId: topic.id
              }
            ];
          } else if (topic.title.includes('语法')) {
            exercisesData = [
              {
                type: 'single_choice',
                question: 'I ___ a student. 应该填什么？',
                options: JSON.stringify(['is', 'am', 'are', 'be']),
                answer: 'am',
                explanation: 'I后面应该用am。',
                topicId: topic.id
              },
              {
                type: 'fill_blank',
                question: '你是老师吗？用英语怎么说？',
                answer: 'Are you a teacher?',
                explanation: '一般疑问句的结构是：be动词 + 主语 + 其他？',
                topicId: topic.id
              }
            ];
          }
        } else if (course.title === '中级英语') {
          if (topic.title.includes('现在进行时')) {
            exercisesData = [
              {
                type: 'single_choice',
                question: 'Look! They ___ football. 应该填什么？',
                options: JSON.stringify(['play', 'plays', 'are playing', 'is playing']),
                answer: 'are playing',
                explanation: '现在进行时的结构是：be动词 + 动词ing，主语是they，所以用are playing。',
                topicId: topic.id
              },
              {
                type: 'fill_blank',
                question: '我正在读书。用英语怎么说？',
                answer: 'I am reading a book.',
                explanation: '现在进行时表示正在进行的动作，结构是：be动词 + 动词ing。',
                topicId: topic.id
              }
            ];
          } else if (topic.title.includes('一般过去时')) {
            exercisesData = [
              {
                type: 'single_choice',
                question: 'Yesterday I ___ to the park. 应该填什么？',
                options: JSON.stringify(['go', 'goes', 'went', 'gone']),
                answer: 'went',
                explanation: 'yesterday表示过去的时间，所以用一般过去时，go的过去式是went。',
                topicId: topic.id
              },
              {
                type: 'fill_blank',
                question: '他昨天看了电影。用英语怎么说？',
                answer: 'He watched a movie yesterday.',
                explanation: '一般过去时表示过去发生的动作，watch的过去式是watched。',
                topicId: topic.id
              }
            ];
          } else if (topic.title.includes('购物')) {
            exercisesData = [
              {
                type: 'single_choice',
                question: 'How much is this shirt? 的意思是什么？',
                options: JSON.stringify(['这件衬衫是什么颜色？', '这件衬衫多少钱？', '这件衬衫是什么尺码？', '这件衬衫是新的吗？']),
                answer: '这件衬衫多少钱？',
                explanation: 'How much是询问价格的常用表达。',
                topicId: topic.id
              },
              {
                type: 'fill_blank',
                question: '我可以试穿一下吗？用英语怎么说？',
                answer: 'Can I try it on?',
                explanation: '试穿的英语表达是try on。',
                topicId: topic.id
              }
            ];
          } else if (topic.title.includes('餐厅')) {
            exercisesData = [
              {
                type: 'single_choice',
                question: 'I would like a table for two. 的意思是什么？',
                options: JSON.stringify(['我想要一个两人桌。', '我想要两把椅子。', '我想要两个菜单。', '我想要两杯咖啡。']),
                answer: '我想要一个两人桌。',
                explanation: 'table for two表示两人桌。',
                topicId: topic.id
              },
              {
                type: 'fill_blank',
                question: '请给我菜单。用英语怎么说？',
                answer: 'Please give me the menu.',
                explanation: 'menu是菜单的意思。',
                topicId: topic.id
              }
            ];
          }
        } else if (course.title === '商务英语') {
          if (topic.title.includes('职场介绍')) {
            exercisesData = [
              {
                type: 'single_choice',
                question: 'I work in the marketing department. 的意思是什么？',
                options: JSON.stringify(['我在市场部工作。', '我在销售部工作。', '我在财务部工作。', '我在人力资源部工作。']),
                answer: '我在市场部工作。',
                explanation: 'marketing department是市场部的意思。',
                topicId: topic.id
              },
              {
                type: 'fill_blank',
                question: '很高兴认识你。用英语怎么说？',
                answer: 'Nice to meet you.',
                explanation: 'Nice to meet you是初次见面时的常用表达。',
                topicId: topic.id
              }
            ];
          } else if (topic.title.includes('电话沟通')) {
            exercisesData = [
              {
                type: 'single_choice',
                question: 'May I speak to John, please? 的意思是什么？',
                options: JSON.stringify(['我可以和约翰说话吗？', '我是约翰。', '约翰不在。', '约翰正在开会。']),
                answer: '我可以和约翰说话吗？',
                explanation: 'May I speak to...是电话中请求与某人通话的常用表达。',
                topicId: topic.id
              },
              {
                type: 'fill_blank',
                question: '请稍等。用英语怎么说？',
                answer: 'Please hold on.',
                explanation: 'hold on是电话中让对方稍等的常用表达。',
                topicId: topic.id
              }
            ];
          } else if (topic.title.includes('会议')) {
            exercisesData = [
              {
                type: 'single_choice',
                question: 'Let\'s begin the meeting. 的意思是什么？',
                options: JSON.stringify(['让我们结束会议。', '让我们开始会议。', '让我们延期会议。', '让我们取消会议。']),
                answer: '让我们开始会议。',
                explanation: 'begin是开始的意思。',
                topicId: topic.id
              },
              {
                type: 'fill_blank',
                question: '我同意你的观点。用英语怎么说？',
                answer: 'I agree with you.',
                explanation: 'agree with是同意的意思。',
                topicId: topic.id
              }
            ];
          } else if (topic.title.includes('邮件')) {
            exercisesData = [
              {
                type: 'single_choice',
                question: 'Dear Mr. Smith, 通常用在邮件的什么部分？',
                options: JSON.stringify(['结尾', '正文', '称呼', '主题']),
                answer: '称呼',
                explanation: 'Dear...是邮件开头的称呼部分。',
                topicId: topic.id
              },
              {
                type: 'fill_blank',
                question: '期待您的回复。用英语怎么说？',
                answer: 'Looking forward to your reply.',
                explanation: 'Looking forward to是期待的意思。',
                topicId: topic.id
              }
            ];
          }
        } else if (course.title === '旅游英语') {
          if (topic.title.includes('预订机票')) {
            exercisesData = [
              {
                type: 'single_choice',
                question: 'I would like to book a flight to New York. 的意思是什么？',
                options: JSON.stringify(['我想要去纽约。', '我想要预订去纽约的机票。', '我想要从纽约出发。', '我想要取消去纽约的机票。']),
                answer: '我想要预订去纽约的机票。',
                explanation: 'book a flight是预订机票的意思。',
                topicId: topic.id
              },
              {
                type: 'fill_blank',
                question: '往返机票用英语怎么说？',
                answer: 'round-trip ticket',
                explanation: 'round-trip是往返的意思。',
                topicId: topic.id
              }
            ];
          } else if (topic.title.includes('预订酒店')) {
            exercisesData = [
              {
                type: 'single_choice',
                question: 'I need a room for two nights. 的意思是什么？',
                options: JSON.stringify(['我需要一个房间住两晚。', '我需要两个房间。', '我需要一个双人房。', '我需要一个房间两个床位。']),
                answer: '我需要一个房间住两晚。',
                explanation: 'for two nights表示住两晚。',
                topicId: topic.id
              },
              {
                type: 'fill_blank',
                question: '房价是多少？用英语怎么说？',
                answer: 'What is the room rate?',
                explanation: 'room rate是房价的意思。',
                topicId: topic.id
              }
            ];
          } else if (topic.title.includes('交通出行')) {
            exercisesData = [
              {
                type: 'single_choice',
                question: 'Excuse me, where is the subway station? 的意思是什么？',
                options: JSON.stringify(['对不起，地铁站在哪里？', '对不起，火车站在哪里？', '对不起，汽车站在哪里？', '对不起，飞机场在哪里？']),
                answer: '对不起，地铁站在哪里？',
                explanation: 'subway station是地铁站的意思。',
                topicId: topic.id
              },
              {
                type: 'fill_blank',
                question: '到市中心需要多长时间？用英语怎么说？',
                answer: 'How long does it take to get to the city center?',
                explanation: 'How long does it take是询问需要多长时间的常用表达。',
                topicId: topic.id
              }
            ];
          } else if (topic.title.includes('餐饮服务')) {
            exercisesData = [
              {
                type: 'single_choice',
                question: 'I am a vegetarian. 的意思是什么？',
                options: JSON.stringify(['我是素食主义者。', '我是肉食主义者。', '我不吃海鲜。', '我不吃辣。']),
                answer: '我是素食主义者。',
                explanation: 'vegetarian是素食主义者的意思。',
                topicId: topic.id
              },
              {
                type: 'fill_blank',
                question: '请给我账单。用英语怎么说？',
                answer: 'Please give me the bill.',
                explanation: 'bill是账单的意思。',
                topicId: topic.id
              }
            ];
          }
        } else if (course.title === '学术英语') {
          if (topic.title.includes('论文结构')) {
            exercisesData = [
              {
                type: 'single_choice',
                question: 'Abstract通常在论文的什么位置？',
                options: JSON.stringify(['开头', '中间', '结尾', '参考文献']),
                answer: '开头',
                explanation: 'Abstract是摘要，通常在论文的开头。',
                topicId: topic.id
              },
              {
                type: 'fill_blank',
                question: '论文的结论部分用英语怎么说？',
                answer: 'conclusion',
                explanation: 'conclusion是结论的意思。',
                topicId: topic.id
              }
            ];
          } else if (topic.title.includes('文献引用')) {
            exercisesData = [
              {
                type: 'single_choice',
                question: 'APA格式是一种什么格式？',
                options: JSON.stringify(['论文格式', '引用格式', '简历格式', '邮件格式']),
                answer: '引用格式',
                explanation: 'APA是一种常用的学术引用格式。',
                topicId: topic.id
              },
              {
                type: 'fill_blank',
                question: '参考文献用英语怎么说？',
                answer: 'references',
                explanation: 'references是参考文献的意思。',
                topicId: topic.id
              }
            ];
          } else if (topic.title.includes('演讲')) {
            exercisesData = [
              {
                type: 'single_choice',
                question: 'Good morning, ladies and gentlemen. 通常用在演讲的什么部分？',
                options: JSON.stringify(['结尾', '中间', '开头', '问答环节']),
                answer: '开头',
                explanation: '这是演讲开头的问候语。',
                topicId: topic.id
              },
              {
                type: 'fill_blank',
                question: '我的演讲到此结束。用英语怎么说？',
                answer: 'That\'s all for my presentation.',
                explanation: 'presentation是演讲的意思。',
                topicId: topic.id
              }
            ];
          }
        }
        
        // 如果没有特定练习数据，使用默认练习
        if (exercisesData.length === 0) {
          exercisesData = [
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
            }
          ];
        }
        
        await prisma.exercise.createMany({
          data: exercisesData
        });

        // 根据主题创建有针对性的闪卡
        let flashcardsData = [];
        if (course.title === '英语入门') {
          if (topic.title.includes('字母与发音')) {
            flashcardsData = [
              {
                front: 'A',
                back: '元音字母，发音为 /eɪ/',
                order: 1,
                topicId: topic.id
              },
              {
                front: 'B',
                back: '辅音字母，发音为 /biː/',
                order: 2,
                topicId: topic.id
              },
              {
                front: 'C',
                back: '辅音字母，发音为 /siː/',
                order: 3,
                topicId: topic.id
              },
              {
                front: 'D',
                back: '辅音字母，发音为 /diː/',
                order: 4,
                topicId: topic.id
              }
            ];
          } else if (topic.title.includes('问候语')) {
            flashcardsData = [
              {
                front: 'Hello',
                back: '你好，用于问候',
                order: 1,
                topicId: topic.id
              },
              {
                front: 'Good morning',
                back: '早上好',
                order: 2,
                topicId: topic.id
              },
              {
                front: 'How are you?',
                back: '你好吗？',
                order: 3,
                topicId: topic.id
              },
              {
                front: 'Nice to meet you',
                back: '很高兴认识你',
                order: 4,
                topicId: topic.id
              }
            ];
          } else if (topic.title.includes('数字与时间')) {
            flashcardsData = [
              {
                front: 'one',
                back: '1',
                order: 1,
                topicId: topic.id
              },
              {
                front: 'two',
                back: '2',
                order: 2,
                topicId: topic.id
              },
              {
                front: 'three',
                back: '3',
                order: 3,
                topicId: topic.id
              },
              {
                front: 'four',
                back: '4',
                order: 4,
                topicId: topic.id
              }
            ];
          } else if (topic.title.includes('语法')) {
            flashcardsData = [
              {
                front: 'am',
                back: '用于I后面',
                order: 1,
                topicId: topic.id
              },
              {
                front: 'is',
                back: '用于he, she, it后面',
                order: 2,
                topicId: topic.id
              },
              {
                front: 'are',
                back: '用于you, we, they后面',
                order: 3,
                topicId: topic.id
              },
              {
                front: 'What',
                back: '什么',
                order: 4,
                topicId: topic.id
              }
            ];
          }
        } else if (course.title === '中级英语') {
          if (topic.title.includes('现在进行时')) {
            flashcardsData = [
              {
                front: 'am working',
                back: '我正在工作',
                order: 1,
                topicId: topic.id
              },
              {
                front: 'is eating',
                back: '他/她/它正在吃',
                order: 2,
                topicId: topic.id
              },
              {
                front: 'are playing',
                back: '你/我们/他们正在玩',
                order: 3,
                topicId: topic.id
              },
              {
                front: 'now',
                back: '现在，现在进行时的标志词',
                order: 4,
                topicId: topic.id
              }
            ];
          } else if (topic.title.includes('一般过去时')) {
            flashcardsData = [
              {
                front: 'played',
                back: 'play的过去式',
                order: 1,
                topicId: topic.id
              },
              {
                front: 'went',
                back: 'go的过去式',
                order: 2,
                topicId: topic.id
              },
              {
                front: 'ate',
                back: 'eat的过去式',
                order: 3,
                topicId: topic.id
              },
              {
                front: 'yesterday',
                back: '昨天，一般过去时的标志词',
                order: 4,
                topicId: topic.id
              }
            ];
          } else if (topic.title.includes('购物')) {
            flashcardsData = [
              {
                front: 'How much?',
                back: '多少钱？',
                order: 1,
                topicId: topic.id
              },
              {
                front: 'try on',
                back: '试穿',
                order: 2,
                topicId: topic.id
              },
              {
                front: 'cash',
                back: '现金',
                order: 3,
                topicId: topic.id
              },
              {
                front: 'credit card',
                back: '信用卡',
                order: 4,
                topicId: topic.id
              }
            ];
          } else if (topic.title.includes('餐厅')) {
            flashcardsData = [
              {
                front: 'menu',
                back: '菜单',
                order: 1,
                topicId: topic.id
              },
              {
                front: 'order',
                back: '点餐',
                order: 2,
                topicId: topic.id
              },
              {
                front: 'bill',
                back: '账单',
                order: 3,
                topicId: topic.id
              },
              {
                front: 'tip',
                back: '小费',
                order: 4,
                topicId: topic.id
              }
            ];
          }
        } else if (course.title === '商务英语') {
          if (topic.title.includes('职场介绍')) {
            flashcardsData = [
              {
                front: 'marketing department',
                back: '市场部',
                order: 1,
                topicId: topic.id
              },
              {
                front: 'sales department',
                back: '销售部',
                order: 2,
                topicId: topic.id
              },
              {
                front: 'HR department',
                back: '人力资源部',
                order: 3,
                topicId: topic.id
              },
              {
                front: 'finance department',
                back: '财务部',
                order: 4,
                topicId: topic.id
              }
            ];
          } else if (topic.title.includes('电话沟通')) {
            flashcardsData = [
              {
                front: 'May I speak to...?',
                back: '我可以和...说话吗？',
                order: 1,
                topicId: topic.id
              },
              {
                front: 'Hold on',
                back: '请稍等',
                order: 2,
                topicId: topic.id
              },
              {
                front: 'Leave a message',
                back: '留言',
                order: 3,
                topicId: topic.id
              },
              {
                front: 'Call back',
                back: '回电话',
                order: 4,
                topicId: topic.id
              }
            ];
          } else if (topic.title.includes('会议')) {
            flashcardsData = [
              {
                front: 'agenda',
                back: '议程',
                order: 1,
                topicId: topic.id
              },
              {
                front: 'minutes',
                back: '会议记录',
                order: 2,
                topicId: topic.id
              },
              {
                front: 'action items',
                back: '行动项',
                order: 3,
                topicId: topic.id
              },
              {
                front: 'conclusion',
                back: '结论',
                order: 4,
                topicId: topic.id
              }
            ];
          } else if (topic.title.includes('邮件')) {
            flashcardsData = [
              {
                front: 'subject',
                back: '主题',
                order: 1,
                topicId: topic.id
              },
              {
                front: 'greeting',
                back: '问候语',
                order: 2,
                topicId: topic.id
              },
              {
                front: 'body',
                back: '正文',
                order: 3,
                topicId: topic.id
              },
              {
                front: 'closing',
                back: '结束语',
                order: 4,
                topicId: topic.id
              }
            ];
          }
        } else if (course.title === '旅游英语') {
          if (topic.title.includes('预订机票')) {
            flashcardsData = [
              {
                front: 'round-trip',
                back: '往返',
                order: 1,
                topicId: topic.id
              },
              {
                front: 'one-way',
                back: '单程',
                order: 2,
                topicId: topic.id
              },
              {
                front: 'boarding pass',
                back: '登机牌',
                order: 3,
                topicId: topic.id
              },
              {
                front: 'departure',
                back: '出发',
                order: 4,
                topicId: topic.id
              }
            ];
          } else if (topic.title.includes('预订酒店')) {
            flashcardsData = [
              {
                front: 'single room',
                back: '单人房',
                order: 1,
                topicId: topic.id
              },
              {
                front: 'double room',
                back: '双人房',
                order: 2,
                topicId: topic.id
              },
              {
                front: 'check-in',
                back: '入住',
                order: 3,
                topicId: topic.id
              },
              {
                front: 'check-out',
                back: '退房',
                order: 4,
                topicId: topic.id
              }
            ];
          } else if (topic.title.includes('交通出行')) {
            flashcardsData = [
              {
                front: 'subway',
                back: '地铁',
                order: 1,
                topicId: topic.id
              },
              {
                front: 'bus',
                back: '公交车',
                order: 2,
                topicId: topic.id
              },
              {
                front: 'taxi',
                back: '出租车',
                order: 3,
                topicId: topic.id
              },
              {
                front: 'direction',
                back: '方向',
                order: 4,
                topicId: topic.id
              }
            ];
          } else if (topic.title.includes('餐饮服务')) {
            flashcardsData = [
              {
                front: 'vegetarian',
                back: '素食主义者',
                order: 1,
                topicId: topic.id
              },
              {
                front: 'menu',
                back: '菜单',
                order: 2,
                topicId: topic.id
              },
              {
                front: 'bill',
                back: '账单',
                order: 3,
                topicId: topic.id
              },
              {
                front: 'tip',
                back: '小费',
                order: 4,
                topicId: topic.id
              }
            ];
          }
        } else if (course.title === '学术英语') {
          if (topic.title.includes('论文结构')) {
            flashcardsData = [
              {
                front: 'abstract',
                back: '摘要',
                order: 1,
                topicId: topic.id
              },
              {
                front: 'introduction',
                back: '引言',
                order: 2,
                topicId: topic.id
              },
              {
                front: 'methodology',
                back: '研究方法',
                order: 3,
                topicId: topic.id
              },
              {
                front: 'conclusion',
                back: '结论',
                order: 4,
                topicId: topic.id
              }
            ];
          } else if (topic.title.includes('文献引用')) {
            flashcardsData = [
              {
                front: 'APA',
                back: '美国心理学会引用格式',
                order: 1,
                topicId: topic.id
              },
              {
                front: 'MLA',
                back: '现代语言协会引用格式',
                order: 2,
                topicId: topic.id
              },
              {
                front: 'citation',
                back: '引用',
                order: 3,
                topicId: topic.id
              },
              {
                front: 'references',
                back: '参考文献',
                order: 4,
                topicId: topic.id
              }
            ];
          } else if (topic.title.includes('演讲')) {
            flashcardsData = [
              {
                front: 'presentation',
                back: '演讲',
                order: 1,
                topicId: topic.id
              },
              {
                front: 'slides',
                back: '幻灯片',
                order: 2,
                topicId: topic.id
              },
              {
                front: 'audience',
                back: '听众',
                order: 3,
                topicId: topic.id
              },
              {
                front: 'Q&A',
                back: '问答环节',
                order: 4,
                topicId: topic.id
              }
            ];
          }
        }
        
        // 如果没有特定闪卡数据，使用默认闪卡
        if (flashcardsData.length === 0) {
          flashcardsData = [
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
          ];
        }
        
        await prisma.flashcard.createMany({
          data: flashcardsData
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