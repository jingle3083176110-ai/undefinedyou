import fs from "node:fs";
import path from "node:path";

const books = [
  { slug: "cognitive-awakening", title: "认知觉醒", author: "周岭", rating: 8, color: "#7d3c2f", image: "/reading/cognitive-awakening.png" },
  { slug: "how-to-take-smart-notes", title: "卡片盒笔记写作法", author: "申克·阿伦斯", rating: 6, color: "#365448" },
  { slug: "college-survival-manual", title: "大学生存手册", author: "交大前辈", rating: 7, color: "#806b3f" },
  { slug: "college-breakthrough", title: "大学突围", author: "王振宇", rating: 7, color: "#4d4b68" },
];

function cleanLine(line) {
  return line
    .replace(/!\[\[.*?\]\]/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\[\[([^|\]]+)(?:\|[^\]]+)?\]\]/g, "$1")
    .replace(/<mark[^>]*>(.*?)<\/mark>/g, "**$1**")
    .replace(/==([^=]+)==/g, "**$1**")
    .replace(/<[^>]+>/g, "")
    .replace(/__|`/g, "")
    .replace(/^\s*>\s?/, "")
    .replace(/[￼]/g, "")
    .trim();
}

function toParts(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((part) => part.startsWith("**")
    ? { text: part.slice(2, -2), emphasis: true }
    : { text: part, emphasis: false });
}

function cleanHeading(text) {
  return cleanLine(text).replace(/\*\*/g, "").replace(/\s+#\S+/g, "").trim();
}

function parseNote(slug) {
  const file = path.join(process.cwd(), "content", "reading", `${slug}.md`);
  const source = fs.readFileSync(file, "utf8").replace(/^---[\s\S]*?---\s*/, "");
  const sections = [];
  let current = null;
  for (const raw of source.split(/\r?\n/)) {
    const heading = raw.match(/^(#{1,6})\s+(.+?)\s*$/);
    if (heading) {
      const level = heading[1].length;
      if (level <= 3) { current = { heading: cleanHeading(heading[2]), lines: [] }; sections.push(current); }
      else if (current) current.lines.push({ type: "subheading", text: cleanHeading(heading[2]) });
      continue;
    }
    const line = cleanLine(raw);
    if (line && current && !/^---+$/.test(line)) {
      current.lines.push({
        type: /^\s*(?:[-*+]\s+|\d+[、.)]\s*)/.test(raw) ? "list" : "paragraph",
        text: line.replace(/^\s*(?:[-*+]\s+|\d+[、.)]\s*)/, ""),
        parts: toParts(line.replace(/^\s*(?:[-*+]\s+|\d+[、.)]\s*)/, "")),
      });
    }
  }
  return sections
    .map((section) => ({ heading: section.heading, body: section.lines.slice(0, 8) }))
    .filter((section) => section.body.length);
}

export function getReadingBooks() {
  return books.map((book) => ({ ...book, sections: parseNote(book.slug) }));
}
