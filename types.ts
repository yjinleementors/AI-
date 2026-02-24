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

export interface PortfolioTip {
  experience: string;
  learned: string;
  wording: string;
}

export interface Experience {
  type: string;
  activityName: string;
  host: string;
  period: string;
  field: string;
  link: string;
  competency: string;
  portfolioTip?: PortfolioTip;
}

export interface CurationResult {
  customizedExperience: Experience[];
  complementaryExperience: Experience[];
  expansionExperience: Experience[];
}