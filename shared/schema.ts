import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Privacy Audit Results
export const privacyAudits = pgTable("privacy_audits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull(),
  platform: text("platform").notNull(), // facebook, instagram, twitter, etc.
  findings: jsonb("findings").notNull(), // array of privacy issues found
  riskLevel: text("risk_level").notNull(), // low, medium, high
  recommendations: jsonb("recommendations").notNull(), // array of fix suggestions
  createdAt: timestamp("created_at").defaultNow(),
});

// Harassment Detection Analysis
export const harassmentAnalyses = pgTable("harassment_analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull(),
  content: text("content").notNull(), // encrypted content to analyze
  threatLevel: text("threat_level").notNull(), // none, low, medium, high, critical
  categories: jsonb("categories").notNull(), // types of harassment detected
  confidence: text("confidence").notNull(), // AI confidence score
  recommendations: jsonb("recommendations").notNull(),
  evidenceGenerated: boolean("evidence_generated").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Security Checklist Progress
export const securityChecklists = pgTable("security_checklists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull(),
  platform: text("platform").notNull(),
  completedItems: jsonb("completed_items").notNull(), // array of completed checklist items
  totalItems: text("total_items").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Emergency Contacts (encrypted)
export const emergencyContacts = pgTable("emergency_contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull(),
  encryptedData: text("encrypted_data").notNull(), // encrypted contact information
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Safe Messages (encrypted, temporary)
export const safeMessages = pgTable("safe_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  roomId: text("room_id").notNull(),
  encryptedContent: text("encrypted_content").notNull(),
  senderKey: text("sender_key").notNull(), // hashed sender identifier
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schemas for API validation
export const insertPrivacyAuditSchema = createInsertSchema(privacyAudits).omit({
  id: true,
  createdAt: true,
});

export const insertHarassmentAnalysisSchema = createInsertSchema(harassmentAnalyses).omit({
  id: true,
  createdAt: true,
});

export const insertSecurityChecklistSchema = createInsertSchema(securityChecklists).omit({
  id: true,
  lastUpdated: true,
});

export const insertEmergencyContactSchema = createInsertSchema(emergencyContacts).omit({
  id: true,
  createdAt: true,
});

export const insertSafeMessageSchema = createInsertSchema(safeMessages).omit({
  id: true,
  createdAt: true,
});

// Types
export type PrivacyAudit = typeof privacyAudits.$inferSelect;
export type InsertPrivacyAudit = z.infer<typeof insertPrivacyAuditSchema>;

export type HarassmentAnalysis = typeof harassmentAnalyses.$inferSelect;
export type InsertHarassmentAnalysis = z.infer<typeof insertHarassmentAnalysisSchema>;

export type SecurityChecklist = typeof securityChecklists.$inferSelect;
export type InsertSecurityChecklist = z.infer<typeof insertSecurityChecklistSchema>;

export type EmergencyContact = typeof emergencyContacts.$inferSelect;
export type InsertEmergencyContact = z.infer<typeof insertEmergencyContactSchema>;

export type SafeMessage = typeof safeMessages.$inferSelect;
export type InsertSafeMessage = z.infer<typeof insertSafeMessageSchema>;

// API request/response schemas
export const privacyAuditRequestSchema = z.object({
  platform: z.string().min(1),
  profileUrl: z.string().url().optional(),
  profileData: z.record(z.any()).optional(),
});

export const harassmentAnalysisRequestSchema = z.object({
  content: z.string().min(1),
  context: z.string().optional(),
});

export const emergencyAlertRequestSchema = z.object({
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }).optional(),
  message: z.string().optional(),
  contactIds: z.array(z.string()).optional(),
});

export type PrivacyAuditRequest = z.infer<typeof privacyAuditRequestSchema>;
export type HarassmentAnalysisRequest = z.infer<typeof harassmentAnalysisRequestSchema>;
export type EmergencyAlertRequest = z.infer<typeof emergencyAlertRequestSchema>;
