import { format } from "std/datetime/mod.ts";
import { HotWord } from "./types.ts";

function genDataListString(words: HotWord[]): string {
  return words
    .map((x) => `1. [${x.text}](https://s.weibo.com${x.url})`)
    .join("\n");
}

export async function genNewReadmeText(words: HotWord[]): Promise<string> {
  const formatedNowTimeStr = format(new Date(), "yyyy-MM-dd HH:mm:ss");
  const readmeTextStr = await Deno.readTextFile("./README.md");

  return readmeTextStr.replace(
    /<!-- BEGIN -->[\W\w]*<!-- END -->/,
    `<!-- BEGIN -->

${genDataListString(words) || "空空如也"}

数据更新于 ${formatedNowTimeStr}

<!-- END -->`,
  );
}

export function genArchiveText(words: HotWord[]): string {
  const formatedNowTimeStr = format(new Date(), "yyyy-MM-dd");

  return `# ${formatedNowTimeStr}\n
${genDataListString(words)}
`;
}

// 根据当前小时，获取权值
export function getCurrentRank(): number {
  const currentHours = (new Date()).getHours();

  if (currentHours >= 2 && currentHours <= 6) {
    return 0.8;
  }

  return 1;
}
