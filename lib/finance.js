import fs from "node:fs";
import path from "node:path";

const entries = [
  { slug: "index-funds", number: "01", title: "指数基金", label: "定投与指数", description: "从指数、ETF 到估值方法，整理长期投资中反复会用到的基础知识。" },
  { slug: "finance-glossary", number: "02", title: "理财相关术语", label: "金融词典", description: "把阅读和做决定时遇到的金融词汇放在一处，随时查阅。" },
  { slug: "us-stocks", number: "03", title: "美股相关知识", label: "市场观察", description: "记录 IPO、ETF、纳斯达克和杠杆产品等美股基础概念。" },
];

function clean(text) {
  return text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\[\[([^|\]]+)(?:\|[^\]]+)?\]\]/g, "$1")
    .replace(/<mark[^>]*>(.*?)<\/mark>/g, "**$1**")
    .replace(/==([^=]+)==/g, "**$1**")
    .replace(/<[^>]+>/g, "")
    .replace(/`|__/g, "")
    .trim();
}

function parts(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((part) => part.startsWith("**")
    ? { text: part.slice(2, -2), emphasis: true }
    : { text: part, emphasis: false });
}

function parse(slug) {
  const source = fs.readFileSync(path.join(process.cwd(), "content", "finance", `${slug}.md`), "utf8");
  const sections = [];
  let current = { heading: "核心笔记", lines: [] };
  for (const raw of source.split(/\r?\n/)) {
    const heading = raw.match(/^(#{1,6})\s+(.+?)\s*$/);
    if (heading) {
      const level = heading[1].length;
      const text = clean(heading[2]).replace(/\*\*/g, "");
      if (level <= 3) { if (current.lines.length) sections.push(current); current = { heading: text, lines: [] }; }
      else current.lines.push({ type: "subheading", text });
      continue;
    }
    const text = clean(raw);
    if (!text) continue;
    const isList = /^\s*(?:[-*+]\s+|\d+[、.)]\s*)/.test(raw);
    const value = text.replace(/^\s*(?:[-*+]\s+|\d+[、.)]\s*)/, "");
    const definition = !isList && !value.includes("**") && value.match(/^([^：:]{1,30})[：:]\s*(.+)$/);
    current.lines.push(definition
      ? { type: "definition", term: definition[1], text: definition[2], parts: parts(definition[2]) }
      : { type: isList ? "list" : "paragraph", text: value, parts: parts(value) });
  }
  if (current.lines.length) sections.push(current);
  return sections.map((section) => ({ ...section, lines: section.lines.slice(0, 10) })).slice(0, 14);
}

export function getFinanceEntries() {
  return entries.map((entry) => ({ ...entry, sections: parse(entry.slug) }));
}
