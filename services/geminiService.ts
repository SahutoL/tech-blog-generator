
import { GoogleGenAI, Type } from "@google/genai";
import type { TopicIdea, Settings } from '../types';

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


export const generateTopicIdeas = async (apiKey: string, history: TopicIdea[] = [], settings: Settings): Promise<TopicIdea[]> => {
  const ai = new GoogleGenAI({ apiKey });
  
  let historyPrompt = '';
  if (history.length > 0) {
    const historyThemes = history.map(h => `- ${h.theme}`).join('\n');
    historyPrompt = `

# 過去に生成したテーマ
以下のテーマは既に生成済みです。これらとは重複しない、全く新しい視点のテーマを提案してください。
${historyThemes}
`;
  }

  const prompt = `${settings.persona}
これから、開発者が日常的に直面しがちな、具体的な技術的課題やエラー解決に関する記事テーマを3つ提案してください。内容は、特定のOSに限定される必要はありませんが、環境による差異が問題になるようなテーマ（例: ローカル開発環境と本番環境の差異）も歓迎します。
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

export const generateArticle = async (apiKey: string, topic: TopicIdea, settings: Settings): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
${settings.persona}
以下のテーマに基づき、高品質な技術記事を執筆してください。

# 執筆のコンテキスト
この記事は、開発者が直面した特定の問題とその解決策を記録する備忘録です。
もしテーマが特定のOSや環境に関連する場合、以下のユーザー設定の環境を参考にしてください。テーマに応じて、最も適した環境を想定して記述してください。

# ユーザー設定の参考環境
${settings.environments}

**重要**: 記事内で環境について言及する際は、曖昧な表現（例：「13.x」）は避け、ユーザー設定にある具体的なバージョンを記述してください。

# テーマ詳細
- タイトル案: ${topic.theme}
- ターゲット読者: ${topic.targetAudience}
- 含めるべきキーワード: ${topic.keywords.join(', ')}
- 記事の価値: ${topic.differentiation}

# ユーザー設定のフォーマットルール
${settings.formattingRules}

# 出力形式
- 完成されたMarkdown記事のみを出力してください。
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
