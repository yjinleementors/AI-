
export interface UserInput {
  edisc: string;
  major: string;
  interestField: string;
  hobbies: string;
  certifications: string;
  activities: string;
  languages: string;
  purpose: string;
  ageGroup: string;
}

export interface PortfolioHelper {
  experience: string;
  learnings: string;
  verbalization: string;
}

export interface Experience {
  experienceType: string;
  activityExample: string;
  expectedCompetencies: string;
  applicationLink: string;
  portfolioHelper: PortfolioHelper;
}

export interface CurationResult {
  customizedExperience: Experience[];
  complementaryExperience: Experience[];
  expansionExperience: Experience[];
}