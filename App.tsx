
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { TopicCard } from './components/TopicCard';
import { ArticleDisplay } from './components/ArticleDisplay';
import { Spinner } from './components/Spinner';
import { HistoryList } from './components/HistoryList';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { generateTopicIdeas, generateArticle } from './services/geminiService';
import type { TopicIdea } from './types';

const HISTORY_STORAGE_KEY = 'techBlogGeneratorHistory';

const App: React.FC = () => {
  const [topicIdeas, setTopicIdeas] = useState<TopicIdea[]>([]);
  const [generatedArticle, setGeneratedArticle] = useState<string>('');
  const [isLoadingTopics, setIsLoadingTopics] = useState<boolean>(false);
  const [isGeneratingArticle, setIsGeneratingArticle] = useState<boolean>(false);
  const [selectedTopicTheme, setSelectedTopicTheme] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<TopicIdea[]>([]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to parse history from localStorage", e);
      setHistory([]);
    }
  }, []);

  const updateHistory = (newHistory: TopicIdea[]) => {
    setHistory(newHistory);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newHistory));
  };

  const handleGenerateTopics = useCallback(async () => {
    setIsLoadingTopics(true);
    setTopicIdeas([]);
    setGeneratedArticle('');
    setError(null);
    try {
      const ideas = await generateTopicIdeas(history);
      setTopicIdeas(ideas);
    } catch (err) {
      console.error(err);
      setError('技術テーマの生成に失敗しました。APIキーを確認するか、後でもう一度お試しください。');
    } finally {
      setIsLoadingTopics(false);
    }
  }, [history]);

  const handleGenerateArticle = useCallback(async (topic: TopicIdea) => {
    setIsGeneratingArticle(true);
    setSelectedTopicTheme(topic.theme);
    setGeneratedArticle('');
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      const article = await generateArticle(topic);
      setGeneratedArticle(article);
      if (!history.some(h => h.theme === topic.theme)) {
        const newHistory = [topic, ...history];
        updateHistory(newHistory);
      }
    } catch (err) {
      console.error(err);
      setError('記事の生成に失敗しました。後でもう一度お試しください。');
    } finally {
      setIsGeneratingArticle(false);
    }
  }, [history]);

  const handleClearHistory = useCallback(() => {
    updateHistory([]);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            AI技術ブログ記事ジェネレーター
          </h2>
          <p className="text-slate-600 mb-6">
            開発者が直面するエラーや技術的課題をテーマに、AIが解決策をまとめた備忘録スタイルの記事を生成します。
          </p>
          <button
            onClick={handleGenerateTopics}
            disabled={isLoadingTopics || isGeneratingArticle}
            className="flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all duration-300"
          >
            <SparklesIcon className="w-5 h-5" />
            <span>技術テーマを生成</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
            <strong className="font-bold">エラー: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {isGeneratingArticle && (
          <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-lg p-8 mb-8 border border-slate-200 text-center">
            <Spinner />
            <p className="text-lg font-semibold text-indigo-600 mt-4">
              記事を生成中です...
            </p>
            <p className="text-slate-500">
              「{selectedTopicTheme}」についての記事を作成しています。少々お待ちください。
            </p>
          </div>
        )}

        {generatedArticle && !isGeneratingArticle && (
          <ArticleDisplay article={generatedArticle} />
        )}
        
        {isLoadingTopics && (
          <div className="flex justify-center items-center p-8">
            <Spinner />
            <p className="ml-4 text-slate-600">技術テーマを探しています...</p>
          </div>
        )}

        {!isLoadingTopics && topicIdeas.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-slate-700 mb-4">生成されたテーマ案</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topicIdeas.map((idea, index) => (
                <TopicCard
                  key={index}
                  topic={idea}
                  onGenerateArticle={handleGenerateArticle}
                  isGenerating={isGeneratingArticle}
                />
              ))}
            </div>
          </div>
        )}

        <HistoryList history={history} onClear={handleClearHistory} />

      </main>
    </div>
  );
};

export default App;
