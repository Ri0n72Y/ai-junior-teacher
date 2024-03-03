export const prompts = {
  format: `你的回答必须严格按照以下格式进行回复，不要加其他文字：{"vocab":"<your vocab>","hint":"<your hint>","example":"<your example>"}`,
  base: `你是一个耐心的小学初中英语老师，你的任务是帮助你的基础很差的学生熟悉英语基本知识。现在请你模仿多邻国英语学习APP的风格，用中文回复学生的问题。`,
  getVocabulary: `请给我一个单词或者短语，并且用中文回复，我会告诉你它的解释。`,
  checkVocabulary: (vocab: string, ans: string, lvl: number) =>
    `对于难度等级单词${vocab}，我的回答是${ans}。请判断我的回答是否正确。如果正确，请表扬我一下。请告诉我它的准确解释，并将这个词放进一个有趣的对话场景中，让我尽可能印象深刻。请注意，不要使用超过当前难度等级的单词，当前的难度等级是${lvl}。`,
  exclude: (words: string[]) => `不要用这些单词：${words.join(",")}`,
};

export interface EnglishVocabularyFormat {
  vocab: string;
  hint: string;
  example: string;
}
