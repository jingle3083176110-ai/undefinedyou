const PLACE_WORDS = [
  ["中国", "China"], ["北京", "Beijing"], ["上海", "Shanghai"], ["广州", "Guangzhou"],
  ["深圳", "Shenzhen"], ["杭州", "Hangzhou"], ["成都", "Chengdu"], ["重庆", "Chongqing"],
  ["香港", "Hong Kong"], ["澳门", "Macau"], ["台北", "Taipei"], ["日本", "Japan"],
  ["韩国", "South Korea"], ["美国", "United States"], ["英国", "United Kingdom"],
  ["法国", "France"], ["德国", "Germany"], ["路", "Road"], ["街", "Street"],
  ["大道", "Avenue"], ["公园", "Park"], ["广场", "Square"], ["机场", "Airport"],
];

export function englishPlaceName(value = "") {
  let result = String(value).trim();
  if (!result) return "";
  for (const [source, target] of PLACE_WORDS) result = result.replaceAll(source, ` ${target} `);
  return result.replace(/[，,、。；;|/]+/g, " ").replace(/\s+/g, " ").trim();
}
