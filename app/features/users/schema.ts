import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  pgSchema,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["admin", "user"]);

// supabase에 존재하지만 ts 및 drizzle 인식용
// migrate 해도 supabse의 auth 스키마에 이미 users 테이블 있어서 migration 안됨
export const users = pgSchema("auth").table("users", {
  id: uuid().primaryKey(),
});

export const profiles = pgTable("profiles", {
  id: uuid("id")
    .primaryKey()
    .references(() => users.id),
  avatar: text("avatar"),
  name: text("name").notNull(),
  userName: text("user_name").notNull().unique(),
  email: text("email").notNull().unique(),
  role: userRoleEnum("role").default("user").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
