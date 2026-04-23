import React from 'react';
import { CurationResult, Experience } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { ExperienceCard } from './ExperienceCard';

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 text-transparent bg-clip-text mt-10 mb-6">
      {children}
    </h3>
);
  
const ExperienceSection: React.FC<{ title: string; description: string; experiences: Experience[] }> = ({ title, description, experiences }) => {
    if (!experiences || experiences.length === 0) return null;
    return (
      <div className="mb-10">
        <SectionTitle>{title}</SectionTitle>
        <p className="text-base font-bold text-emerald-800 -mt-4 mb-8">
          {description}
        </p>
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
      return <div className="mt-12 text-center text-red-600 bg-red-50 p-4 rounded-lg border border-red-100">{error}</div>;
    }
    if (!recommendations) {
      return (
          <div className="mt-12 text-center text-slate-500 p-8 bg-white/50 rounded-2xl border border-emerald-100">
              <h3 className="text-lg font-semibold text-emerald-800">AI 진로경험 큐레이션</h3>
              <p className="mt-2">상단의 양식을 채우고 '나만의 경험 큐레이션 받기' 버튼을 눌러주세요.</p>
              <p>AI가 당신에게 꼭 맞는 진로경험을 추천해 드립니다.</p>
          </div>
      );
    }
  
    return (
      <div className="mt-12">
          <div className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-emerald-100 shadow-xl">
              <ExperienceSection 
                title="🌿 1. 맞춤형 경험" 
                description="나의 아이프잡 유형(eDISC성향)과 배경에 딱 맞는 경험 추천!"
                experiences={recommendations.customizedExperience} 
              />
              <ExperienceSection 
                title="✨ 2. 보완형 경험" 
                description="나에게 부족한 점을 보완해줄 수 있는 경험 추천!"
                experiences={recommendations.complementaryExperience} 
              />
              <ExperienceSection 
                title="🚀 3. 확장형 경험" 
                description="나를 확장할 수 있는 새로운 경험 추천!"
                experiences={recommendations.expansionExperience} 
              />
              
              <hr className="my-8 border-emerald-100" />
              
              <div className="mt-8 text-center p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                <p className="text-lg font-bold text-emerald-800">
                  🎁 [경험 기록을 위한 선물] <a href="https://plucky-wavelength-e80.notion.site/33c7253a228280f1b0cec1f5a3c3817c?pvs=14" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 underline decoration-2 underline-offset-4 transition-colors">경험기록 노션 템플릿 다운받기 (Click!)</a>
                </p>
              </div>
          </div>
      </div>
    );
  };
  
  export default ResultsDisplay;