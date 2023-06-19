
// 过滤掉单词里面的符号 以免影响搜索和单词对比
export function delSymbol(word: string) {
  // 过滤掉 . 和 ,
  return word.replace(/\.|,/g, "");
}