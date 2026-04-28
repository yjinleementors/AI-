import React, { useRef, useState } from 'react';
import { CurationResult, Experience } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { ExperienceCard } from './ExperienceCard';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

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
    const resultsRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownloadPDF = async () => {
      if (!resultsRef.current) return;
      
      setIsDownloading(true);
      try {
        const element = resultsRef.current;
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          windowWidth: element.scrollWidth,
          windowHeight: element.scrollHeight
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [canvas.width, canvas.height]
        });
        
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save('AI_진로경험_큐레이션_결과.pdf');
      } catch (err) {
        console.error('PDF 생성 오류:', err);
        alert('PDF를 준비하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } finally {
        setIsDownloading(false);
      }
    };

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
          <div ref={resultsRef} className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-emerald-100 shadow-xl">
              <div className="mb-4 text-center">
                <h2 className="text-2xl font-bold text-emerald-900 mb-2">✨ AI 진로경험 큐레이션 결과 ✨</h2>
                <div className="h-1 w-24 bg-gradient-to-r from-emerald-400 to-teal-400 mx-auto rounded-full"></div>
              </div>
              
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

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-emerald-600 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 hover:bg-emerald-700 disabled:opacity-50 shadow-lg shadow-emerald-200"
            >
              {isDownloading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  PDF 준비 중...
                </>
              ) : (
                <>
                  <span className="mr-2">📥</span>
                  PDF 결과물 다운로드 받기
                </>
              )}
            </button>
          </div>
      </div>
    );
  };
  
  export default ResultsDisplay;