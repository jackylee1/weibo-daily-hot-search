import { format } from "std/datetime/mod.ts";
import { dailyHours } from "./consts.ts";
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

// 根据当前的小时数，获取热度权值
export function getCurrentRank(): number {
  const currentHours = (new Date()).getHours();

  // NOTE: 数值待完善
  if (dailyHours.night.includes(currentHours)) {
    return 0.5;
  } else if (dailyHours.morning.includes(currentHours)) {
    return 0.8;
  } else if (dailyHours.noon.includes(currentHours)) {
    return 1.5;
  }

  return 1;
}
