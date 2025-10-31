
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-8 md:py-12 text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
        AI 진로 경험 큐레이터
      </h1>
      <div className="mt-4">
        <span className="inline-block bg-sky-500/20 text-sky-300 text-sm font-semibold px-4 py-1.5 rounded-full">
          대학생·대학원생용
        </span>
      </div>
      <p className="mt-3 text-lg text-slate-300 max-w-2xl mx-auto">
        당신의 EDISC 성향과 잠재력에 꼭 맞는 커리어 여정을 디자인해 보세요.
      </p>
    </header>
  );
};

export default Header;
