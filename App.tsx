
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { TopicCard } from './components/TopicCard';
import { ArticleDisplay } from './components/ArticleDisplay';
import { Spinner } from './components/Spinner';
import { HistoryList } from './components/HistoryList';
import { AffiliateBanner } from './components/AffiliateBanner';
import { SettingsPanel } from './components/SettingsPanel';
import { ApiKeyBanner } from './components/ApiKeyBanner';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { generateTopicIdeas, generateArticle } from './services/geminiService';
import type { TopicIdea, Settings } from './types';

const HISTORY_STORAGE_KEY = 'techBlogGeneratorHistory';
const SETTINGS_STORAGE_KEY = 'techBlogGeneratorSettings';
const API_KEY_STORAGE_KEY = 'geminiApiKey';

const defaultSettings: Settings = {
  persona: `あなたは、様々な開発環境（macOS, Windows, Linux, VPSサーバー）に精通した経験豊富なソフトウェアエンジニアです。`,
  environments: `## 参考環境 (ローカル開発環境)
- マシン: MacBook Pro (M1 Pro)
- OS: macOS Sequoia 15.6
- シェル: Zsh
- パッケージマネージャー: Homebrew 4.3.5
- Node.js: v20.12.2 (nvm経由)

## 参考環境 (サーバー環境)
- サービス: Generic Cloud VPS
- OS: Ubuntu 22.04 LTS
- Webサーバー: Nginx
- コンテナ: Docker Engine 26.1.1`,
  formattingRules: `1. **フォーマット**: 一般的なMarkdown記法に従ってください。
2. **Front Matter**: 記事の先頭に、以下の仕様でYAML形式のFront Matterを必ず含めてください。
   - \`title\`: [生成されたタイトル]
   - \`emoji\`: 記事の内容に最も適した絵文字を1つ
   - \`type\`: "tech"
   - \`topics\`: 関連する技術キーワードを英語小文字で3〜5個
   - \`published\`: false
3. **記事構成**:
   - **はじめに**: 問題の概要を説明します。
   - **対象環境**: 問題が確認された環境を \`:::message\` のような情報ブロックで記述します。
   - **原因**: 考えられる原因を簡潔に説明します。
   - **解決策**: 具体的な手順をコードスニペットを交えて記述します。
   - **おわりに**: 記事のまとめや参照リンクを記載します。
4. **スタイル**:
   - **トーン**: 事実を淡々と記述する備忘録スタイル。
   - **文体**: 「だ・である調」で統一。
   - **コードブロック**: \`\`\`言語名:ファイル名\`\`\` のように、可能な限りタイトルを付けてください。`,
};


const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [topicIdeas, setTopicIdeas] = useState<TopicIdea[]>([]);
  const [generatedArticle, setGeneratedArticle] = useState<string>('');
  const [isLoadingTopics, setIsLoadingTopics] = useState<boolean>(false);
  const [isGeneratingArticle, setIsGeneratingArticle] = useState<boolean>(false);
  const [selectedTopicTheme, setSelectedTopicTheme] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<TopicIdea[]>([]);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      const storedApiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
      if (storedApiKey) {
        setApiKey(storedApiKey);
      }
      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
      const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      } else {
        setSettings(defaultSettings);
      }
    } catch (e) {
      console.error("Failed to parse from localStorage", e);
    }
  }, []);

  const updateHistory = (newHistory: TopicIdea[]) => {
    setHistory(newHistory);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newHistory));
  };
  
  const handleSaveSettings = (newSettings: Settings, newApiKey: string) => {
    setSettings(newSettings);
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
    setApiKey(newApiKey);
    localStorage.setItem(API_KEY_STORAGE_KEY, newApiKey);
    setIsSettingsOpen(false);
  };

  const handleGenerateTopics = useCallback(async () => {
    if (!apiKey) {
      setError('APIキーが設定されていません。設定画面からキーを登録してください。');
      return;
    }
    setIsLoadingTopics(true);
    setTopicIdeas([]);
    setGeneratedArticle('');
    setError(null);
    try {
      const ideas = await generateTopicIdeas(apiKey, history, settings);
      setTopicIdeas(ideas);
      if (ideas && ideas.length > 0) {
        const newHistory = [...ideas, ...history];
        updateHistory(newHistory);
      }
    } catch (err) {
      console.error(err);
      setError('技術テーマの生成に失敗しました。APIキーが正しいか確認するか、後でもう一度お試しください。');
    } finally {
      setIsLoadingTopics(false);
    }
  }, [apiKey, history, settings]);

  const handleGenerateArticle = useCallback(async (topic: TopicIdea) => {
    if (!apiKey) {
      setError('APIキーが設定されていません。');
      return;
    }
    setIsGeneratingArticle(true);
    setSelectedTopicTheme(topic.theme);
    setGeneratedArticle('');
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      const article = await generateArticle(apiKey, topic, settings);
      setGeneratedArticle(article);
    } catch (err) {
      console.error(err);
      setError('記事の生成に失敗しました。後でもう一度お試しください。');
    } finally {
      setIsGeneratingArticle(false);
    }
  }, [apiKey, settings]);

  const handleClearHistory = useCallback(() => {
    updateHistory([]);
  }, []);

  const isActionDisabled = isLoadingTopics || isGeneratingArticle || !apiKey;

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <Header onOpenSettings={() => setIsSettingsOpen(true)} />
      <main className="container mx-auto p-4 md:p-8">
        {!apiKey && (
          <ApiKeyBanner onOpenSettings={() => setIsSettingsOpen(true)} className="mb-8" />
        )}
        
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            AI技術ブログ記事ジェネレーター
          </h2>
          <p className="text-slate-600 mb-6">
            開発者が直面するエラーや技術的課題をテーマに、AIが解決策をまとめた備忘録スタイルの記事を生成します。
          </p>
          <button
            onClick={handleGenerateTopics}
            disabled={isActionDisabled}
            className="flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all duration-300"
            aria-disabled={isActionDisabled}
          >
            <SparklesIcon className="w-5 h-5" />
            <span>技術テーマを生成</span>
          </button>
        </div>

        <AffiliateBanner className="mb-8" />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert" aria-live="assertive">
            <strong className="font-bold">エラー: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {isGeneratingArticle && (
          <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-lg p-8 mb-8 border border-slate-200 text-center" aria-live="polite" aria-busy="true">
            <Spinner />
            <p className="text-lg font-semibold text-indigo-600 mt-4">
              記事を生成中です...
            </p>
            <p className="text-slate-500">
              「{selectedTopicTheme}」についての記事を作成しています。少々お待ちください。
            </p>
          </div>
        )}

        <div aria-live="polite">
          {generatedArticle && !isGeneratingArticle && (
            <ArticleDisplay article={generatedArticle} />
          )}
        </div>
        
        {isLoadingTopics && (
          <div className="flex justify-center items-center p-8" aria-live="polite" aria-busy="true">
            <Spinner />
            <p className="ml-4 text-slate-600">技術テーマを探しています...</p>
          </div>
        )}

        {!isLoadingTopics && topicIdeas.length > 0 && (
          <div aria-live="polite">
            <h3 className="text-xl font-bold text-slate-700 mb-4">生成されたテーマ案</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topicIdeas.map((idea, index) => (
                <TopicCard
                  key={index}
                  topic={idea}
                  onGenerateArticle={handleGenerateArticle}
                  isGenerating={isGeneratingArticle || !apiKey}
                />
              ))}
            </div>
          </div>
        )}

        <HistoryList history={history} onClear={handleClearHistory} />

        {history.length > 0 && <AffiliateBanner className="mt-8" />}

      </main>
      
      {isSettingsOpen && (
        <SettingsPanel
          settings={settings}
          apiKey={apiKey}
          onSave={handleSaveSettings}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
