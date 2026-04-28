
import React, { useState, useEffect } from 'react';
import { Experience } from '../types';
import { TagIcon, BuildingIcon, CalendarIcon, AcademicCapIcon, ArrowRightIcon, LightbulbIcon } from './icons';

interface ExperienceCardProps {
  experience: Experience;
  forceShowTips?: boolean;
}

const InfoLine: React.FC<{ icon: string; label: string; value: string; }> = ({ icon, label, value }) => (
  <div className="flex items-start text-sm text-slate-600">
    <div className="flex-shrink-0 w-5 h-5 mr-3 mt-0.5 flex items-center justify-center text-lg">{icon}</div>
    <div className="flex-grow">
      <span className="font-semibold text-slate-700">{label}:</span> {value}
    </div>
  </div>
);

export const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience, forceShowTips = false }) => {
  const [isTipVisible, setIsTipVisible] = useState(false);
  const [linkStatus, setLinkStatus] = useState<'checking' | 'valid' | 'broken'>('checking');

  const showTip = isTipVisible || forceShowTips;

  useEffect(() => {
    let isMounted = true;

    const checkLink = async () => {
      // 1. Basic URL validation
      if (!experience.link || !experience.link.startsWith('http')) {
        setLinkStatus('broken');
        return;
      }

      // If it's a google search link, it's almost certainly valid, skip fetch to avoid overhead
      if (experience.link.includes('google.com/search')) {
        setLinkStatus('valid');
        return;
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

        // Use 'no-cors' to avoid CORS blocks. 
        // This won't detect 404s perfectly but will catch dead domains/network errors.
        await fetch(experience.link, { 
          mode: 'no-cors', 
          cache: 'no-store',
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        if (isMounted) setLinkStatus('valid');
      } catch (error) {
        console.warn(`Link validation failed for ${experience.activityName}:`, error);
        if (isMounted) setLinkStatus('broken');
      }
    };

    checkLink();
    return () => { isMounted = false; };
  }, [experience.link, experience.activityName]);

  return (
    <div className="bg-white border border-emerald-100 rounded-xl p-5 flex flex-col transition-all duration-300 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100/50">
      <div className="flex-grow">
        <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full mb-3">
          {experience.type}
        </span>
        <h4 className="text-lg font-bold text-slate-800 mb-3">{experience.activityName}</h4>
        
        <div className="mb-4 p-3 bg-emerald-50 border-l-4 border-emerald-400 rounded-r-lg">
          <p className="text-sm text-slate-700 leading-relaxed italic">
            <span className="font-bold text-emerald-600">📍 아이프잡 유형(eDISC성향) 기반 추천 사유:</span> {experience.recommendationReason}
          </p>
        </div>

        <div className="space-y-2.5">
          <InfoLine icon="🏢" label="주관" value={experience.host} />
          <InfoLine icon="📅" label="기간" value={experience.period} />
          <InfoLine icon="🎯" label="분야" value={experience.field} />
          <InfoLine icon="✅" label="역량" value={experience.competency} />
        </div>
        
        {showTip && experience.portfolioTip && (
          <div className={`mt-4 p-4 rounded-lg border space-y-3 ${forceShowTips ? 'bg-gray-50 border-gray-200' : 'bg-emerald-50/50 border-emerald-100'}`}>
             <div>
              <p className="text-xs font-semibold text-emerald-600">배운 점</p>
              <p className="text-sm text-slate-600">{experience.portfolioTip.learned}</p>
            </div>
            <hr className="border-emerald-100" />
            <div>
              <p className="text-xs font-semibold text-emerald-600">역량 언어화 (자소서 예시)</p>
              <blockquote className="mt-1 border-l-2 border-emerald-200 pl-3 text-sm italic text-slate-600">
                {experience.portfolioTip.wording}
              </blockquote>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-emerald-50 flex flex-col sm:flex-row gap-2 pdf-hide">
        {experience.portfolioTip && (
          <button
            onClick={() => setIsTipVisible(!isTipVisible)}
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 group"
          >
            <LightbulbIcon className="h-4 w-4" />
            자소서 Tip {isTipVisible ? '숨기기' : '보기'}
          </button>
        )}
        
        {linkStatus === 'checking' ? (
          <div className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 bg-slate-50 text-slate-400 font-semibold py-2 px-4 rounded-lg animate-pulse border border-slate-100">
            링크 확인 중...
          </div>
        ) : linkStatus === 'broken' ? (
          <div className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 bg-red-50 text-red-400 font-bold py-2 px-4 rounded-lg border border-red-100 cursor-help" title="유효하지 않거나 접근할 수 없는 링크입니다.">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            Link Error
          </div>
        ) : (
          <a
            href={experience.link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 group"
          >
            {experience.link.includes('google.com/search') ? '검색 결과 보기' : '더 알아보기'}
            <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </a>
        )}
      </div>
    </div>
  );
};
