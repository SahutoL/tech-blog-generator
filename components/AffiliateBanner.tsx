
import React from 'react';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';

interface AffiliateBannerProps {
  className?: string;
}

export const AffiliateBanner: React.FC<AffiliateBannerProps> = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 border border-slate-200 ${className}`}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500 mb-1">おすすめの開発者プラットフォーム</p>
          <h3 className="text-lg font-bold text-slate-800">
            YouWareで開発ワークフローを強化
          </h3>
          <p className="text-slate-600 mt-2 max-w-2xl">
            コーディング、テスト、デプロイを加速させるためのAIツールやサービスが揃っています。次のプロジェクトを新たなレベルへ。
          </p>
        </div>
        <a
          href="https://www.youware.com/?via=greef"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 mt-2 md:mt-0 px-5 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors flex-shrink-0"
        >
          <span>詳細を見る</span>
          <ExternalLinkIcon className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
