import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  timestamp,
  pgEnum,
  unique,
  bigint,
} from "drizzle-orm/pg-core";
import { profiles } from "../users/schema";

export const emotionCategoryEnum = pgEnum("emotion_category", [
  "positive",
  "negative",
  "neutral",
]);

export const emotionTags = pgTable(
  "emotion_tags",
  {
    id: bigint("id", { mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
    profileId: uuid("profile_id").references(() => profiles.id, {
      onDelete: "cascade",
    }),
    name: text("name").notNull(),
    color: text("color").default("#6B7280"),
    category: emotionCategoryEnum("category").default("neutral"),
    isDefault: boolean("is_default").default(false),
    usageCount: integer("usage_count").default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  table => ({
    uniqueProfileName: unique().on(table.profileId, table.name), // 유저 커스텀 감정 태그는 중복될 수 없다.
  })
);
