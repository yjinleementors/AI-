
import { GoogleGenAI, Type } from "@google/genai";
import { UserInput, CurationResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const portfolioTipSchema = {
  type: Type.OBJECT,
  description: "이 경험을 자기소개서나 포트폴리오에 활용하는 방법에 대한 구체적인 팁입니다.",
  properties: {
    experience: { type: Type.STRING, description: "활용 예시로 선택된 경험의 이름 (activityName과 동일해야 함)" },
    learned: { type: Type.STRING, description: "해당 경험을 통해 배울 수 있는 점" },
    wording: { type: Type.STRING, description: "배운 점을 역량으로 표현하는 자기소개서 문장 예시" }
  },
  required: ["experience", "learned", "wording"]
};

const experienceItemSchema = {
  type: Type.OBJECT,
  properties: {
    type: { type: Type.STRING, description: "경험 유형 (예: 공모전/경진대회, 인턴십)" },
    activityName: { type: Type.STRING, description: "활동의 구체적인 이름" },
    host: { type: Type.STRING, description: "모집 주관 기관" },
    period: { type: Type.STRING, description: "모집 기간 또는 마감일" },
    field: { type: Type.STRING, description: "관련 활동 분야" },
    link: { type: Type.STRING, description: "관련 정보 링크(URL). 구글 검색 결과 링크를 권장합니다." },
    competency: { type: Type.STRING, description: "이 경험을 통해 기대되는 역량" },
    recommendationReason: { type: Type.STRING, description: "사용자의 아이프잡 유형(eDISC성향)을 반영한 추천 사유 (한 문장으로 간결하게)" },
    portfolioTip: portfolioTipSchema,
  },
  required: ["type", "activityName", "host", "period", "field", "link", "competency", "recommendationReason", "portfolioTip"]
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    customizedExperience: {
      type: Type.ARRAY,
      description: "사용자의 아이프잡 유형(eDISC성향)과 강점에 맞는 맞춤형 경험 추천 리스트입니다. (정확히 2개 추천)",
      items: experienceItemSchema,
    },
    complementaryExperience: {
      type: Type.ARRAY,
      description: "사용자의 약점을 보완할 수 있는 보완형 경험 추천 리스트입니다. (정확히 2개 추천)",
      items: experienceItemSchema,
    },
    expansionExperience: {
      type: Type.ARRAY,
      description: "시야를 넓히고 성장에 도움이 되는 확장형 경험 추천 리스트입니다. (정확히 2개 추천)",
      items: experienceItemSchema,
    },
  },
  required: ["customizedExperience", "complementaryExperience", "expansionExperience"]
};


const createPrompt = (userInput: UserInput): string => {
  return `
    당신은 아이프잡 유형(eDISC성향) 기반의 전문 진로경험 큐레이터입니다.
    사용자 정보를 바탕으로 맞춤형 진로경험을 추천해주세요. 각 카테고리별로 정확히 2개씩 추천합니다.

    **[중요: 외부 링크 생성 규칙]**
    1. **절대 확인되지 않은 상세 페이지 URL을 생성하지 마십시오.** (예: 존재하지 않는 공모전 상세 주소 금지)
    2. 사용자가 경험을 바로 찾아볼 수 있도록 **구글 검색 바로가기 링크 생성**을 강력히 권장합니다.
       - 형식: https://www.google.com/search?q=[활동명+검색어]
       - 예: 활동명이 "제1회 AI 해커톤"이라면 링크는 "https://www.google.com/search?q=제1회+AI+해커톤"이 되어야 합니다.
    3. 만약 매우 유명하고 변하지 않는 공식 홈페이지(예: 링커리어, 자소설닷컴 메인 등)를 알고 있다면 해당 링크를 사용해도 좋으나, 특정 공고의 깨지기 쉬운 상세 URL보다는 구글 검색 링크가 더 안전합니다.

    **[큐레이션 구조 및 추천 사유(recommendationReason) 작성 원칙]**
    1. 맞춤형 경험: 사용자의 아이프잡 유형(eDISC성향)과 강점에 최적화된 활동. (아이프잡 유형(eDISC성향)의 강점이 이 경험에서 어떻게 시너지를 낼 수 있는지 설명)
    2. 보완형 경험: 아이프잡 유형(eDISC성향)의 약점을 보완할 수 있는 도전적인 활동. (사용자의 아이프잡 유형(eDISC성향)상 부족할 수 있는 부분(예: I형의 디테일 부족, S형의 결단력 부족 등)을 이 경험이 어떻게 채워주는지 설명)
    3. 확장형 경험: 전공 외 시야를 넓혀주는 트렌디한 활동. (사용자의 기존 아이프잡 유형(eDISC성향)을 넘어 새로운 가능성을 발견할 수 있는 이유를 설명)

    **[추천 사유 작성 톤앤매너]**
    - "추천 포인트: [내용]" 형식으로 작성하지 마세요. (UI에서 처리함) 사유 내용만 작성하세요.
    - 사용자가 즉각 납득할 수 있도록 논리적이고 친절하게 작성할 것.
    - 문장은 한 문장 혹은 두 문장 이내로 매우 간결하게 유지할 것.

    결과는 반드시 지정된 JSON 형식으로만 출력해야 합니다.

    **[사용자 정보]**
    - 소속/학년: ${userInput.ageGroup}
    - 아이프잡 유형(eDISC성향): ${userInput.edisc}
    - 전공/부전공: ${userInput.major || '정보 없음'}
    - 관심분야: ${userInput.interestField || '정보 없음'}
    - 취미: ${userInput.hobbies || '정보 없음'}
    - 자격증: ${userInput.certifications || '정보 없음'}
    - 대외활동 및 경험: ${userInput.activities || '정보 없음'}
    - 외국어 역량: ${userInput.languages || '정보 없음'}
    - 경험을 찾는 이유(목적): ${userInput.purpose || '정보 없음'}
  `;
};

export const getCareerRecommendations = async (userInput: UserInput): Promise<CurationResult> => {
  const prompt = createPrompt(userInput);
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const resultJson = JSON.parse(response.text);
    return resultJson as CurationResult;

  } catch (error) {
    console.error("Error calling Gemini API or parsing JSON:", error);
    throw new Error("Failed to get career recommendations from AI.");
  }
};
