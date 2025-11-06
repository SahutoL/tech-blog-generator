import { GoogleGenAI, Type } from "@google/genai";
import type { TopicIdea } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const topicSchema = {
  type: Type.OBJECT,
  properties: {
    ideas: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          theme: {
            type: Type.STRING,
            description: 'The topic title in Japanese, including a specific technology and error name.',
          },
          targetAudience: {
            type: Type.STRING,
            description: 'A brief description of the target developer or user in Japanese (e.g., "Reactで状態管理に悩むフロントエンド開発者").',
          },
          keywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'An array of 3-5 relevant technical keywords in Japanese (e.g., "React", "State Management", "useEffect").',
          },
          differentiation: {
            type: Type.STRING,
            description: 'A key point on the value of this article in Japanese (e.g., "Custom Hookを使った実践的な解決策を提示").',
          },
        },
        required: ['theme', 'targetAudience', 'keywords', 'differentiation'],
      },
    },
  },
  required: ['ideas'],
};


export const generateTopicIdeas = async (history: TopicIdea[] = []): Promise<TopicIdea[]> => {
  let historyPrompt = '';
  if (history.length > 0) {
    const historyThemes = history.map(h => `- ${h.theme}`).join('\n');
    historyPrompt = `

# 過去に生成したテーマ
以下のテーマは既に生成済みです。これらとは重複しない、全く新しい視点のテーマを提案してください。
${historyThemes}
`;
  }

  const prompt = `あなたは、様々な開発環境（macOS, Windows, Linux）に精通した経験豊富なソフトウェアエンジニアです。
これから、開発者が日常的に直面しがちな、具体的な技術的課題やエラー解決に関する記事テーマを3つ提案してください。内容は、特定のOSに限定される必要はありませんが、環境による差異が問題になるようなテーマも歓迎します。
${historyPrompt}

それぞれのテーマについて、以下の詳細を構造化データとして提供してください。
- theme: 解決する課題が一目でわかるような具体的なタイトル（例：「【解決】Dockerコンテナのポートがホストにバインドできない問題」）
- targetAudience: 対象となる開発者や技術スタック（例：「Dockerを使い始めたバックエンドエンジニア」）
- keywords: 関連する技術用語、ライブラリ名、エラーコードなど3〜5個の配列（例: 'docker', 'port binding', 'networking'）
- differentiation: この情報がなぜ有用かを示すポイント（例：「よくある原因とOSごとの確認手順を網羅的に解説」）

提供されたスキーマに厳密に従ったJSONオブジェクトとして出力を返してください。JSON構造の外に、序文、マークダウンフォーマット、または説明を含めないでください。`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: topicSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsed = JSON.parse(jsonText);
    return parsed.ideas || [];
  } catch (error) {
    console.error("Error generating topic ideas:", error);
    throw new Error("Failed to generate topic ideas from Gemini API.");
  }
};

export const generateArticle = async (topic: TopicIdea): Promise<string> => {
  const prompt = `
あなたは日本の技術ブログプラットフォーム「Zenn」に精通した、経験豊富なソフトウェアエンジニアです。
以下のテーマに基づき、Zennに投稿するための高品質な技術記事を執筆してください。

# 執筆のコンテキスト
この記事は、開発者が直面した特定の問題とその解決策を記録する備忘録です。
もしテーマがmacOSに関連する場合、以下の環境を参考にしてください。ただし、テーマが特定のOSに依存しない、または別のOS（Windowsなど）に関するものである場合は、そのテーマに最も適した環境を想定して記述してください。

## 参考環境 (macOSの場合)
- **マシン**: MacBook Pro (14-inch, M1 Pro)
- **OS**: macOS Sequoia 15.6
- **シェル**: Zsh (macOS標準)
- **パッケージマネージャー**: Homebrew 4.3.5
- **Docker**: Docker Desktop 4.29.0
- **Next.js**: v14.2.3
- **Node.js**: v20.12.2 (nvm 0.39.7経由でインストール)
- **Python**: 3.11.8 (pyenv 2.4.0経由でインストール)
- **Git**: 2.45.1 (Homebrew経由でインストール)


## 参考環境 (windowsの場合)
- **OS**: Windows 11 Pro 23H2
- **シェル**: PowerShell 7.4.2
- **Python**: 3.10.2 (python.org公式インストーラ)
- **Git**: Git for Windows 2.45.1

## 参考環境 (Linuxの場合)
- **OS**: Ubuntu 22.04.4 LTS
- **シェル**: Bash 5.1.16
- **Python**: 3.10.12 (apt)
- **Git**: 2.34.1 (apt)

## 参考環境（共通）
- **エディタ**: Visual Studio Code 1.90.0


**重要**: 記事内で環境について言及する際は、曖昧な表現（例：「13.x」）は避け、具体的なバージョンを記述してください。

# テーマ詳細
- タイトル案: ${topic.theme}
- ターゲット読者: ${topic.targetAudience}
- 含めるべきキーワード: ${topic.keywords.join(', ')}
- 記事の価値: ${topic.differentiation}

# Zenn用執筆ルール
1. **フォーマット**: [ZennのMarkdown記法](https://zenn.dev/zenn/articles/markdown-guide)に厳密に従ってください。
2. **Front Matter**: 記事の先頭に、以下の仕様でYAML形式のFront Matterを必ず含めてください。
   - \`title\`: 「${topic.theme}」をそのまま使用してください。単純明快なものにしてください．
   - \`emoji\`: 記事の内容に最も適した絵文字を1つ選んでください (例: 💡, ✅, 🐛, 🔧)。
   - \`type\`: "tech" にしてください。
   - \`topics\`: テーマ詳細のキーワード (${topic.keywords.join(', ')}) を参考に、Zennのトピックとして適切なものを英語小文字（例: "react", "docker"）で3〜5個設定してください。
   - \`published\`: false にしてください。
3. **記事構成**:
   - **見出し**: \`## はじめに\`, \`## 対象環境\`, \`## 原因\`, \`## 解決策\`, \`## おわりに\` のような構成を基本とします。
   - **はじめに**: どのような問題が発生したかを簡潔に記述します。
   - **対象環境**: 記事が対象とする環境を \`:::message\` ブロック内に記述します。以下のルールに厳密に従ってください。
     - **単一OSの場合**: 記事が特定のOS（例: macOSのみ）に限定される場合は、以下のフォーマットを使用します。冒頭に「この記事は、以下の環境で動作確認をしています。」という一文を必ず含めてください。
       \`\`\`markdown
       :::message
       この記事は、以下の環境で動作確認をしています。

       - OS: macOS Sequoia 15.6
       - [ツール名1]: [バージョン]
       - [ツール名2]: [バージョン]
       :::
       \`\`\`
     - **複数OSの場合**: 記事が複数のOSにまたがる内容の場合は、OSごとにグループ化して以下のフォーマットを使用します。冒頭に「この記事で紹介する手順は、以下の各環境で確認しています。」という一文を必ず含めてください。
       \`\`\`markdown
       :::message
       この記事で紹介する手順は、以下の各環境で確認しています。

       - **macOS**
         - OS: macOS Sequoia 15.6
         - [ツール名]: [バージョン]
       - **Windows**
         - OS: Windows 11 Pro 23H2
         - [ツール名]: [バージョン]
       - **Linux**
         - OS: Ubuntu 22.04.4 LTS
         - [ツール名]: [バージョン]
       :::
       \`\`\`
     - リストには、テーマに直接関連するツールやライブラリの具体的なバージョンを必ず含めてください。参考環境の情報（マシン名、シェルなど）は必須ではありません。
   - **原因**: 考えられる原因を簡潔に説明します。
   - **解決策**: 問題を解決するための具体的な手順を、コマンドやコードスニペットを交えて記述します。重要な補足情報は \`:::message alert\` を活用してください。
   - **おわりに**: 記事のまとめ、補足情報、参照した公式ドキュメントへのリンクなどを記載します。
4. **スタイル**:
   - **トーン**: 感情を排し、事実を淡々と記述する備忘録スタイル。
   - **文体**: 全体を「だ・である調」で統一する。
   - **コードブロック**: \`\`\`言語名:ファイル名.拡張子 ... \`\`\` のように、可能な限りファイル名やタイトルを指定してください。
   - **強調の禁止**: アスタリスク（*）を用いた文字の強調は一切使用しないでください。
   - **リンクの挿入**: 記事の信頼性を高めるため、言及した公式ドキュメントやツールへのリンクをMarkdown形式（[リンクテキスト](URL)）で適切に挿入してください。

# 出力形式
- 完成されたZenn用Markdown記事のみを出力してください。
- 記事の本文以外に、前後の挨拶や説明は一切不要です。
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
    });
    return response.text;
  } catch (error)
{
    console.error("Error generating article:", error);
    throw new Error("Failed to generate article from Gemini API.");
  }
};