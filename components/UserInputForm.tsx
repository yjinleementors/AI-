
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
    ageGroup: '1학년',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  const inputStyle = "w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition duration-200";
  const labelStyle = "block text-sm font-medium text-slate-300 mb-2";

  return (
    <div className="max-w-4xl mx-auto bg-slate-800/30 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 border border-slate-700">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="edisc" className={labelStyle}>EDISC 성향</label>
            <select id="edisc" name="edisc" value={formData.edisc} onChange={handleChange} className={inputStyle}>
              {EDISC_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="ageGroup" className={labelStyle}>학년</label>
            <select id="ageGroup" name="ageGroup" value={formData.ageGroup} onChange={handleChange} className={inputStyle}>
              {AGE_GROUPS.map(group => <option key={group} value={group}>{group}</option>)}
            </select>
          </div>
        </div>
        
        <div>
          <label htmlFor="major" className={labelStyle}>전공 / 부전공</label>
          <input type="text" id="major" name="major" value={formData.major} onChange={handleChange} className={inputStyle} placeholder="예: 컴퓨터공학, 심리학" />
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
          <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105">
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