import { format } from "std/datetime/mod.ts";
import { HotWord } from "./types.ts";

function genDataListString(words: HotWord[]): string {
  return `<!-- BEGIN -->
<!-- 最后更新时间 ${Date()} -->
${words.map((x) => `1. [${x.text}](https://s.weibo.com/${x.url})`).join("\n")}
<!-- END -->`;
}

export async function genNewReadmeText(words: HotWord[]): Promise<string> {
  const readme = await Deno.readTextFile("./README.md");
  return readme.replace(
    /<!-- BEGIN -->[\W\w]*<!-- END -->/,
    genDataListString(words),
  );
}

export function genArchiveText(words: HotWord[]): string {
  const formatedNowTimeStr = format(new Date(), "yyyy-MM-dd");

  return `# ${formatedNowTimeStr}\n
共 ${words.length} 条\n
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
