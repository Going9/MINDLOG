import {
  pgTable,
  bigint,
  uuid,
  text,
  timestamp,
  boolean,
  date,
  unique,
} from "drizzle-orm/pg-core";
import { profiles } from "../users/schema";
import { emotionTags } from "../emotions/schema";

export const diaries = pgTable(
  "diaries",
  {
    id: bigint("id", { mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
    profileId: uuid("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    shortContent: text("short_content"),
    situation: text("situation"),
    reaction: text("reaction"),
    physicalSensation: text("physical_sensation"),
    desiredReaction: text("desired_reaction"),
    gratitudeMoment: text("gratitude_moment"),
    selfKindWords: text("self_kind_words"),
    imageUrl: text("image_url"),
    isDeleted: boolean("is_deleted").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  table => ({
    uniqueProfileDate: unique().on(table.profileId, table.date), // 사용자는 하루에 하나의 일기만 작성 가능
  })
);

export const diaryTags = pgTable(
  "diary_tags",
  {
    id: bigint("id", { mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
    diaryId: bigint("diary_id", { mode: "number" })
      .notNull()
      .references(() => diaries.id, { onDelete: "cascade" }),
    emotionTagId: bigint("emotion_tag_id", { mode: "number" })
      .notNull()
      .references(() => emotionTags.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  table => ({
    uniqueDiaryTag: unique().on(table.diaryId, table.emotionTagId), // 하나의 일기에 중복된 감정 태그는 불가하다
  })
);
