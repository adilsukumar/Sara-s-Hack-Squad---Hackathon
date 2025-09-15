import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CheckSquare, Shield, Smartphone, Globe, Lock, Eye, ExternalLink, ChevronDown, ChevronUp, AlertTriangle, Info, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "advanced";
  category: string;
  instructions: string;
  detailedSteps: string[];
  whyImportant: string;
  riskLevel: "low" | "medium" | "high";
  timeRequired: string;
  externalGuideUrl: string;
  completed: boolean;
}

interface SecurityChecklist {
  id: string;
  platform: string;
  completedItems: string[];
  totalItems: string;
  lastUpdated: string;
}

export default function SecurityChecklist() {
  const [selectedPlatform, setSelectedPlatform] = useState("general");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const sessionId = localStorage.getItem('cybershe-session');

  // Get checklist progress for current platform
  const { data: checklist } = useQuery<SecurityChecklist>({
    queryKey: ['/api/security-checklist', selectedPlatform],
    enabled: !!sessionId && !!selectedPlatform,
  });

  // Update checklist mutation
  const updateMutation = useMutation({
    mutationFn: async (data: { platform: string; completedItems: string[] }) => {
      const response = await apiRequest('POST', '/api/security-checklist', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/security-checklist', selectedPlatform] });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const platforms = [
    { id: "general", name: "General Security", icon: Shield },
    { id: "facebook", name: "Facebook", icon: Globe },
    { id: "instagram", name: "Instagram", icon: Globe },
    { id: "twitter", name: "Twitter/X", icon: Globe },
    { id: "mobile", name: "Mobile Devices", icon: Smartphone },
    { id: "email", name: "Email Security", icon: Lock },
  ];

  const getChecklistItems = (platform: string): ChecklistItem[] => {
    const items = {
      general: [
        {
          id: "2fa-enable",
          title: "Enable Two-Factor Authentication",
          description: "Add an extra layer of security to all your accounts",
          difficulty: "easy" as const,
          category: "Authentication",
          instructions: "Go to account settings and enable 2FA using an authenticator app or SMS",
          detailedSteps: [
            "Download an authenticator app (Google Authenticator, Authy, or Microsoft Authenticator)",
            "Go to your account's security settings",
            "Look for 'Two-Factor Authentication' or '2FA' option",
            "Choose 'Authenticator App' method (more secure than SMS)",
            "Scan the QR code with your authenticator app",
            "Enter the 6-digit code to verify setup",
            "Save backup codes in a secure location"
          ],
          whyImportant: "2FA prevents unauthorized access even if your password is compromised. It's one of the most effective security measures you can implement.",
          riskLevel: "high" as const,
          timeRequired: "5-10 minutes per account",
          externalGuideUrl: "https://www.cisa.gov/secure-our-world/turn-mfa",
          completed: false
        },
        {
          id: "password-manager",
          title: "Use a Password Manager",
          description: "Generate and store unique passwords for all accounts",
          difficulty: "easy" as const,
          category: "Passwords",
          instructions: "Install a reputable password manager like Bitwarden, 1Password, or LastPass",
          detailedSteps: [
            "Research and choose a reputable password manager",
            "Create an account with a strong master password",
            "Install the browser extension and mobile app",
            "Import existing passwords from your browser",
            "Generate new strong passwords for important accounts",
            "Enable auto-fill for convenience",
            "Set up secure sharing for family members if needed"
          ],
          whyImportant: "Unique, complex passwords for each account prevent credential stuffing attacks and reduce the impact of data breaches.",
          riskLevel: "high" as const,
          timeRequired: "30-60 minutes initial setup",
          externalGuideUrl: "https://www.cisa.gov/secure-our-world/use-strong-passwords",
          completed: false
        },
        {
          id: "software-updates",
          title: "Keep Software Updated",
          description: "Install security updates for all devices and applications",
          difficulty: "easy" as const,
          category: "System Security",
          instructions: "Enable automatic updates on all devices and check for updates weekly",
          detailedSteps: [
            "Enable automatic updates for your operating system",
            "Set up automatic updates for critical software (browsers, antivirus)",
            "Create a weekly reminder to check for app updates",
            "Update firmware on routers and IoT devices quarterly",
            "Remove unused software to reduce attack surface",
            "Subscribe to security bulletins for software you use"
          ],
          whyImportant: "Security updates patch vulnerabilities that attackers actively exploit. Delayed updates leave you exposed to known threats.",
          riskLevel: "high" as const,
          timeRequired: "15 minutes weekly",
          externalGuideUrl: "https://www.cisa.gov/secure-our-world/update-your-software",
          completed: false
        },
        {
          id: "backup-data",
          title: "Regular Data Backups",
          description: "Back up important data to secure cloud storage",
          difficulty: "medium" as const,
          category: "Data Protection",
          instructions: "Set up automatic backups to encrypted cloud storage or external drives",
          detailedSteps: [
            "Identify critical data that needs backing up",
            "Choose a backup solution (cloud service or external drive)",
            "Set up automatic daily/weekly backups",
            "Test restore process to ensure backups work",
            "Encrypt sensitive backup data",
            "Store one backup copy offsite",
            "Document your backup and recovery procedures"
          ],
          whyImportant: "Backups protect against ransomware, hardware failure, and accidental deletion. They're your last line of defense.",
          riskLevel: "medium" as const,
          timeRequired: "1-2 hours initial setup",
          externalGuideUrl: "https://www.cisa.gov/secure-our-world/recognize-and-report-phishing",
          completed: false
        },
      ],
      facebook: [
        {
          id: "fb-privacy-settings",
          title: "Review Privacy Settings",
          description: "Limit who can see your posts and personal information",
          difficulty: "easy" as const,
          category: "Privacy",
          instructions: "Go to Settings > Privacy and review all visibility settings",
          completed: false
        },
        {
          id: "fb-location-disable",
          title: "Disable Location Services",
          description: "Turn off location tracking for posts and check-ins",
          difficulty: "easy" as const,
          category: "Location",
          instructions: "Settings > Location > Turn off location services for Facebook",
          completed: false
        },
        {
          id: "fb-contact-sync",
          title: "Disable Contact Syncing",
          description: "Prevent Facebook from accessing your phone contacts",
          difficulty: "medium" as const,
          category: "Data Collection",
          instructions: "Settings > Upload Contacts > Turn off contact uploading",
          completed: false
        },
        {
          id: "fb-ad-preferences",
          title: "Review Ad Preferences",
          description: "Limit data collection for targeted advertising",
          difficulty: "medium" as const,
          category: "Advertising",
          instructions: "Settings > Ads > Review and adjust ad preferences and data usage",
          completed: false
        },
      ],
      instagram: [
        {
          id: "ig-private-account",
          title: "Make Account Private",
          description: "Require approval for new followers",
          difficulty: "easy" as const,
          category: "Privacy",
          instructions: "Profile > Settings > Privacy > Private Account",
          completed: false
        },
        {
          id: "ig-story-privacy",
          title: "Limit Story Visibility",
          description: "Control who can see your Instagram stories",
          difficulty: "easy" as const,
          category: "Privacy",
          instructions: "Settings > Privacy > Story > Hide story from specific people",
          completed: false
        },
        {
          id: "ig-location-remove",
          title: "Remove Location Tags",
          description: "Delete location information from past posts",
          difficulty: "medium" as const,
          category: "Location",
          instructions: "Review old posts and remove location tags, disable future location sharing",
          completed: false
        },
        {
          id: "ig-contact-restrict",
          title: "Restrict Contact Options",
          description: "Limit how people can contact you on Instagram",
          difficulty: "easy" as const,
          category: "Communication",
          instructions: "Settings > Privacy > Messages > Restrict messages from unknown users",
          completed: false
        },
      ],
      twitter: [
        {
          id: "tw-protect-tweets",
          title: "Protect Your Tweets",
          description: "Make your tweets visible only to approved followers",
          difficulty: "easy" as const,
          category: "Privacy",
          instructions: "Settings > Privacy and Safety > Protect your Tweets",
          completed: false
        },
        {
          id: "tw-location-disable",
          title: "Disable Tweet Location",
          description: "Turn off location information in tweets",
          difficulty: "easy" as const,
          category: "Location",
          instructions: "Settings > Privacy and Safety > Location Information",
          completed: false
        },
        {
          id: "tw-photo-tagging",
          title: "Control Photo Tagging",
          description: "Require approval before being tagged in photos",
          difficulty: "easy" as const,
          category: "Privacy",
          instructions: "Settings > Privacy and Safety > Photo tagging",
          completed: false
        },
        {
          id: "tw-data-sharing",
          title: "Limit Data Sharing",
          description: "Reduce data sharing with third parties",
          difficulty: "medium" as const,
          category: "Data Protection",
          instructions: "Settings > Privacy and Safety > Data sharing and off-Twitter activity",
          completed: false
        },
      ],
      mobile: [
        {
          id: "mobile-screen-lock",
          title: "Enable Screen Lock",
          description: "Use PIN, password, or biometric authentication",
          difficulty: "easy" as const,
          category: "Device Security",
          instructions: "Settings > Security > Screen Lock > Choose secure method",
          completed: false
        },
        {
          id: "mobile-app-permissions",
          title: "Review App Permissions",
          description: "Check what data apps can access",
          difficulty: "medium" as const,
          category: "Privacy",
          instructions: "Settings > Privacy > App Permissions > Review and restrict unnecessary access",
          completed: false
        },
        {
          id: "mobile-find-device",
          title: "Enable Find My Device",
          description: "Ability to locate, lock, or wipe lost devices",
          difficulty: "easy" as const,
          category: "Device Security",
          instructions: "Enable Find My iPhone (iOS) or Find My Device (Android)",
          completed: false
        },
        {
          id: "mobile-public-wifi",
          title: "Avoid Public WiFi",
          description: "Use VPN when connecting to public networks",
          difficulty: "medium" as const,
          category: "Network Security",
          instructions: "Install a reputable VPN app and use it on public networks",
          completed: false
        },
      ],
      email: [
        {
          id: "email-2fa",
          title: "Enable Email 2FA",
          description: "Secure your email with two-factor authentication",
          difficulty: "easy" as const,
          category: "Authentication",
          instructions: "Email settings > Security > Two-factor authentication",
          completed: false
        },
        {
          id: "email-forwarding",
          title: "Check Email Forwarding",
          description: "Ensure no unauthorized email forwarding is set up",
          difficulty: "medium" as const,
          category: "Security",
          instructions: "Email settings > Forwarding > Review and remove suspicious rules",
          completed: false
        },
        {
          id: "email-recovery",
          title: "Secure Recovery Options",
          description: "Set up secure account recovery methods",
          difficulty: "medium" as const,
          category: "Account Recovery",
          instructions: "Update recovery email and phone number, add security questions",
          completed: false
        },
        {
          id: "email-phishing",
          title: "Enable Phishing Protection",
          description: "Turn on advanced threat protection features",
          difficulty: "easy" as const,
          category: "Threat Protection",
          instructions: "Email settings > Security > Enable spam and phishing filters",
          completed: false
        },
      ],
    };

    const platformItems = items[platform as keyof typeof items] || items.general;
    const completedItems = checklist?.completedItems || [];
    
    return platformItems.map(item => ({
      ...item,
      completed: completedItems.includes(item.id),
      // Add default values for missing fields
      detailedSteps: item.detailedSteps || [],
      whyImportant: item.whyImportant || "This security measure helps protect your privacy and data.",
      riskLevel: item.riskLevel || "medium" as const,
      timeRequired: item.timeRequired || "10-15 minutes",
      externalGuideUrl: item.externalGuideUrl || "https://www.cisa.gov/secure-our-world"
    }));
  };

  const items = getChecklistItems(selectedPlatform);
  const completedCount = items.filter(item => item.completed).length;
  const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;

  const handleItemToggle = (itemId: string, completed: boolean) => {
    const currentCompleted = checklist?.completedItems || [];
    const newCompleted = completed 
      ? [...currentCompleted, itemId]
      : currentCompleted.filter(id => id !== itemId);

    updateMutation.mutate({
      platform: selectedPlatform,
      completedItems: newCompleted
    });

    if (completed) {
      toast({
        title: "Great Progress!",
        description: "Security item completed. Keep going!",
      });
    }
  };

  const toggleItemExpansion = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high": return "text-red-600";
      case "medium": return "text-orange-600";
      case "low": return "text-green-600";
      default: return "text-muted-foreground";
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "high": return <AlertTriangle className="h-4 w-4" />;
      case "medium": return <AlertTriangle className="h-4 w-4" />;
      case "low": return <Info className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-green-600";
      case "medium": return "text-orange-600";
      case "advanced": return "text-red-600";
      default: return "text-muted-foreground";
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "default";
      case "medium": return "secondary";
      case "advanced": return "destructive";
      default: return "outline";
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="security-checklist-page">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4" data-testid="page-title">Security Checklist</h1>
          <p className="text-xl text-muted-foreground" data-testid="page-description">
            Step-by-step guides to harden your privacy settings across all platforms and devices
          </p>
        </div>

        <div className="space-y-6">
          {/* Platform Selection */}
          <Card>
            <CardHeader>
              <CardTitle data-testid="text-select-platform">Select Platform</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {platforms.map((platform) => (
                  <Button
                    key={platform.id}
                    variant={selectedPlatform === platform.id ? "default" : "outline"}
                    onClick={() => setSelectedPlatform(platform.id)}
                    className="h-auto p-4 flex flex-col items-center space-y-2"
                    data-testid={`button-platform-${platform.id}`}
                  >
                    <platform.icon className="h-6 w-6" />
                    <span className="text-sm">{platform.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <CheckSquare className="h-5 w-5" />
                  <span data-testid="text-progress-title">
                    {platforms.find(p => p.id === selectedPlatform)?.name} Security Progress
                  </span>
                </CardTitle>
                <Badge variant="outline" data-testid="badge-progress">
                  {completedCount} / {items.length} Complete
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span data-testid="text-progress-label">Security Score</span>
                    <span data-testid="text-progress-percentage">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="w-full" data-testid="progress-security" />
                </div>
                
                {progress === 100 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-green-700">
                      <Shield className="h-5 w-5" />
                      <span className="font-medium" data-testid="text-completed">Excellent work!</span>
                    </div>
                    <p className="text-sm text-green-600 mt-1">
                      You've completed all security items for this platform. Your privacy is well protected!
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Checklist Items */}
          <Card>
            <CardHeader>
              <CardTitle data-testid="text-security-items">Security Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <Collapsible 
                    key={item.id}
                    open={expandedItems.has(item.id)}
                    onOpenChange={() => toggleItemExpansion(item.id)}
                  >
                    <div 
                      className={`border rounded-lg transition-colors ${
                        item.completed ? 'bg-green-50 border-green-200' : 'bg-card border-border'
                      }`}
                    >
                      <div className="p-4">
                        <div className="flex items-start space-x-4">
                          <Checkbox
                            checked={item.completed}
                            onCheckedChange={(checked) => handleItemToggle(item.id, !!checked)}
                            className="mt-1"
                            data-testid={`checkbox-${item.id}`}
                          />
                          
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium" data-testid={`text-item-title-${item.id}`}>
                                {item.title}
                              </h3>
                              <div className="flex items-center space-x-2">
                                {item.riskLevel && (
                                  <Badge 
                                    variant={item.riskLevel === "high" ? "destructive" : 
                                            item.riskLevel === "medium" ? "secondary" : "default"}
                                    className="flex items-center space-x-1"
                                  >
                                    {getRiskIcon(item.riskLevel)}
                                    <span>{item.riskLevel} risk</span>
                                  </Badge>
                                )}
                                <Badge 
                                  variant={getDifficultyBadge(item.difficulty)}
                                  data-testid={`badge-difficulty-${item.id}`}
                                >
                                  {item.difficulty}
                                </Badge>
                                <Badge variant="outline" data-testid={`badge-category-${item.id}`}>
                                  {item.category}
                                </Badge>
                              </div>
                            </div>
                            
                            <p className="text-sm text-muted-foreground" data-testid={`text-item-description-${item.id}`}>
                              {item.description}
                            </p>

                            {item.timeRequired && (
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>Time required: {item.timeRequired}</span>
                              </div>
                            )}
                            
                            <div className="flex space-x-2">
                              <CollapsibleTrigger asChild>
                                <Button variant="outline" size="sm" data-testid={`button-details-${item.id}`}>
                                  {expandedItems.has(item.id) ? (
                                    <>
                                      <ChevronUp className="h-4 w-4 mr-2" />
                                      Hide Details
                                    </>
                                  ) : (
                                    <>
                                      <ChevronDown className="h-4 w-4 mr-2" />
                                      Show Details
                                    </>
                                  )}
                                </Button>
                              </CollapsibleTrigger>
                              {!item.completed && (
                                <Button 
                                  size="sm"
                                  onClick={() => handleItemToggle(item.id, true)}
                                  data-testid={`button-mark-complete-${item.id}`}
                                >
                                  Mark as Complete
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <CollapsibleContent>
                        <div className="px-4 pb-4 border-t bg-muted/20">
                          <div className="pt-4 space-y-4">
                            {item.whyImportant && (
                              <div>
                                <h4 className="text-sm font-medium mb-2 flex items-center space-x-2">
                                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                                  <span>Why This Matters</span>
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {item.whyImportant}
                                </p>
                              </div>
                            )}

                            <div>
                              <h4 className="text-sm font-medium mb-2 flex items-center space-x-2">
                                <Eye className="h-4 w-4" />
                                <span>Quick Instructions</span>
                              </h4>
                              <p className="text-sm text-muted-foreground mb-3">
                                {item.instructions}
                              </p>
                            </div>

                            {item.detailedSteps && item.detailedSteps.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium mb-3 flex items-center space-x-2">
                                  <CheckSquare className="h-4 w-4" />
                                  <span>Step-by-Step Guide</span>
                                </h4>
                                <ol className="text-sm space-y-2">
                                  {item.detailedSteps.map((step, index) => (
                                    <li key={index} className="flex items-start space-x-3">
                                      <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                                        {index + 1}
                                      </span>
                                      <span className="text-muted-foreground">{step}</span>
                                    </li>
                                  ))}
                                </ol>
                              </div>
                            )}

                            <div className="flex space-x-2 pt-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => window.open(item.externalGuideUrl, '_blank')}
                                data-testid={`button-help-${item.id}`}
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                External Guide
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Resources */}
          <Card>
            <CardHeader>
              <CardTitle data-testid="text-additional-resources">Additional Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-medium">Security Tools</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Password managers (Bitwarden, 1Password)</li>
                    <li>• VPN services (NordVPN, ExpressVPN)</li>
                    <li>• Authenticator apps (Authy, Google Authenticator)</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Privacy Guides</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Platform-specific privacy settings</li>
                    <li>• Safe browsing practices</li>
                    <li>• Social engineering awareness</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
