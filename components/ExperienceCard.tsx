
import React, { useState, useEffect } from 'react';
import { Experience } from '../types';
import { TagIcon, BuildingIcon, CalendarIcon, AcademicCapIcon, ArrowRightIcon, LightbulbIcon } from './icons';

interface ExperienceCardProps {
  experience: Experience;
}

const InfoLine: React.FC<{ icon: React.ReactNode; label: string; value: string; }> = ({ icon, label, value }) => (
  <div className="flex items-start text-sm text-slate-400">
    <div className="flex-shrink-0 w-5 h-5 mr-3 mt-0.5 text-slate-500">{icon}</div>
    <div className="flex-grow">
      <span className="font-semibold text-slate-300">{label}:</span> {value}
    </div>
  </div>
);

export const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience }) => {
  const [isTipVisible, setIsTipVisible] = useState(false);
  const [linkStatus, setLinkStatus] = useState<'checking' | 'valid' | 'broken'>('checking');

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
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 flex flex-col transition-all duration-300 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-900/20">
      <div className="flex-grow">
        <span className="inline-block bg-purple-500/20 text-purple-300 text-xs font-semibold px-2.5 py-1 rounded-full mb-3">
          {experience.type}
        </span>
        <h4 className="text-lg font-bold text-slate-100 mb-3">{experience.activityName}</h4>
        <div className="space-y-2.5">
          <InfoLine icon={<BuildingIcon />} label="주관" value={experience.host} />
          <InfoLine icon={<CalendarIcon />} label="기간" value={experience.period} />
          <InfoLine icon={<TagIcon />} label="분야" value={experience.field} />
          <InfoLine icon={<AcademicCapIcon />} label="역량" value={experience.competency} />
        </div>
        
        {isTipVisible && experience.portfolioTip && (
          <div className="mt-4 p-4 bg-slate-900/70 rounded-lg border border-slate-600 space-y-3">
             <div>
              <p className="text-xs font-semibold text-purple-300">배운 점</p>
              <p className="text-sm text-slate-300">{experience.portfolioTip.learned}</p>
            </div>
            <hr className="border-slate-700/50" />
            <div>
              <p className="text-xs font-semibold text-pink-300">역량 언어화 (자소서 예시)</p>
              <blockquote className="mt-1 border-l-2 border-slate-600 pl-3 text-sm italic text-slate-300">
                {experience.portfolioTip.wording}
              </blockquote>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-700/50 flex flex-col sm:flex-row gap-2">
        {experience.portfolioTip && (
          <button
            onClick={() => setIsTipVisible(!isTipVisible)}
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 group"
          >
            <LightbulbIcon className="h-4 w-4" />
            자소서 Tip {isTipVisible ? '숨기기' : '보기'}
          </button>
        )}
        
        {linkStatus === 'checking' ? (
          <div className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 bg-slate-800 text-slate-500 font-semibold py-2 px-4 rounded-lg animate-pulse border border-slate-700">
            링크 확인 중...
          </div>
        ) : linkStatus === 'broken' ? (
          <div className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 bg-red-900/30 text-red-400 font-bold py-2 px-4 rounded-lg border border-red-500/50 cursor-help" title="유효하지 않거나 접근할 수 없는 링크입니다.">
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
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 group"
          >
            {experience.link.includes('google.com/search') ? '검색 결과 보기' : '더 알아보기'}
            <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </a>
        )}
      </div>
    </div>
  );
};
