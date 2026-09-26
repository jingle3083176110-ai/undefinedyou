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
      course("COMM3131", "Special Topic in Communication Studies I"),
      course("ENGG1910", "Demystifying Artificial Intelligence"),
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
