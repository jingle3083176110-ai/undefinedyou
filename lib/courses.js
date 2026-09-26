const course = (code, title) => ({
  code,
  title,
  institution: "",
  instructor: "",
  description: "",
  notesUrl: "",
});

export const courseTerms = [
  {
    id: "2025-26-term-1",
    year: "2025–26",
    term: "Term 1",
    termZh: "第一学期",
    courses: [
      course("BIO1008", "Chemistry and Life Sciences"),
      course("CSC1003", "Introduction to Computer Science and Java Programming"),
      course("DAI1000", "Digital and AI Literacy"),
      course("ENG1001", "English Bridge Program (EBP)"),
      course("GEW1001", "Ethics and the Rule of Law"),
      course("MAT1001", "Calculus I"),
      course("PED1122", "Wushu Sanda"),
    ],
  },
  {
    id: "2025-26-term-2",
    year: "2025–26",
    term: "Term 2",
    termZh: "第二学期",
    courses: [
      course("CHI1000", "Chinese"),
      course("CSC1004", "Computational Laboratory Using Java"),
      course("ENG1002", "English for Academic Purposes I"),
      course("GEW2001", "Introduction to Marxism"),
      course("MAT1002", "Calculus II"),
      course("MAT2041", "Linear Algebra and Applications"),
      course("PED1205", "Frisbee"),
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
