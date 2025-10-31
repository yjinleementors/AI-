
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 border-4 border-purple-500 border-solid rounded-full animate-spin border-t-transparent"></div>
        <div className="absolute inset-2 border-4 border-pink-500 border-solid rounded-full animate-spin animation-delay-[-0.2s] border-t-transparent"></div>
      </div>
      <p className="text-slate-300 text-lg font-medium">AI가 맞춤형 경험을 분석 중입니다...</p>
      <p className="text-slate-400 text-sm">잠시만 기다려 주세요.</p>
    </div>
  );
};

export default LoadingSpinner;
