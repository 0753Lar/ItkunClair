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
  collocations: [
    { phrase: "set an example", translation: "树立榜样" },
    { phrase: "for example", translation: "例如" },
  ],
  mnemonics:
    "Think of 'example' as something you take out (ex-) to show others (-ample).",
};

export type FormalWord = {
  word: string;
  meaning: Record<string, string>;
  phonetics: {
    us: string;
    uk: string;
  };
  examples: {
    context: string;
    sentence: string;
    translation: string;
  }[];
  root_analysis: {
    root: string;
    meaning: string;
    derived_words: {
      word: string;
      meaning: string;
    }[];
  };
  collocations: {
    phrase: string;
    translation: string;
  }[];
  mnemonics: string;
};

export const systemPrompt = () =>
  `假设你是一名中英文双语教育专家，拥有帮助将中文视为母语的用户理解和记忆英语单词的专长。`;

export const userPrompt = (word: string) => `
根据以下数据结构和内容，生成单词${word}的对应json数据，至少包含3个例句作为examples，只返回json. 

${"```json\n" + JSON.stringify(wordTemplate, null, 2) + "\n```"}
`;

export const wordJsonSchema = `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "word": {
      "type": "string",
      "description": "The word being defined."
    },
    "meaning": {
      "type": "object",
      "description": "A mapping of parts of speech to their meanings.",
      "additionalProperties": {
        "type": "string",
        "description": "The meaning of the word for a given part of speech."
      }
    },
    "phonetics": {
      "type": "object",
      "description": "Phonetic transcriptions of the word.",
      "properties": {
        "us": {
          "type": "string",
          "description": "Phonetic transcription in American English."
        },
        "uk": {
          "type": "string",
          "description": "Phonetic transcription in British English."
        }
      },
      "required": ["us", "uk"]
    },
    "examples": {
      "type": "array",
      "description": "Examples of the word used in different contexts.",
      "items": {
        "type": "object",
        "properties": {
          "context": {
            "type": "string",
            "description": "The context in which the example is used."
          },
          "sentence": {
            "type": "string",
            "description": "An example sentence."
          },
          "translation": {
            "type": "string",
            "description": "The translation of the example sentence."
          }
        },
        "required": ["context", "sentence", "translation"]
      }
    },
    "root_analysis": {
      "type": "object",
      "description": "Analysis of the word's root and derived words.",
      "properties": {
        "root": {
          "type": "string",
          "description": "The root of the word."
        },
        "meaning": {
          "type": "string",
          "description": "The meaning of the root."
        },
        "derived_words": {
          "type": "array",
          "description": "Words derived from the root.",
          "items": {
            "type": "object",
            "properties": {
              "word": {
                "type": "string",
                "description": "A derived word."
              },
              "meaning": {
                "type": "string",
                "description": "The meaning of the derived word."
              }
            },
            "required": ["word", "meaning"]
          }
        }
      },
      "required": ["root", "meaning", "derived_words"]
    },
    "collocations": {
      "type": "array",
      "description": "Common phrases or expressions that use the word.",
      "items": {
        "type": "object",
        "properties": {
          "phrase": {
            "type": "string",
            "description": "A collocation or phrase."
          },
          "translation": {
            "type": "string",
            "description": "The translation of the collocation."
          }
        },
        "required": ["phrase", "translation"]
      }
    },
    "mnemonics": {
      "type": "string",
      "description": "A mnemonic to help remember the word."
    }
  },
  "required": [
    "word",
    "meaning",
    "phonetics",
    "examples",
    "root_analysis",
    "collocations",
    "mnemonics"
  ]
}`