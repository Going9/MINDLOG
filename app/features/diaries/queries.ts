import db from "~/db";
import { diaries, diaryTags } from "./schema";
import { emotionTags } from "../emotions/schema";
import { eq, and, desc, asc, inArray, like, or, gte, lte } from "drizzle-orm";

type GetDiariesOptions = {
  profileId: string;
  limit?: number;
  offset?: number;
  sortBy?: "date-asc" | "date-desc" | "completion-asc" | "completion-desc";
  searchQuery?: string;
  dateFrom?: Date;
  dateTo?: Date;
  emotionTagId?: number;
};

export const getDiaries = async ({ 
  profileId, 
  limit = 20, 
  offset = 0, 
  sortBy = "date-desc",
  searchQuery,
  dateFrom,
  dateTo,
  emotionTagId
}: GetDiariesOptions) => {
  
  // Build where conditions
  const whereConditions = [
    eq(diaries.profileId, profileId),
    eq(diaries.isDeleted, false)
  ];
  
  // Add search condition
  if (searchQuery) {
    whereConditions.push(
      or(
        like(diaries.shortContent, `%${searchQuery}%`),
        like(diaries.situation, `%${searchQuery}%`),
        like(diaries.reaction, `%${searchQuery}%`)
      )!
    );
  }
  
  // Add date range conditions
  if (dateFrom) {
    whereConditions.push(gte(diaries.date, dateFrom.toISOString().split('T')[0]));
  }
  
  if (dateTo) {
    whereConditions.push(lte(diaries.date, dateTo.toISOString().split('T')[0]));
  }
  // Build the query based on whether emotion filter is needed
  let allDiaries;
  
  if (emotionTagId) {
    // Query with emotion tag filter (join required)
    const emotionWhereConditions = [...whereConditions, eq(diaryTags.emotionTagId, emotionTagId)];
    
    allDiaries = await db
      .select({
        id: diaries.id,
        profileId: diaries.profileId,
        date: diaries.date,
        shortContent: diaries.shortContent,
        situation: diaries.situation,
        reaction: diaries.reaction,
        physicalSensation: diaries.physicalSensation,
        desiredReaction: diaries.desiredReaction,
        gratitudeMoment: diaries.gratitudeMoment,
        selfKindWords: diaries.selfKindWords,
        imageUrl: diaries.imageUrl,
        isDeleted: diaries.isDeleted,
        createdAt: diaries.createdAt,
        updatedAt: diaries.updatedAt,
      })
      .from(diaries)
      .innerJoin(diaryTags, eq(diaryTags.diaryId, diaries.id))
      .where(and(...emotionWhereConditions))
      .orderBy(sortBy === "date-asc" ? asc(diaries.date) : desc(diaries.date))
      .limit(limit)
      .offset(offset);
  } else {
    // Query without emotion tag filter
    allDiaries = await db
      .select({
        id: diaries.id,
        profileId: diaries.profileId,
        date: diaries.date,
        shortContent: diaries.shortContent,
        situation: diaries.situation,
        reaction: diaries.reaction,
        physicalSensation: diaries.physicalSensation,
        desiredReaction: diaries.desiredReaction,
        gratitudeMoment: diaries.gratitudeMoment,
        selfKindWords: diaries.selfKindWords,
        imageUrl: diaries.imageUrl,
        isDeleted: diaries.isDeleted,
        createdAt: diaries.createdAt,
        updatedAt: diaries.updatedAt,
      })
      .from(diaries)
      .where(and(...whereConditions))
      .orderBy(sortBy === "date-asc" ? asc(diaries.date) : desc(diaries.date))
      .limit(limit)
      .offset(offset);
  }
  
  // Get all diary IDs to fetch emotion tags in bulk
  const diaryIds = allDiaries.map(diary => diary.id);
  
  // Fetch all emotion tags for these diaries in one query
  let allTags: Array<{
    diaryId: number;
    id: number;
    name: string;
    color: string | null;
    category: "positive" | "negative" | "neutral" | null;
    isDefault: boolean | null;
  }> = [];
  
  if (diaryIds.length > 0) {
    allTags = await db
      .select({
        diaryId: diaryTags.diaryId,
        id: emotionTags.id,
        name: emotionTags.name,
        color: emotionTags.color,
        category: emotionTags.category,
        isDefault: emotionTags.isDefault,
      })
      .from(emotionTags)
      .innerJoin(diaryTags, eq(diaryTags.emotionTagId, emotionTags.id))
      .where(inArray(diaryTags.diaryId, diaryIds));
  }

  // Group tags by diary ID
  const tagsByDiaryId = allTags.reduce((acc, tag) => {
    if (!acc[tag.diaryId]) {
      acc[tag.diaryId] = [];
    }
    acc[tag.diaryId].push({
      id: tag.id,
      name: tag.name,
      color: tag.color,
      category: tag.category,
      isDefault: tag.isDefault,
    });
    return acc;
  }, {} as Record<number, Array<{
    id: number;
    name: string;
    color: string | null;
    category: "positive" | "negative" | "neutral" | null;
    isDefault: boolean | null;
  }>>);

  // Map diaries with their tags and completion data
  let diariesWithTags = allDiaries.map((diary) => {
    // Calculate completion based on filled fields
    const completionFields = [
      diary.shortContent,
      diary.situation,
      diary.reaction,
      diary.physicalSensation,
      diary.desiredReaction,
      diary.gratitudeMoment,
      diary.selfKindWords,
    ];
    
    const completedSteps = completionFields.filter(field => 
      field !== null && field !== undefined && field !== "" && field.trim() !== ""
    ).length;
    const totalSteps = completionFields.length;

    return {
      ...diary,
      emotionTags: tagsByDiaryId[diary.id] || [],
      completedSteps,
      totalSteps,
    };
  });

  // Apply completion sorting if needed (post-processing)
  if (sortBy === "completion-asc" || sortBy === "completion-desc") {
    diariesWithTags.sort((a, b) => {
      const aCompletion = a.completedSteps / a.totalSteps;
      const bCompletion = b.completedSteps / b.totalSteps;
      return sortBy === "completion-asc" 
        ? aCompletion - bCompletion 
        : bCompletion - aCompletion;
    });
  }

  return diariesWithTags;
};
