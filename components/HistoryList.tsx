
import React from 'react';
import type { TopicIdea } from '../types';
import { TrashIcon } from './icons/TrashIcon';

interface HistoryListProps {
  history: TopicIdea[];
  onClear: () => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ history, onClear }) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mt-8 border border-slate-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-slate-700">過去に生成したテーマ履歴</h3>
        {history.length > 0 && (
          <button
            onClick={onClear}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            aria-label="履歴をすべて消去"
          >
            <TrashIcon className="w-4 h-4" />
            <span>すべて消去</span>
          </button>
        )}
      </div>
      <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
        {history.map((item, index) => (
          <li key={`${item.theme}-${index}`} className="p-3 bg-slate-100 rounded-md border border-slate-200">
            <p className="text-sm font-medium text-slate-800">{item.theme}</p>
            <p className="text-xs text-slate-500 mt-1">{item.targetAudience}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
