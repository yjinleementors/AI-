import { GoogleGenAI, Type } from "@google/genai";
import { UserInput, CurationResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

// Define a reusable schema for a single experience item to avoid repetition and ensure consistency.
const experienceItemSchema = {
  type: Type.OBJECT,
  properties: {
    experienceType: { type: Type.STRING, description: "경험의 유형 (예: 프로젝트, 인턴, 대외활동)" },
    activityExample: { type: Type.STRING, description: "구체적인 활동 예시" },
    expectedCompetencies: { type: Type.STRING, description: "해당 경험을 통해 얻을 수 있는 기대 역량" },
    applicationLink: { type: Type.STRING, description: "관련 경험을 찾을 수 있는 실제 웹사이트 링크. 링커리어, 캠퍼스픽, 링크드인, 올콘, 원티드 등에서 관련 활동 목록이나 검색 결과 페이지로 연결되는 유효한 URL이어야 합니다." },
    portfolioHelper: {
      type: Type.OBJECT,
      properties: {
        experience: { type: Type.STRING, description: "경험 요약" },
        learnings: { type: Type.STRING, description: "경험을 통해 배운 점" },
        verbalization: { type: Type.STRING, description: "자기소개서에 활용할 수 있는 문장 예시" }
      },
      required: ["experience", "learnings", "verbalization"]
    }
  },
  required: ["experienceType", "activityExample", "expectedCompetencies", "applicationLink", "portfolioHelper"]
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    customizedExperience: {
      type: Type.ARRAY,
      description: "사용자의 성향과 강점에 가장 잘 맞는 맞춤형 경험 추천.",
      items: experienceItemSchema
    },
    complementaryExperience: {
      type: Type.ARRAY,
      description: "사용자의 약점을 보완하고 시야를 넓혀줄 보완형 경험 추천.",
      items: experienceItemSchema
    },
    expansionExperience: {
      type: Type.ARRAY,
      description: "누구에게나 성장에 도움이 되는 확장형 경험 추천.",
      items: experienceItemSchema
    }
  },
  required: ["customizedExperience", "complementaryExperience", "expansionExperience"]
};


const createPrompt = (userInput: UserInput): string => {
  return `
    당신은 대학생 및 대학원생을 위한 EDISC 성향 기반의 전문 진로 경험 큐레이터입니다.
    사용자의 정보를 종합적으로 분석하여, '맞춤형 경험', '보완형 경험', '확장형 경험' 세 가지 카테고리로 나누어 진로 경험을 추천해주세요.
    각 경험은 [경험 유형 → 구체적 활동 예시 → 기대되는 역량] 형식으로 제안하고, 각 경험과 관련된 실제 모집 공고를 찾을 수 있는 웹사이트 링크를 반드시 포함해주세요. 다음 사이트들을 최우선으로 참고하여 유효한 링크를 제공해야 합니다: 링커리어(https://linkareer.com), 캠퍼스픽(https://www.campuspick.com), 링크드인(https://www.linkedin.com), 올콘(https://www.all-con.co.kr), 원티드(https://www.wanted.co.kr). 단순 홈페이지 주소가 아닌, 관련 활동 목록이나 검색 결과 페이지의 직접적인 링크를 제공해주세요.
    또한, 각 경험을 자기소개서나 포트폴리오에 효과적으로 녹여낼 수 있도록 '경험 → 배운 점 → 역량 언어화(자기소개서 문장 예시)' 변환 팁도 포함해주세요.
    추천은 사용자의 전공, 관심사, 현재 상황을 모두 고려하여 매우 구체적이고 실용적이어야 합니다. 획일적이거나 추상적인 추천은 피해주세요.

    [사용자 정보]
    - EDISC 성향: ${userInput.edisc}
    - 학년: ${userInput.ageGroup}
    - 전공/부전공: ${userInput.major || '정보 없음'}
    - 관심분야: ${userInput.interestField || '정보 없음'}
    - 취미: ${userInput.hobbies || '정보 없음'}
    - 자격증: ${userInput.certifications || '정보 없음'}
    - 대외활동 및 경험: ${userInput.activities || '정보 없음'}
    - 외국어 역량: ${userInput.languages || '정보 없음'}
    - 경험을 찾는 이유(목적): ${userInput.purpose || '정보 없음'}

    위 정보를 바탕으로, 반드시 아래에 정의된 JSON 스키마에 맞춰 결과를 생성해주세요.
  `;
};

export const getCareerRecommendations = async (userInput: UserInput): Promise<CurationResult> => {
  const prompt = createPrompt(userInput);
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.7,
      }
    });

    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText) as CurationResult;
    return parsedData;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get career recommendations from AI.");
  }
};
