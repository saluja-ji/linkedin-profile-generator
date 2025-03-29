import { pgTable, text, serial, integer, boolean, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").unique(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const waitlistEntries = pgTable("waitlist_entries", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  linkedinUrl: text("linkedin_url"),
  profession: text("profession"),
  createdAt: text("created_at").notNull(),
});

// LinkedIn profiles
export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  linkedinUrl: text("linkedin_url"),
  originalData: json("original_data").notNull(), // Raw profile data from LinkedIn
  enhancedData: json("enhanced_data"), // AI-enhanced profile data
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// AI enhancement settings
export const enhancementSettings = pgTable("enhancement_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  profileId: integer("profile_id").references(() => profiles.id),
  tone: text("tone").default("professional"),
  focus: text("focus").default("balanced"),
  length: text("length").default("detailed"),
  highlightAchievements: boolean("highlight_achievements").default(true),
  emphasizeSkills: boolean("emphasize_skills").default(true),
  includeMetrics: boolean("include_metrics").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Generated websites
export const websites = pgTable("websites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  profileId: integer("profile_id").references(() => profiles.id),
  templateId: text("template_id").notNull(),
  subdomain: text("subdomain").unique(),
  customDomain: text("custom_domain").unique(),
  settings: json("settings").default({}),
  published: boolean("published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Schema for inserting users
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  name: true,
});

// Schema for inserting waitlist entries
export const insertWaitlistSchema = createInsertSchema(waitlistEntries).pick({
  email: true,
  linkedinUrl: true,
  profession: true,
});

// Schema for waitlist form
export const waitlistFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  linkedinUrl: z.string().url("Please enter a valid LinkedIn URL").optional().or(z.literal("")),
  profession: z.string().min(1, "Please select your profession"),
});

// Schema for profile creation
export const profileSchema = z.object({
  linkedinUrl: z.string().url("Please enter a valid LinkedIn URL"),
  userId: z.number().optional(),
});

// Schema for enhancement settings
export const enhancementSettingsSchema = z.object({
  tone: z.enum(["professional", "conversational", "enthusiastic"]).default("professional"),
  focus: z.enum(["technical", "leadership", "creative", "balanced"]).default("balanced"),
  length: z.enum(["concise", "detailed", "comprehensive"]).default("detailed"),
  highlightAchievements: z.boolean().default(true),
  emphasizeSkills: z.boolean().default(true),
  includeMetrics: z.boolean().default(false),
});

// Schema for website creation
export const websiteSchema = z.object({
  profileId: z.number(),
  templateId: z.string(),
  subdomain: z.string().optional(),
  customDomain: z.string().optional(),
  settings: z.record(z.unknown()).optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertWaitlistEntry = z.infer<typeof insertWaitlistSchema>;
export type WaitlistEntry = typeof waitlistEntries.$inferSelect;
export type WaitlistFormData = z.infer<typeof waitlistFormSchema>;
export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof profileSchema>;
export type EnhancementSettings = typeof enhancementSettings.$inferSelect;
export type InsertEnhancementSettings = z.infer<typeof enhancementSettingsSchema>;
export type Website = typeof websites.$inferSelect;
export type InsertWebsite = z.infer<typeof websiteSchema>;
