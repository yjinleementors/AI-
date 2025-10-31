
import React from 'react';
import { CurationResult, Experience } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface ResultsDisplayProps {
  recommendations: CurationResult | null;
  isLoading: boolean;
  error: string | null;
}

const ExperienceCard: React.FC<{ experience: Experience }> = ({ experience }) => {
  return (
    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 transition-all duration-300 hover:border-purple-500 hover:shadow-2xl hover:shadow-purple-500/10">
      <h4 className="font-bold text-lg text-purple-400">{experience.experienceType}</h4>
      <p className="mt-2 text-slate-300"><span className="font-semibold text-slate-100">활동 예시:</span> {experience.activityExample}</p>
      <p className="mt-2 text-slate-300"><span className="font-semibold text-slate-100">기대 역량:</span> {experience.expectedCompetencies}</p>
      {experience.applicationLink && (
        <a href={experience.applicationLink} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm text-pink-400 hover:text-pink-300 transition-colors">
          관련 경험 찾아보기 &rarr;
        </a>
      )}
      
      <details className="mt-4 group">
        <summary className="cursor-pointer text-sm font-medium text-slate-400 group-hover:text-slate-200 transition-colors">
          포트폴리오 활용 Tip
        </summary>
        <div className="mt-3 pt-3 border-t border-slate-700 text-sm space-y-2 text-slate-300">
          <p><strong className="text-slate-100">💡 배운 점:</strong> {experience.portfolioHelper.learnings}</p>
          <p className="font-mono bg-slate-900/50 p-3 rounded-md"><strong className="text-slate-100">✍️ 자기소개서 예시:</strong> "{experience.portfolioHelper.verbalization}"</p>
        </div>
      </details>
    </div>
  );
};

const ResultsSection: React.FC<{ title: string; description: string; experiences: Experience[] }> = ({ title, description, experiences }) => {
  if (experiences.length === 0) return null;
  return (
    <div className="bg-slate-900/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-slate-700 shadow-xl">
      <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text mb-2">{title}</h3>
      <p className="text-slate-400 mb-6">{description}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {experiences.map((exp, index) => <ExperienceCard key={index} experience={exp} />)}
      </div>
    </div>
  );
};


const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ recommendations, isLoading, error }) => {
  if (isLoading) {
    return <div className="mt-12"><LoadingSpinner /></div>;
  }
  if (error) {
    return <div className="mt-12 text-center text-red-400 bg-red-900/20 p-4 rounded-lg">{error}</div>;
  }
  if (!recommendations) {
    return <div className="mt-12 text-center text-slate-400">폼을 작성하고 '큐레이션 받기' 버튼을 눌러주세요.</div>;
  }

  return (
    <div className="mt-12 space-y-10">
      <ResultsSection 
        title="🎯 맞춤형 경험" 
        description="나의 강점을 극대화하고, 성향과 잘 맞는 활동을 통해 전문성을 키워보세요."
        experiences={recommendations.customizedExperience} 
      />
      <ResultsSection 
        title="⚖️ 보완형 경험" 
        description="나의 약점을 보완하고, 균형 잡힌 성장을 위한 새로운 도전에 나서보세요."
        experiences={recommendations.complementaryExperience} 
      />
      <ResultsSection 
        title="🚀 확장형 경험" 
        description="시야를 넓히고, 미래 사회에 필요한 핵심 역량을 기를 수 있는 활동입니다."
        experiences={recommendations.expansionExperience} 
      />
    </div>
  );
};

export default ResultsDisplay;
