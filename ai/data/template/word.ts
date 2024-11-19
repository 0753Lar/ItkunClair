const wordTemplate = {
  word: "example",
  meaning: {
    n: "示例；榜样",
    vt: "作为...的例子；为...做出榜样",
    vi: "举例",
  },
  phonetics: {
    us: "/ɪɡˈzæmpl/",
    uk: "/ɪɡˈzɑːmpl/",
  },
  examples: [
    {
      context: "Academic",
      sentence:
        "This research serves as an example of how climate change affects biodiversity.",
      translation: "这项研究是气候变化如何影响生物多样性的一个例子。",
    },
    {
      context: "Daily Life",
      sentence: "Could you give me an example of how this device works?",
      translation: "你能举个例子说明这个设备是如何工作的吗？",
    },
    {
      context: "Professional",
      sentence:
        "He set an excellent example for his colleagues with his dedication.",
      translation: "他以敬业精神为同事树立了一个很好的榜样。",
    },
  ],
  root_analysis: {
    root: "exampl-",
    meaning: "take out, show",
    derived_words: [
      { word: "exemplify", meaning: "举例说明" },
      { word: "exampled", meaning: "作为例子的" },
    ],
  },
  word_forms: {
    noun: ["example", "examples"],
    verb: ["exemplify", "exemplified", "exemplifies", "exemplifying"],
    adjective: ["exemplary"],
    adverb: ["exemplarily"],
  },
  collocations: [
    { phrase: "set an example", translation: "树立榜样" },
    { phrase: "for example", translation: "例如" },
  ],
  mnemonics:
    "Think of 'example' as something you take out (ex-) to show others (-ample).",
};

const systemPrompt = () =>
  `假设你是一名中英文双语教育专家，拥有帮助将中文视为母语的用户理解和记忆英语单词的专长。`;

const userPrompt = (word: string) => `
给定单词[${word}]，帮忙生成包含以下数据的json数据，要求去除多余话术，返回纯粹并且可以直接使用的json数据。

### 单词释义

### 单词音标

- 包含美式发音和英式发音

### 列举例句

- 根据所需，为该单词提供至少 3 个不同场景下的使用方法和例句。并且附上中文翻译，以帮助用户更深入地理解单词意义。

### 词根分析

- 分析并展示单词的词根；
- 列出由词根衍生出来的其他单词；

### 单词变形

- 列出单词对应的名词、单复数、动词、不同时态、形容词、副词等的变形以及对应的中文翻译。
- 列出单词对应的固定搭配、组词以及对应的中文翻译。

### 记忆辅助

- 提供一些高效的记忆技巧和窍门，以更好地记住英文单词。

参考和使用以下单词结构：
${JSON.stringify(wordTemplate, null, 2)}
`;

export default {
  systemPrompt,
  userPrompt,
};
