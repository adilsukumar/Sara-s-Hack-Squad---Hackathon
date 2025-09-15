import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  privacyAuditRequestSchema, 
  harassmentAnalysisRequestSchema,
  emergencyAlertRequestSchema,
  insertHarassmentAnalysisSchema,
  insertPrivacyAuditSchema,
  insertSecurityChecklistSchema,
  insertEmergencyContactSchema,
  insertSafeMessageSchema
} from "@shared/schema";
import { analyzeHarassment, analyzePrivacyRisks, generateDigitalFootprintReport, scrapeProfileData } from "./services/openai";
import { encryptData, decryptData, generateSessionId, generateSecureToken, hashString } from "./services/crypto";
import rateLimit from "express-rate-limit";

// Rate limiting for security
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // stricter limit for sensitive operations
  message: 'Rate limit exceeded for sensitive operations.',
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.use('/api', limiter);

  // Auto-generate session middleware for all API routes except /session
  app.use('/api', (req, res, next) => {
    if (req.path !== '/session' && !req.headers['x-session-id']) {
      req.headers['x-session-id'] = generateSessionId();
    }
    next();
  });

  // Generate session ID for anonymous tracking
  app.post('/api/session', (req, res) => {
    const sessionId = generateSessionId();
    res.json({ sessionId });
  });

  // Privacy Audit
  app.post('/api/privacy-audit', strictLimiter, async (req, res) => {
    try {
      const validatedData = privacyAuditRequestSchema.parse(req.body);
      const sessionId = req.headers['x-session-id'] as string;
      
      if (!sessionId) {
        return res.status(400).json({ message: 'Session ID required' });
      }

      // Step 1: Scrape profile data (mock implementation)
      const profileData = await scrapeProfileData(validatedData.platform, validatedData.profileUrl);
      
      // Step 2: Analyze privacy risks
      const risks = await analyzePrivacyRisks(profileData, validatedData.platform);
      
      // Step 3: Determine overall risk level
      const highRisks = risks.filter(r => r.severity === 'high').length;
      const mediumRisks = risks.filter(r => r.severity === 'medium').length;
      
      let overallRisk: 'low' | 'medium' | 'high';
      if (highRisks >= 3) {
        overallRisk = 'high';
      } else if (highRisks >= 1 || mediumRisks >= 3) {
        overallRisk = 'medium';
      } else {
        overallRisk = 'low';
      }
      
      // Step 4: Generate comprehensive recommendations
      const recommendations = [
        ...risks.map(r => r.recommendation),
        "Enable two-factor authentication on all accounts",
        "Regularly review and update privacy settings",
        "Be cautious about sharing location information"
      ];

      const auditData = insertPrivacyAuditSchema.parse({
        sessionId,
        platform: validatedData.platform,
        findings: risks,
        riskLevel: overallRisk,
        recommendations: [...new Set(recommendations)] // Remove duplicates
      });

      const audit = await storage.createPrivacyAudit(auditData);
      
      // Return audit with summary
      res.json({
        ...audit,
        summary: {
          totalRisks: risks.length,
          highRisks,
          mediumRisks,
          lowRisks: risks.filter(r => r.severity === 'low').length,
          dataPointsAnalyzed: Object.keys(profileData).length,
          profileDataFound: Object.keys(profileData)
        }
      });
    } catch (error: any) {
      res.status(400).json({ message: error?.message || "Request failed" });
    }
  });

  // Get privacy audits for session
  app.get('/api/privacy-audits', async (req, res) => {
    try {
      const sessionId = req.headers['x-session-id'] as string;
      if (!sessionId) {
        return res.status(400).json({ message: 'Session ID required' });
      }

      const audits = await storage.getPrivacyAuditsBySession(sessionId);
      res.json(audits);
    } catch (error: any) {
      res.status(500).json({ message: error?.message || "Request failed" });
    }
  });

  // Harassment Detection
  app.post('/api/harassment-analysis', strictLimiter, async (req, res) => {
    try {
      const validatedData = harassmentAnalysisRequestSchema.parse(req.body);
      const sessionId = req.headers['x-session-id'] as string;
      
      if (!sessionId) {
        return res.status(400).json({ message: 'Session ID required' });
      }

      // Encrypt the content before storing
      const encryptedContent = encryptData(validatedData.content, sessionId);
      
      const analysis = await analyzeHarassment(validatedData.content, validatedData.context);
      
      const analysisData = insertHarassmentAnalysisSchema.parse({
        sessionId,
        content: encryptedContent,
        threatLevel: analysis.threatLevel,
        categories: analysis.categories,
        confidence: analysis.confidence.toString(),
        recommendations: analysis.recommendations,
        evidenceGenerated: analysis.evidencePoints.length > 0
      });

      const result = await storage.createHarassmentAnalysis(analysisData);
      
      // Return analysis without encrypted content
      res.json({
        ...result,
        content: undefined,
        analysis: {
          explanation: analysis.explanation,
          evidencePoints: analysis.evidencePoints
        }
      });
    } catch (error: any) {
      res.status(400).json({ message: error?.message || 'Analysis failed' });
    }
  });

  // Get harassment analyses for session
  app.get('/api/harassment-analyses', async (req, res) => {
    try {
      const sessionId = req.headers['x-session-id'] as string;
      if (!sessionId) {
        return res.status(400).json({ message: 'Session ID required' });
      }

      const analyses = await storage.getHarassmentAnalysesBySession(sessionId);
      // Remove encrypted content from response
      const sanitized = analyses.map(a => ({ ...a, content: undefined }));
      res.json(sanitized);
    } catch (error: any) {
      res.status(500).json({ message: error?.message || "Request failed" });
    }
  });

  // Digital Footprint Analysis
  app.post('/api/digital-footprint', strictLimiter, async (req, res) => {
    try {
      const { searchTerms } = req.body;
      
      // Simulate digital footprint search - in real implementation, this would use search APIs
      const mockSearchData = {
        googleResults: [`${searchTerms} profile found`, `${searchTerms} contact info`],
        socialMedia: [`Facebook profile for ${searchTerms}`, `Instagram account: @${searchTerms}`],
        databrokers: [`WhitePages listing for ${searchTerms}`, `Spokeo profile found`],
        publicRecords: [`Voter registration found`, `Property records available`]
      };

      const report = await generateDigitalFootprintReport(mockSearchData);
      res.json(report);
    } catch (error: any) {
      res.status(400).json({ message: error?.message || "Request failed" });
    }
  });

  // Security Checklist
  app.post('/api/security-checklist', async (req, res) => {
    try {
      const { platform, completedItems } = req.body;
      const sessionId = req.headers['x-session-id'] as string;
      
      if (!sessionId) {
        return res.status(400).json({ message: 'Session ID required' });
      }

      const checklistData = insertSecurityChecklistSchema.parse({
        sessionId,
        platform,
        completedItems,
        totalItems: "20" // Example total
      });

      const checklist = await storage.createOrUpdateSecurityChecklist(checklistData);
      res.json(checklist);
    } catch (error: any) {
      res.status(400).json({ message: error?.message || "Request failed" });
    }
  });

  app.get('/api/security-checklist/:platform', async (req, res) => {
    try {
      const { platform } = req.params;
      const sessionId = req.headers['x-session-id'] as string;
      
      if (!sessionId) {
        return res.status(400).json({ message: 'Session ID required' });
      }

      const checklist = await storage.getSecurityChecklistBySession(sessionId, platform);
      res.json(checklist);
    } catch (error: any) {
      res.status(500).json({ message: error?.message || "Request failed" });
    }
  });

  // Emergency Contacts
  app.post('/api/emergency-contacts', async (req, res) => {
    try {
      const { contactData } = req.body;
      const sessionId = req.headers['x-session-id'] as string;
      
      if (!sessionId) {
        return res.status(400).json({ message: 'Session ID required' });
      }

      const encryptedData = encryptData(JSON.stringify(contactData), sessionId);
      
      const contactInfo = insertEmergencyContactSchema.parse({
        sessionId,
        encryptedData
      });

      const contact = await storage.createEmergencyContact(contactInfo);
      res.json({ id: contact.id, isActive: contact.isActive });
    } catch (error: any) {
      res.status(400).json({ message: error?.message || "Request failed" });
    }
  });

  app.get('/api/emergency-contacts', async (req, res) => {
    try {
      const sessionId = req.headers['x-session-id'] as string;
      
      if (!sessionId) {
        return res.status(400).json({ message: 'Session ID required' });
      }

      const contacts = await storage.getEmergencyContactsBySession(sessionId);
      
      // Decrypt and return contact data
      const decryptedContacts = contacts.map(contact => {
        try {
          const decryptedData = decryptData(contact.encryptedData, sessionId);
          return {
            id: contact.id,
            ...JSON.parse(decryptedData),
            isActive: contact.isActive
          };
        } catch {
          return { id: contact.id, error: 'Failed to decrypt contact data' };
        }
      });

      res.json(decryptedContacts);
    } catch (error: any) {
      res.status(500).json({ message: error?.message || "Request failed" });
    }
  });

  // Emergency Alert
  app.post('/api/emergency-alert', strictLimiter, async (req, res) => {
    try {
      const validatedData = emergencyAlertRequestSchema.parse(req.body);
      const sessionId = req.headers['x-session-id'] as string;
      
      if (!sessionId) {
        return res.status(400).json({ message: 'Session ID required' });
      }

      // In real implementation, this would:
      // 1. Send SMS/emails to emergency contacts
      // 2. Contact local authorities if specified
      // 3. Share location data securely
      // 4. Generate incident report

      // For now, simulate the alert
      console.log('EMERGENCY ALERT TRIGGERED:', {
        sessionId,
        location: validatedData.location,
        message: validatedData.message,
        timestamp: new Date().toISOString()
      });

      res.json({ 
        success: true, 
        message: 'Emergency alert sent successfully',
        alertId: generateSecureToken()
      });
    } catch (error: any) {
      res.status(400).json({ message: error?.message || "Request failed" });
    }
  });

  // Safe Communication
  app.post('/api/safe-messages', async (req, res) => {
    try {
      const { roomId, content, expiresInMinutes = 60 } = req.body;
      const sessionId = req.headers['x-session-id'] as string;
      
      if (!sessionId) {
        return res.status(400).json({ message: 'Session ID required' });
      }

      const encryptedContent = encryptData(content, sessionId);
      const senderKey = hashString(sessionId + roomId);
      const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

      const messageData = insertSafeMessageSchema.parse({
        roomId,
        encryptedContent,
        senderKey,
        expiresAt
      });

      const message = await storage.createSafeMessage(messageData);
      res.json({ 
        id: message.id, 
        roomId: message.roomId,
        senderKey: message.senderKey,
        expiresAt: message.expiresAt,
        createdAt: message.createdAt
      });
    } catch (error: any) {
      res.status(400).json({ message: error?.message || "Request failed" });
    }
  });

  app.get('/api/safe-messages/:roomId', async (req, res) => {
    try {
      const { roomId } = req.params;
      const sessionId = req.headers['x-session-id'] as string;
      
      if (!sessionId) {
        return res.status(400).json({ message: 'Session ID required' });
      }

      const messages = await storage.getSafeMessagesByRoom(roomId);
      
      // Decrypt messages and only return those the user can read
      const decryptedMessages = messages.map(message => {
        try {
          const content = decryptData(message.encryptedContent, sessionId);
          return {
            id: message.id,
            content,
            senderKey: message.senderKey,
            createdAt: message.createdAt,
            expiresAt: message.expiresAt
          };
        } catch {
          // User can't decrypt this message (not their session)
          return null;
        }
      }).filter(Boolean);

      res.json(decryptedMessages);
    } catch (error: any) {
      res.status(500).json({ message: error?.message || "Request failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
