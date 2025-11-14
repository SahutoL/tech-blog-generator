
import React from 'react';
import { CogIcon } from './icons/CogIcon';
import { LogoIcon } from './icons/LogoIcon';

interface HeaderProps {
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <LogoIcon className="w-8 h-8" />
          <span className="text-xl font-bold text-slate-900 hidden sm:inline">
            AI Tech Blog Generator
          </span>
        </div>
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-full text-slate-600 hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          aria-label="設定を開く"
        >
          <CogIcon className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};
