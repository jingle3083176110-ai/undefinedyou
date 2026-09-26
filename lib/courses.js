const notesBase = "https://github.com/jingle3083176110-ai/Courses-Note-CUHK-SZ/tree/main";

const courseDetails = {
  BIO1008: {
    institution: "The Chinese University Of Hongkong (shenzhen)",
    instructor: "Prof. CHEN Gang & Prof. Zhou YANG",
    description: "In this course, the students will learn the fundamental concepts of matter and energy in chemistry and life sciences. We will introduce the basic concepts of atoms, electrons, chemical bonding, molecules, and intermolecular interactions. We will discuss the properties of gases, liquids, and solids and the interactions and laws governing these properties. The scientific methods for measuring chemical properties and reactions will be briefly discussed. The other half of the course deals with an introduction into the chemical universe that makes life possible; simple sugars and complex carbohydrates, amino acids, peptides and proteins, DNA, RNA and lipids. It is about how these compounds are involved in some of the basic mechanisms of life, presents our current understandings of molecules of life, cells, genetics, biotechnology, human structure and functions.",
  },
  CSC1003: {
    institution: "The Chinese University Of Hong Kong (shenzhen)",
    instructor: "Prof. Chenhao Ma",
    description: "General Biology is a foundation course that is designed for students who may or may not have taken science courses with a biology component at the senior high school level. It presents our current understandings of cells and molecules of life, genetics and evolution, organisms and their environment. Those students who have successfully completed this course will have a solid foundation for studying more advanced courses in life sciences.",
  },
  DAI1000: {
    institution: "The Chinese University Of Hong Kong (shenzhen)",
    instructor: "Prof. Yongqian LIN",
    description: "This course provides a comprehensive introduction to Information Technology (IT) and Artificial Intelligence (AI), equipping students with essential know-how for the AI era. Students will explore key IT applications and laws, recent developments of AI, cybersecurity, and the societal implications of AI. Hands-on practices will focus on real-world use cases, empowering students to adapt to rapidly evolving innovations in IT and AI.",
  },
  ENG1001: {
    institution: "The Chinese University Of Hong Kong (shenzhen)",
    instructor: "Prof. Yilu NIE",
    description: "ENG 1001 (EBP) is the first in a series of four courses to improve students’ ability to read, write, listen, and speak in English. The goal is for students to learn to communicate accurately, efficiently, and with confidence in an academic context. To accomplish this, the program approaches English in a systematic way through an integrated series of assignments linking reading, writing, listening, and speaking. The assignments progress from simple to more complex, adding skills and building on what students learn. The program covers word forms, sentence-level grammar, the writing process, paragraph and paper organization, writing style, basic citation, reading skills, listening skills, and public speaking skills.",
  },
  MAT1001: {
    institution: "The Chinese University Of Hong Kong (shenzhen)",
    instructor: "Prof. Yang LIU",
    description: "This course covers one-variable calculus; it emphasizes intuitive and conceptual understanding of the theory of Calculus, computation skills, and nurtures the mentality and the ability to use Calculus to solve problems in other scientific disciplines.",
  },
  PED1122: {
    institution: "The Chinese University Of Hong Kong (shenzhen)",
    instructor: "Prof. Chenghao MA",
    description: "Physical Education (PE) and Health is one of the core courses at the Chinese University of Hong Kong, Shenzhen. It consists of two sections, namely: (i) PE, and (ii) Fitness and Health. Wushu Sanda is one of the courses in Physical Education. Wushu Sanda is a modern unarmed combat sport developed from traditional wushu techniques and primarily uses kicking, boxing, wrestling, and defensive techniques. This course focuses on fundamental theories of physical fitness (including proper use of fitness equipment, cardiopulmonary fitness, and muscular fitness) and the techniques/tactics of Sanda. Through systematic training, students will master fundamental Sanda techniques, including kicking, boxing, and takedowns, while understanding defensive and offensive strategies. The course includes basic skill training, combination techniques practice, sparring, and tactical application. Through this course, students will enhance their physical fitness, improve their self-defense skills, and develop the quality of perseverance.",
  },
  CHI1000: {
    institution: "The Chinese University Of Hongkong (shenzhen)",
    instructor: "Prof. Shitu Lu",
    description: "The course aims to enhance students' abilities to utilise the Chinese language and analyse Chinese literary works to broaden their cultural horizons. The course includes guiding students to appreciate various forms of Chinese literary works, training students' abilities in Chinese writing and speaking, and introducing knowledge of the Chinese language of literature.",
  },
  CSC1004: {
    institution: "The Chinese University Of Hongkong (shenzhen)",
    instructor: "Prof. Guiliang Liu",
    description: "This course is a computational lab course for the purpose of strengthening programming skill. As a laboratory course, CSC-1004 will be delivered in the format of finishing projects. Self-learning is especially important for succeeding in this course.",
  },
  ENG1002: {
    institution: "The Chinese University Of Hongkong (shenzhen)",
    instructor: "Prof. Shuozhao Hou",
    description: "EAP 1 (ENG 1002) is the second course of the First-Year English Program, and the first of two courses that teach English for academic purposes. It is offered to all undergraduates except students in the language programs, the Clinical Medicine program, and those from the School of Music. Students in this course continue their development as readers, writers, listeners, and speakers of English. In this course, students progress from the personal, primarily expressive essays they wrote in ENG 1001 to more complex third-person essays. These include a cause-and-effect and an argument essay. They will continue to improve grammar, punctuation, spelling, and vocabulary, but will also focus on more complex points including internal paragraph cohesion, transitions between paragraphs and between ideas within paragraphs, using specific details, quotations, and examples, research and citation, and logic and logical application of information. They will also improve reading and listening comprehension skills, speaking skills, and study skills.",
  },
  MAT1002: {
    institution: "The Chinese University Of Hongkong (shenzhen)",
    instructor: "Prof. Bingyu Cui",
    description: "This course is a continuation of Calculus I, covering series and multivariable calculus. It emphasizes intuitive and conceptual understanding of theory of series and multivariable calculus, as well as computation skills; it cultivates the ability to use Calculus to solve problems within mathematics and from other scientific disciplines.",
  },
  MAT2041: {
    institution: "The Chinese University Of Hongkong (shenzhen)",
    instructor: "Prof. Ruoyu Sun",
    description: "This course introduces the fundamental concepts and techniques of linear algebra, including: system of linear equations, matrices, vectors, vector spaces, determinants, linear transformations, orthogonality, eigen-theory, quadratic forms and singular value decomposition.",
  },
  PED1205: {
    institution: "The Chinese University Of Hongkong (shenzhen)",
    instructor: "Prof. Chen WANG",
    description: "Physical Education (PE) and Health is one of core courses in the Chinese University of Hong Kong, Shenzhen. It consists of two sections, namely: (i) PE, and (ii) Fitness and Health. Frisbee is one of courses in the Fitness and Health. Frisbee is a rapidly growing sport where players propel discs through the air, aiming for controlled catches by teammates or opponents. Evolving beyond its casual roots, the sport now encompasses diverse competitive formats and specialized techniques. This course focuses on applied physical fitness practices (including body composition analysis and exercise prescription design) and core Frisbee skills: grip method, forehand/backhand throws, two-handed pancake catches, crab-style receptions, deception maneuvers, hammer throws, and offensive/defensive positioning strategies. Students develop game scenario tactics through structured drills like mark evasion patterns, zone defense rotations, and end-zone cutting sequences. Progress is tracked via accuracy challenges (distance/angle benchmarks) and live gameplay simulations. Beyond physical training, the curriculum cultivates teamwork, adaptability, and resilience through high-intensity mini-games and tournament-style simulations.",
  },
  ENGG1910: {
    institution: "The Chinese University Of Hongkong",
    instructor: "Prof. Dr. Dongkun HAN",
    description: "This course enables students with no technical background to have a general understanding and a taste of hands-on exploration of Artificial Intelligence (AI) and Machine Learning (ML). The course covers the basic concepts, problems, approaches and applications of AI components and systems. It provides an introduction to various topics in AI systems and technologies, e.g., an overview of AI, data representation and visualization, basics of ML, ethical and legal issues with AI, etc. It discusses the applications of engineering principles to selected AI and ML problems, including image classification, machine translation, and voice cloning. It also explores the future possibilities and challenges of AI.",
  },
  COMM3131: {
    institution: "The Chinese University Of Hongkong",
    instructor: "Prof. Lik Sam CHAN",
    description: "Grindr, Tinder, Momo—sound familiar? It is estimated, in 2023, that there were 11.1 million online dating users in the United Kingdom; the number was 60.5 million in the United States and China alone had 200 million users in 2024. This course provides an interdisciplinary approach to look into this growing online culture. Departing from the public health approach that focuses exclusively on sexually transmitted diseases via the use of online dating platforms, this course examines the communicative, psychological, and sociocultural aspects of online dating and hookup culture. Topics include online relationship development, motivations for app use, app design, and critical issues such as gender politics, queer world-making, and sexual racism. Case studies will be drawn from various regions. By the end of the course, you will be able to identify the opportunities and challenges that dating and hookup apps present to users and critically evaluate the implications of these apps. Some required readings will involve quantitative reasoning.",
  },
  CSC3001: {
    institution: "The Chinese University of Hong Kong, Shenzhen",
    instructor: "Prof. Chenjun XIAO",
    description: "Discrete Mathematics is a branch of mathematics dealing with objects that can assume only distinct, separated values. It is a crucial foundation for modern computer science and provides the mathematical underpinning for areas such as cryptography, algorithm design, network theory, and data analysis. This course develops analytical and problem-solving skills, rigorous proof techniques, and an understanding of the abstract structures behind computational processes. Topics are explored through readings, discussion, and written and oral responses to texts in philosophy, science, and the history of science.",
  },
  CSC3200: {
    institution: "The Chinese University of Hong Kong, Shenzhen",
    instructor: "Prof. Jingbang CHEN",
    description: "This course introduces the C and C++ languages and commonly used data types, including functions and libraries, strings and streams, pointers, dynamic memory management, classes, and templates. Abstract data types such as arrays, linked lists, stacks, queues, trees, sets, hash tables, and graphs are introduced together with their implementations in C++.",
  },
  GFN1000: {
    institution: "The Chinese University of Hong Kong, Shenzhen",
    instructor: "Prof. Yifan CAI",
    description: "This course explores how people have investigated, understood, and changed nature. It compares the development of science in Western and Chinese cultures and reflects on humanity's place in nature. Students read, discuss, and write about texts in philosophy, science, and the history of science, with emphasis on critical responses in written and oral presentations.",
  },
  PHY1001: {
    institution: "The Chinese University of Hong Kong, Shenzhen",
    instructor: "Prof. Han LING",
    description: "This introductory calculus-based engineering physics course focuses on mechanics. Topics include units and vectors, force and motion, work and kinetic energy, potential energy and conservation of energy, momentum and impulse, torque, rotation, equilibrium and elasticity, oscillations, and waves.",
  },
  STA2001: {
    institution: "The Chinese University of Hong Kong, Shenzhen",
    instructor: "Prof. Ja Kwang KIM",
    description: "This course covers the basic concepts of probability and statistics, including probability theory, random variables, probability distributions, mathematical expectations, conditional probability, independence, correlation, univariate and bivariate distributions, transformations of random variables, sampling distributions, moment generating functions, convergence of sequences of random variables, the laws of large numbers, and the central limit theorem.",
  },
};

const course = (code, title, notesPath = "") => ({
  code,
  title,
  institution: courseDetails[code]?.institution ?? "",
  instructor: courseDetails[code]?.instructor ?? "",
  description: courseDetails[code]?.description ?? "",
  notesUrl: notesPath ? `${notesBase}/${notesPath}` : "",
});

export const courseTerms = [
  {
    id: "2025-26-term-1",
    year: "2025–26",
    term: "Term 1",
    termZh: "第一学期",
    courses: [
      course("BIO1008", "Chemistry and Life Sciences", "Year1%20Term1/BIO1008"),
      course("CSC1003", "Introduction to Computer Science and Java Programming", "Year1%20Term1/CSC1003"),
      course("DAI1000", "Digital and AI Literacy", "Year1%20Term1/DAI1000"),
      course("ENG1001", "English Bridge Program (EBP)", "Year1%20Term1/ENG1001"),
      course("MAT1001", "Calculus I", "Year1%20Term1/MAT1001"),
      course("PED1122", "Wushu Sanda", "Year1%20Term1/PED1122"),
    ],
  },
  {
    id: "2025-26-term-2",
    year: "2025–26",
    term: "Term 2",
    termZh: "第二学期",
    courses: [
      course("CHI1000", "Chinese", "Year1%20Term2/CHI1000"),
      course("CSC1004", "Computational Laboratory Using Java", "Year1%20Term2/CSC1004"),
      course("ENG1002", "English for Academic Purposes I", "Year1%20Term2/ENG1002"),
      course("MAT1002", "Calculus II", "Year1%20Term2/MAT1002"),
      course("MAT2041", "Linear Algebra and Applications", "Year1%20Term2/MAT2041"),
      course("PED1205", "Frisbee", "Year1%20Term2/PED1205"),
    ],
  },
  {
    id: "2025-26-summer",
    year: "2025–26",
    term: "Summer",
    termZh: "暑期学期",
    courses: [
      course("COMM3131", "Special Topic in Communication Studies I", "Year1Summer/COMM3131"),
      course("ENGG1910", "Demystifying Artificial Intelligence", "Year1Summer/ENGG1910"),
    ],
  },
  {
    id: "2026-27-term-1",
    year: "2026–27",
    term: "Term 1",
    termZh: "第一学期",
    courses: [
      course("CSC3001", "Discrete Mathematics"),
      course("CSC3200", "Data Structures and Advanced Programming"),
      course("GFN1000", "In Dialogue with Nature"),
      course("PHY1001", "Mechanics"),
      course("STA2001", "Probability and Statistics I"),
    ],
  },
];

export const getCourseCount = () => courseTerms.reduce((total, term) => total + term.courses.length, 0);
