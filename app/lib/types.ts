// Shared TypeScript types and interfaces
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

export interface DiaryEntry {
  id: string;
  userId: string;
  date: Date;
  mainEmotions: string[];
  situation: string;
  reaction: string;
  physicalSensation?: string;
  desiredReaction?: string;
  gratitudeMoment?: string;
  selfKindWords?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface EmotionTag {
  id: string;
  name: string;
  color: string;
  icon?: string;
  category: 'positive' | 'negative' | 'neutral';
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}