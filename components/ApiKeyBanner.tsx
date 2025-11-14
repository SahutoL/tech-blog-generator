
import React from 'react';
import { KeyIcon } from './icons/KeyIcon';
import { CogIcon } from './icons/CogIcon';

interface ApiKeyBannerProps {
  onOpenSettings: () => void;
  className?: string;
}

export const ApiKeyBanner: React.FC<ApiKeyBannerProps> = ({ onOpenSettings, className = '' }) => {
  return (
    <div className={`bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-r-lg ${className}`} role="alert">
      <div className="flex items-center">
        <div className="py-1">
          <KeyIcon className="w-6 h-6 mr-4" />
        </div>
        <div className="flex-grow">
          <p className="font-bold">Gemini APIキーが必要です</p>
          <p className="text-sm">記事を生成するには、APIキーを設定してください。</p>
        </div>
        <button
          onClick={onOpenSettings}
          className="ml-4 flex items-center gap-2 px-4 py-2 text-sm font-semibold text-yellow-900 bg-yellow-200 rounded-md hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        >
          <CogIcon className="w-4 h-4" />
          <span>設定を開く</span>
        </button>
      </div>
    </div>
  );
};
