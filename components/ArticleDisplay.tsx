
import React, { useState, useCallback } from 'react';
import { ClipboardIcon } from './icons/ClipboardIcon';

interface ArticleDisplayProps {
  article: string;
}

export const ArticleDisplay: React.FC<ArticleDisplayProps> = ({ article }) => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(article).then(() => {
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    });
  }, [article]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 border border-slate-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-slate-800">生成された記事 (Markdown)</h3>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <ClipboardIcon className="w-4 h-4" />
          <span>{copyStatus === 'copied' ? 'コピーしました！' : 'コピー'}</span>
        </button>
      </div>
      <textarea
        readOnly
        value={article}
        className="w-full h-[600px] p-4 bg-slate-50 border border-slate-300 rounded-md font-mono text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        placeholder="ここに生成された記事が表示されます..."
      />
    </div>
  );
};
