const notesBase = "https://github.com/jingle3083176110-ai/Courses-Note-CUHK-SZ/tree/main";

const course = (code, title, notesPath = "") => ({
  code,
  title,
  institution: "",
  instructor: "",
  description: "",
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
      course("GEW1001", "Ethics and the Rule of Law", "Year1%20Term1/GEW1001"),
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
      course("GEW2001", "Introduction to Marxism"),
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
