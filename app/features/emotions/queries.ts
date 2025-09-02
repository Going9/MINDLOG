import db from "~/db";
import { emotionTags } from "./schema";
import { eq, or, isNull } from "drizzle-orm";

export const getEmotionTags = async (profileId: string) => {
  const tags = await db
    .select({
      id: emotionTags.id,
      name: emotionTags.name,
      color: emotionTags.color,
      category: emotionTags.category,
      isDefault: emotionTags.isDefault,
      usageCount: emotionTags.usageCount,
    })
    .from(emotionTags)
    .where(or(eq(emotionTags.profileId, profileId), eq(emotionTags.isDefault, true)));
  
  return tags;
};

export const getDefaultEmotionTags = async () => {
  const defaultTags = await db
    .select({
      id: emotionTags.id,
      name: emotionTags.name,
      color: emotionTags.color,
      category: emotionTags.category,
      isDefault: emotionTags.isDefault,
      usageCount: emotionTags.usageCount,
    })
    .from(emotionTags)
    .where(eq(emotionTags.isDefault, true));
  
  return defaultTags;
};

export const getUserCustomEmotionTags = async (profileId: string) => {
  const customTags = await db
    .select({
      id: emotionTags.id,
      name: emotionTags.name,
      color: emotionTags.color,
      category: emotionTags.category,
      isDefault: emotionTags.isDefault,
      usageCount: emotionTags.usageCount,
    })
    .from(emotionTags)
    .where(eq(emotionTags.profileId, profileId));
  
  return customTags;
};