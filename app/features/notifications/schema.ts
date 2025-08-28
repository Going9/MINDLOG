import {
  pgTable,
  bigint,
  uuid,
  text,
  boolean,
  timestamp,
  jsonb,
  time,
  unique,
} from "drizzle-orm/pg-core";
import { profiles } from "../users/schema";

export const notificationSettings = pgTable(
  "notification_settings",
  {
    id: bigint("id", { mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
    profileId: uuid("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    isEnabled: boolean("is_enabled").default(true).notNull(),
    reminderTimes: time("reminder_times").array(),
    customMessage: text("custom_message"),
    pushSubscription: jsonb("push_subscription"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  table => ({
    uniqueProfile: unique().on(table.profileId),
  })
);
