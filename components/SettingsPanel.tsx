
import React, { useState } from 'react';
import type { Settings } from '../types';

interface SettingsPanelProps {
  settings: Settings;
  onSave: (settings: Settings) => void;
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onSave, onClose }) => {
  const [currentSettings, setCurrentSettings] = useState<Settings>(settings);

  const handleSave = () => {
    onSave(currentSettings);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentSettings(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" aria-modal="true" role="dialog">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">AI設定</h2>
          <p className="text-sm text-slate-500 mt-1">AIに記事を生成させる際の挙動をカスタマイズします。</p>
        </div>
        <div className="p-6 space-y-6 overflow-y-auto">
          <div>
            <label htmlFor="persona" className="block text-sm font-bold text-slate-700 mb-2">
              AIのペルソナ・文体
            </label>
            <textarea
              id="persona"
              name="persona"
              rows={3}
              value={currentSettings.persona}
              onChange={handleChange}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-md font-mono text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="例：あなたは、Web3とブロックチェーン技術に精通したエンジニアです。文体は、初心者にも分かりやすいように平易な言葉で解説するスタイルでお願いします。"
            />
          </div>
          <div>
            <label htmlFor="environments" className="block text-sm font-bold text-slate-700 mb-2">
              参考環境
            </label>
            <textarea
              id="environments"
              name="environments"
              rows={10}
              value={currentSettings.environments}
              onChange={handleChange}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-md font-mono text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="記事で言及する開発環境を記述します。&#10;例：&#10;## ローカル環境&#10;- OS: Windows 11&#10;- Node.js: v18.17.0"
            />
          </div>
          <div>
            <label htmlFor="formattingRules" className="block text-sm font-bold text-slate-700 mb-2">
              フォーマットルール
            </label>
            <textarea
              id="formattingRules"
              name="formattingRules"
              rows={12}
              value={currentSettings.formattingRules}
              onChange={handleChange}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-md font-mono text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="投稿先のブログプラットフォームの仕様に合わせて、Markdownのルールや記事構成を指示します。&#10;例：&#10;1. Front Matter: title, tags, published を含めること。&#10;2. 構成: 「はじめに」「本題」「まとめ」の3部構成とすること。"
            />
          </div>
        </div>
        <div className="p-6 border-t border-slate-200 bg-slate-50 rounded-b-xl flex justify-end items-center gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white rounded-md border border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            設定を保存
          </button>
        </div>
      </div>
    </div>
  );
};
