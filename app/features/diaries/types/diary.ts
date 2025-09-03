export interface EmotionTag {
  id: number;
  name: string;
  color: string | null;
  category: "positive" | "negative" | "neutral" | null;
  isDefault: boolean | null;
  usageCount?: number | null;
}

export interface DiaryEntry {
  id: number;
  profileId: string;
  date: string;
  shortContent: string | null;
  situation: string | null;
  reaction: string | null;
  physicalSensation: string | null;
  desiredReaction: string | null;
  gratitudeMoment: string | null;
  selfKindWords: string | null;
  imageUrl: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  emotionTags: EmotionTag[];
  completedSteps: number;
  totalSteps: number;
}