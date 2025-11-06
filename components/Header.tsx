
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-8 py-4">
        <h1 className="text-xl font-bold text-slate-900">
          AI Tech Blog Generator
        </h1>
      </div>
    </header>
  );
};
