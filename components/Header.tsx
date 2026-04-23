
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-8 md:py-12 text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 text-transparent bg-clip-text">
        AI 진로 경험 큐레이터
      </h1>
      <div className="mt-4">
        <span className="inline-block bg-emerald-100 text-emerald-700 text-sm font-semibold px-4 py-1.5 rounded-full">
          대학생/대학원생 용
        </span>
      </div>
      <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
        어떤 경험을 쌓아야할지 모르겠다면?<br />
        아이프잡 유형에 딱 맞는 진로경험 추천받기!
      </p>
    </header>
  );
};

export default Header;