import { format } from "std/datetime/mod.ts";
import { join } from "std/path/mod.ts";
import { exists } from "std/fs/mod.ts";

import * as utils from "./utils.ts";
import { HotWord } from "./types.ts";

async function fetchData(): Promise<HotWord[]> {
  const regexp =
    /<a href="(\/weibo\?q=[^"]+)".*?>(.+)<\/a>[\s]+<span>(.+)<\/span>/g;
  const response = await fetch("https://s.weibo.com/top/summary");

  if (!response.ok) {
    console.error(response.statusText);
    Deno.exit(-1);
  }

  const result = await response.text();
  const matches = result.matchAll(regexp);
  const rank = utils.getCurrentRank();

  const words: HotWord[] = Array.from(matches).map((x) => ({
    url: x[1],
    text: x[2],
    count: parseInt(x[3]) * rank,
  }));

  return words;
}

/**
 * 处理源数据，包括去重、关键词过滤、排序、切割
 * @param words 源数据
 */
function handleRawData(rawWords: HotWord[]) {
  const wordTextSet: Set<string> = new Set();
  const words: HotWord[] = [];

  /** 去重 */
  rawWords
    .sort((a, b) => b.count - a.count)
    .forEach((t) => {
      if (!wordTextSet.has(t.text)) {
        wordTextSet.add(t.text);
        words.push(t);
      }
    });

  return words
    .filter((w) => !w.text.includes("肖战"))
    .sort((a, b) => b.count - a.count)
    .splice(0, 50);
}

async function main() {
  const currentDateStr = format(new Date(), "yyyy-MM-dd");
  const rawFilePath = join("raw", `${currentDateStr}.json`);

  const rawHotWords = await fetchData();
  let todayRawData: HotWord[] = [];

  if (await exists(rawFilePath)) {
    const content = await Deno.readTextFile(rawFilePath);
    todayRawData = JSON.parse(content);
  }

  const hotWords = handleRawData(rawHotWords.concat(todayRawData));

  // 保存原始数据
  await Deno.writeTextFile(rawFilePath, JSON.stringify(hotWords));

  // 更新 README.md
  const readme = await utils.genNewReadmeText(hotWords);
  await Deno.writeTextFile("./README.md", readme);

  // 更新 archives
  const archiveText = utils.genArchiveText(hotWords);
  const archivePath = join("archives", `${currentDateStr}.md`);
  await Deno.writeTextFile(archivePath, archiveText);
}

await main();
