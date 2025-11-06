
import React from 'react';
import type { TopicIdea } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';

interface TopicCardProps {
  topic: TopicIdea;
  onGenerateArticle: (topic: TopicIdea) => void;
  isGenerating: boolean;
}

export const TopicCard: React.FC<TopicCardProps> = ({ topic, onGenerateArticle, isGenerating }) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6 flex flex-col h-full transform hover:-translate-y-1 transition-transform duration-300">
      <div className="flex-grow">
        <h4 className="text-lg font-bold text-indigo-700 mb-2">{topic.theme}</h4>
        
        <div className="mb-4">
          <p className="font-semibold text-slate-700 text-sm">ターゲット読者</p>
          <p className="text-slate-600 text-sm">{topic.targetAudience}</p>
        </div>

        <div className="mb-4">
          <p className="font-semibold text-slate-700 text-sm">キーワード</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {topic.keywords.map((kw, i) => (
              <span key={i} className="bg-slate-200 text-slate-700 text-xs font-medium px-2 py-0.5 rounded-full">
                {kw}
              </span>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <p className="font-semibold text-slate-700 text-sm">差別化ポイント</p>
          <p className="text-slate-600 text-sm">{topic.differentiation}</p>
        </div>
      </div>
      
      <div className="mt-auto">
        <button
          onClick={() => onGenerateArticle(topic)}
          disabled={isGenerating}
          className="w-full flex items-center justify-center gap-2 mt-4 px-4 py-2 bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
        >
          <SparklesIcon className="w-4 h-4" />
          <span>この記事を作成</span>
        </button>
      </div>
    </div>
  );
};
