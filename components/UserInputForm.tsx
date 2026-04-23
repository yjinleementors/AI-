
import React, { useState } from 'react';
import { UserInput } from '../types';
import { EDISC_TYPES, AGE_GROUPS } from '../constants';
import { SparklesIcon } from './icons/SparklesIcon';

interface UserInputFormProps {
  onSubmit: (data: UserInput) => void;
  isLoading: boolean;
}

const UserInputForm: React.FC<UserInputFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<UserInput>({
    edisc: 'D',
    major: '',
    interestField: '',
    hobbies: '',
    certifications: '',
    activities: '',
    languages: '',
    purpose: '',
    ageGroup: '대학교 1학년',
  });

  const [showEdiscInfo, setShowEdiscInfo] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  const inputStyle = "w-full bg-white border border-emerald-100 rounded-lg p-3 text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition duration-200";
  const labelStyle = "block text-sm font-medium text-slate-700 mb-2";

  const ediscDescriptions = [
    { type: 'D유형(주도형)', desc: '외향적 / 일-과제 적극적, 목표중심적, 의사결정 및 업무처리 빠름' },
    { type: 'I유형(사교형)', desc: '외향적 / 사람에게 적극적, 에너지 넘침, 정열적이며 표현력 풍부' },
    { type: 'S유형(안정형)', desc: '내향적 / 사람에게 신중함, 이타적, 인내심 있음, 겸손하고 지원적' },
    { type: 'C유형(신중형)', desc: '내향적 / 일-과제에 신중함, 완벽주의, 정확하고 사실/분석 중심적' },
  ];

  return (
    <div className="max-w-4xl mx-auto bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 border border-emerald-100">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <label htmlFor="edisc" className="text-sm font-medium text-slate-700">아이프잡 유형(eDISC성향)</label>
            <button 
              type="button"
              className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold hover:bg-emerald-200 transition-colors"
              onMouseEnter={() => setShowEdiscInfo(true)}
              onMouseLeave={() => setShowEdiscInfo(false)}
              onClick={() => setShowEdiscInfo(!showEdiscInfo)}
            >
              ?
            </button>
          </div>
          <select id="edisc" name="edisc" value={formData.edisc} onChange={handleChange} className={inputStyle}>
            {EDISC_TYPES.map(type => <option key={type} value={type}>{type}형</option>)}
          </select>

          {showEdiscInfo && (
            <div className="absolute z-10 left-0 mt-2 w-full md:w-auto min-w-[300px] bg-white border border-emerald-100 rounded-xl shadow-xl p-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="space-y-3">
                {ediscDescriptions.map((item, idx) => (
                  <div key={idx} className="text-xs">
                    <span className="font-bold text-emerald-700 block mb-1">{item.type}</span>
                    <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="major" className={labelStyle}>전공 / 부전공</label>
            <input type="text" id="major" name="major" value={formData.major} onChange={handleChange} className={inputStyle} placeholder="예: 컴퓨터공학, 심리학" />
          </div>
          <div>
            <label htmlFor="ageGroup" className={labelStyle}>소속 / 학년</label>
            <select id="ageGroup" name="ageGroup" value={formData.ageGroup} onChange={handleChange} className={inputStyle}>
              {AGE_GROUPS.map(group => <option key={group} value={group}>{group}</option>)}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="interestField" className={labelStyle}>관심분야</label>
            <input type="text" id="interestField" name="interestField" value={formData.interestField} onChange={handleChange} className={inputStyle} placeholder="예: IT, 금융, 미디어, 제약바이오, 화장품" />
          </div>
          <div>
            <label htmlFor="hobbies" className={labelStyle}>취미</label>
            <input type="text" id="hobbies" name="hobbies" value={formData.hobbies} onChange={handleChange} className={inputStyle} placeholder="예: 코딩, 글쓰기, 영상 편집" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="certifications" className={labelStyle}>자격증</label>
            <input type="text" id="certifications" name="certifications" value={formData.certifications} onChange={handleChange} className={inputStyle} placeholder="예: 정보처리기사, TOEIC 900" />
          </div>
          <div>
            <label htmlFor="languages" className={labelStyle}>외국어 역량</label>
            <input type="text" id="languages" name="languages" value={formData.languages} onChange={handleChange} className={inputStyle} placeholder="예: 영어(비즈니스 회화), 일본어(일상 회화)" />
          </div>
        </div>

        <div>
          <label htmlFor="activities" className={labelStyle}>대외활동 및 경험</label>
          <textarea id="activities" name="activities" value={formData.activities} onChange={handleChange} className={inputStyle} rows={3} placeholder="예: OO 앱개발 동아리, XX 해커톤 수상"></textarea>
        </div>
        
        <div>
          <label htmlFor="purpose" className={labelStyle}>경험을 찾는 이유 (목적)</label>
          <textarea id="purpose" name="purpose" value={formData.purpose} onChange={handleChange} className={inputStyle} rows={2} placeholder="예: 취업 포트폴리오 강화, 진로 탐색"></textarea>
        </div>

        <div className="pt-4">
          <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105">
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                큐레이션 중...
              </>
            ) : (
              <>
                <SparklesIcon />
                나만의 경험 큐레이션 받기
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserInputForm;