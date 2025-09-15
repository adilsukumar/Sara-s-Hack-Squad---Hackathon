import { 
  type PrivacyAudit, 
  type InsertPrivacyAudit,
  type HarassmentAnalysis,
  type InsertHarassmentAnalysis,
  type SecurityChecklist,
  type InsertSecurityChecklist,
  type EmergencyContact,
  type InsertEmergencyContact,
  type SafeMessage,
  type InsertSafeMessage
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Privacy Audits
  createPrivacyAudit(audit: InsertPrivacyAudit): Promise<PrivacyAudit>;
  getPrivacyAuditsBySession(sessionId: string): Promise<PrivacyAudit[]>;
  
  // Harassment Analysis
  createHarassmentAnalysis(analysis: InsertHarassmentAnalysis): Promise<HarassmentAnalysis>;
  getHarassmentAnalysesBySession(sessionId: string): Promise<HarassmentAnalysis[]>;
  
  // Security Checklists
  createOrUpdateSecurityChecklist(checklist: InsertSecurityChecklist): Promise<SecurityChecklist>;
  getSecurityChecklistBySession(sessionId: string, platform: string): Promise<SecurityChecklist | undefined>;
  
  // Emergency Contacts
  createEmergencyContact(contact: InsertEmergencyContact): Promise<EmergencyContact>;
  getEmergencyContactsBySession(sessionId: string): Promise<EmergencyContact[]>;
  updateEmergencyContact(id: string, updates: Partial<InsertEmergencyContact>): Promise<EmergencyContact | undefined>;
  deleteEmergencyContact(id: string): Promise<boolean>;
  
  // Safe Messages
  createSafeMessage(message: InsertSafeMessage): Promise<SafeMessage>;
  getSafeMessagesByRoom(roomId: string): Promise<SafeMessage[]>;
  cleanupExpiredMessages(): Promise<void>;
}

export class MemStorage implements IStorage {
  private privacyAudits: Map<string, PrivacyAudit>;
  private harassmentAnalyses: Map<string, HarassmentAnalysis>;
  private securityChecklists: Map<string, SecurityChecklist>;
  private emergencyContacts: Map<string, EmergencyContact>;
  private safeMessages: Map<string, SafeMessage>;

  constructor() {
    this.privacyAudits = new Map();
    this.harassmentAnalyses = new Map();
    this.securityChecklists = new Map();
    this.emergencyContacts = new Map();
    this.safeMessages = new Map();
    
    // Cleanup expired messages every 5 minutes
    setInterval(() => this.cleanupExpiredMessages(), 5 * 60 * 1000);
  }

  async createPrivacyAudit(insertAudit: InsertPrivacyAudit): Promise<PrivacyAudit> {
    const id = randomUUID();
    const audit: PrivacyAudit = { 
      ...insertAudit, 
      id, 
      createdAt: new Date() 
    };
    this.privacyAudits.set(id, audit);
    return audit;
  }

  async getPrivacyAuditsBySession(sessionId: string): Promise<PrivacyAudit[]> {
    return Array.from(this.privacyAudits.values()).filter(
      audit => audit.sessionId === sessionId
    );
  }

  async createHarassmentAnalysis(insertAnalysis: InsertHarassmentAnalysis): Promise<HarassmentAnalysis> {
    const id = randomUUID();
    const analysis: HarassmentAnalysis = { 
      ...insertAnalysis, 
      id, 
      createdAt: new Date() 
    };
    this.harassmentAnalyses.set(id, analysis);
    return analysis;
  }

  async getHarassmentAnalysesBySession(sessionId: string): Promise<HarassmentAnalysis[]> {
    return Array.from(this.harassmentAnalyses.values()).filter(
      analysis => analysis.sessionId === sessionId
    );
  }

  async createOrUpdateSecurityChecklist(insertChecklist: InsertSecurityChecklist): Promise<SecurityChecklist> {
    // Check if checklist already exists for this session and platform
    const existing = Array.from(this.securityChecklists.values()).find(
      checklist => checklist.sessionId === insertChecklist.sessionId && 
                   checklist.platform === insertChecklist.platform
    );

    if (existing) {
      const updated: SecurityChecklist = {
        ...existing,
        ...insertChecklist,
        lastUpdated: new Date()
      };
      this.securityChecklists.set(existing.id, updated);
      return updated;
    } else {
      const id = randomUUID();
      const checklist: SecurityChecklist = { 
        ...insertChecklist, 
        id, 
        lastUpdated: new Date() 
      };
      this.securityChecklists.set(id, checklist);
      return checklist;
    }
  }

  async getSecurityChecklistBySession(sessionId: string, platform: string): Promise<SecurityChecklist | undefined> {
    return Array.from(this.securityChecklists.values()).find(
      checklist => checklist.sessionId === sessionId && checklist.platform === platform
    );
  }

  async createEmergencyContact(insertContact: InsertEmergencyContact): Promise<EmergencyContact> {
    const id = randomUUID();
    const contact: EmergencyContact = { 
      ...insertContact, 
      id, 
      createdAt: new Date() 
    };
    this.emergencyContacts.set(id, contact);
    return contact;
  }

  async getEmergencyContactsBySession(sessionId: string): Promise<EmergencyContact[]> {
    return Array.from(this.emergencyContacts.values()).filter(
      contact => contact.sessionId === sessionId && contact.isActive
    );
  }

  async updateEmergencyContact(id: string, updates: Partial<InsertEmergencyContact>): Promise<EmergencyContact | undefined> {
    const contact = this.emergencyContacts.get(id);
    if (!contact) return undefined;

    const updated: EmergencyContact = { ...contact, ...updates };
    this.emergencyContacts.set(id, updated);
    return updated;
  }

  async deleteEmergencyContact(id: string): Promise<boolean> {
    const contact = this.emergencyContacts.get(id);
    if (!contact) return false;

    const updated: EmergencyContact = { ...contact, isActive: false };
    this.emergencyContacts.set(id, updated);
    return true;
  }

  async createSafeMessage(insertMessage: InsertSafeMessage): Promise<SafeMessage> {
    const id = randomUUID();
    const message: SafeMessage = { 
      ...insertMessage, 
      id, 
      createdAt: new Date() 
    };
    this.safeMessages.set(id, message);
    return message;
  }

  async getSafeMessagesByRoom(roomId: string): Promise<SafeMessage[]> {
    const now = new Date();
    return Array.from(this.safeMessages.values()).filter(
      message => message.roomId === roomId && message.expiresAt > now
    ).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async cleanupExpiredMessages(): Promise<void> {
    const now = new Date();
    for (const [id, message] of this.safeMessages.entries()) {
      if (message.expiresAt <= now) {
        this.safeMessages.delete(id);
      }
    }
  }
}

export const storage = new MemStorage();
