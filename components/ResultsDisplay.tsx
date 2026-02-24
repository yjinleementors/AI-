import React from 'react';
import { CurationResult, Experience } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { ExperienceCard } from './ExperienceCard';

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text mt-10 mb-6">
      {children}
    </h3>
);
  
const ExperienceSection: React.FC<{ title: string; experiences: Experience[] }> = ({ title, experiences }) => {
    if (!experiences || experiences.length === 0) return null;
    return (
      <div className="mb-10">
        <SectionTitle>{title}</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {experiences.map((exp, index) => (
            <ExperienceCard key={index} experience={exp} />
          ))}
        </div>
      </div>
    );
};
  
const ResultsDisplay: React.FC<{
    recommendations: CurationResult | null;
    isLoading: boolean;
    error: string | null;
  }> = ({ recommendations, isLoading, error }) => {
    if (isLoading) {
      return <div className="mt-12"><LoadingSpinner /></div>;
    }
    if (error) {
      return <div className="mt-12 text-center text-red-400 bg-red-900/20 p-4 rounded-lg">{error}</div>;
    }
    if (!recommendations) {
      return (
          <div className="mt-12 text-center text-slate-400 p-8 bg-slate-800/20 rounded-2xl border border-slate-700">
              <h3 className="text-lg font-semibold text-slate-200">AI 진로 경험 큐레이션</h3>
              <p className="mt-2">상단의 양식을 채우고 '나만의 경험 큐레이션 받기' 버튼을 눌러주세요.</p>
              <p>AI가 당신에게 꼭 맞는 진로 경험을 추천해 드립니다.</p>
          </div>
      );
    }
  
    return (
      <div className="mt-12">
          <div className="bg-slate-900/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-slate-700 shadow-xl">
              <ExperienceSection title="맞춤형 경험" experiences={recommendations.customizedExperience} />
              <ExperienceSection title="보완형 경험" experiences={recommendations.complementaryExperience} />
              <ExperienceSection title="확장형 경험" experiences={recommendations.expansionExperience} />
          </div>
      </div>
    );
  };
  
  export default ResultsDisplay;