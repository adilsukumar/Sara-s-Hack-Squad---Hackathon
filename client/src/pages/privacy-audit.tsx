import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, CheckCircle, Search, ExternalLink, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface PrivacyRisk {
  type: string;
  severity: "low" | "medium" | "high";
  description: string;
  recommendation: string;
  platform: string;
}

interface PrivacyAudit {
  id: string;
  platform: string;
  findings: PrivacyRisk[];
  riskLevel: "low" | "medium" | "high";
  recommendations: string[];
  createdAt: string;
}

export default function PrivacyAudit() {
  const [platform, setPlatform] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  const sessionId = localStorage.getItem('cybershe-session');

  // Get previous audits
  const { data: audits = [] } = useQuery<PrivacyAudit[]>({
    queryKey: ['/api/privacy-audits'],
    enabled: !!sessionId,
  });

  // Privacy audit mutation
  const auditMutation = useMutation({
    mutationFn: async (data: { platform: string; profileUrl?: string }) => {
      const response = await apiRequest('POST', '/api/privacy-audit', {
        platform: data.platform,
        profileUrl: data.profileUrl,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Privacy Audit Complete",
        description: "Your privacy audit has been completed successfully.",
      });
      setIsScanning(false);
      setPlatform("");
      setProfileUrl("");
      queryClient.invalidateQueries({ queryKey: ['/api/privacy-audits'] });
    },
    onError: (error) => {
      toast({
        title: "Audit Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsScanning(false);
    },
  });

  const handleDownloadReport = (audit: PrivacyAudit) => {
    const reportContent = {
      title: "Privacy Audit Report",
      platform: audit.platform,
      auditDate: new Date(audit.createdAt).toLocaleString(),
      riskLevel: audit.riskLevel,
      findings: audit.findings,
      recommendations: audit.recommendations,
      summary: `Privacy audit for ${audit.platform} completed on ${new Date(audit.createdAt).toLocaleDateString()}. Risk level: ${audit.riskLevel.toUpperCase()}.`
    };

    const blob = new Blob([JSON.stringify(reportContent, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `privacy-audit-${audit.platform}-${new Date(audit.createdAt).toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Report Downloaded",
      description: `Privacy audit report for ${audit.platform} has been saved.`,
    });
  };

  const handleStartAudit = async () => {
    if (!platform) {
      toast({
        title: "Platform Required",
        description: "Please select a social media platform to audit.",
        variant: "destructive",
      });
      return;
    }

    if (!sessionId) {
      toast({
        title: "Session Error",
        description: "Please refresh the page and try again.",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    auditMutation.mutate({ platform, profileUrl });
  };

  const getRiskColor = (severity: string) => {
    switch (severity) {
      case "high": return "text-destructive";
      case "medium": return "text-orange-600";
      case "low": return "text-green-600";
      default: return "text-muted-foreground";
    }
  };

  const getRiskBadgeVariant = (severity: string) => {
    switch (severity) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "default";
      default: return "outline";
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="privacy-audit-page">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4" data-testid="page-title">Privacy Audit Tool</h1>
          <p className="text-xl text-muted-foreground" data-testid="page-description">
            Scan your social media profiles for exposed personal information and privacy vulnerabilities
          </p>
        </div>

        <Tabs defaultValue="audit" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="audit" data-testid="tab-new-audit">New Audit</TabsTrigger>
            <TabsTrigger value="history" data-testid="tab-audit-history">Audit History</TabsTrigger>
          </TabsList>

          <TabsContent value="audit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="h-5 w-5" />
                  <span data-testid="text-start-audit">Start Privacy Audit</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="platform" data-testid="label-platform">Social Media Platform *</Label>
                    <Select value={platform} onValueChange={setPlatform}>
                      <SelectTrigger data-testid="select-platform">
                        <SelectValue placeholder="Select a platform to audit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="facebook" data-testid="option-facebook">Facebook</SelectItem>
                        <SelectItem value="instagram" data-testid="option-instagram">Instagram</SelectItem>
                        <SelectItem value="twitter" data-testid="option-twitter">Twitter/X</SelectItem>
                        <SelectItem value="linkedin" data-testid="option-linkedin">LinkedIn</SelectItem>
                        <SelectItem value="tiktok" data-testid="option-tiktok">TikTok</SelectItem>
                        <SelectItem value="snapchat" data-testid="option-snapchat">Snapchat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="profile-url" data-testid="label-profile-url">Profile URL (Optional)</Label>
                    <Input
                      id="profile-url"
                      placeholder="https://facebook.com/your-profile"
                      value={profileUrl}
                      onChange={(e) => setProfileUrl(e.target.value)}
                      data-testid="input-profile-url"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Providing your profile URL enables more detailed analysis
                    </p>
                  </div>
                </div>

                <div className="bg-muted/50 border border-border rounded-lg p-6">
                  <h3 className="font-semibold mb-4 flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <span data-testid="text-privacy-notice">Privacy Notice</span>
                  </h3>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• All analysis is performed securely and privately</li>
                    <li>• No personal data is stored or shared with third parties</li>
                    <li>• Results are encrypted and temporary</li>
                    <li>• You can delete audit results at any time</li>
                  </ul>
                </div>

                {isScanning && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="inline-flex items-center space-x-2 text-muted-foreground">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        <span data-testid="text-scanning">Scanning your {platform} profile...</span>
                      </div>
                    </div>
                    <Progress value={33} className="w-full" />
                    <p className="text-sm text-muted-foreground text-center">
                      This may take a few moments as we analyze your privacy settings and public information.
                    </p>
                  </div>
                )}

                <Button 
                  onClick={handleStartAudit}
                  disabled={!platform || isScanning}
                  className="w-full"
                  size="lg"
                  data-testid="button-start-audit"
                >
                  {isScanning ? "Scanning..." : "Start Privacy Audit"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            {audits.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2" data-testid="text-no-audits">No audits found</h3>
                  <p className="text-muted-foreground mb-4">Start your first privacy audit to see results here.</p>
                  <Button onClick={() => {}} data-testid="button-start-first-audit">
                    Start Your First Audit
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {audits.map((audit) => (
                  <Card key={audit.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center space-x-2">
                          <span data-testid={`text-audit-platform-${audit.id}`}>
                            {audit.platform.charAt(0).toUpperCase() + audit.platform.slice(1)} Audit
                          </span>
                          <Badge 
                            variant={getRiskBadgeVariant(audit.riskLevel)}
                            data-testid={`badge-risk-${audit.id}`}
                          >
                            {audit.riskLevel.toUpperCase()} RISK
                          </Badge>
                        </CardTitle>
                        <span className="text-sm text-muted-foreground" data-testid={`text-audit-date-${audit.id}`}>
                          {new Date(audit.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-3" data-testid={`text-findings-${audit.id}`}>
                            Privacy Issues Found ({audit.findings.length})
                          </h4>
                          <div className="space-y-2">
                            {audit.findings.slice(0, 3).map((finding, index) => (
                              <div 
                                key={index}
                                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                              >
                                <div className="flex items-center space-x-3">
                                  {finding.severity === "high" ? (
                                    <AlertTriangle className="text-destructive h-4 w-4" />
                                  ) : finding.severity === "medium" ? (
                                    <AlertTriangle className="text-orange-600 h-4 w-4" />
                                  ) : (
                                    <CheckCircle className="text-green-600 h-4 w-4" />
                                  )}
                                  <div>
                                    <div className="font-medium text-sm" data-testid={`text-finding-${audit.id}-${index}`}>
                                      {finding.description}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {finding.recommendation}
                                    </div>
                                  </div>
                                </div>
                                <Badge 
                                  variant={getRiskBadgeVariant(finding.severity)}
                                  data-testid={`badge-finding-${audit.id}-${index}`}
                                >
                                  {finding.severity}
                                </Badge>
                              </div>
                            ))}
                            {audit.findings.length > 3 && (
                              <div className="text-sm text-muted-foreground text-center py-2">
                                +{audit.findings.length - 3} more issues found
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" data-testid={`button-view-details-${audit.id}`}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Full Report
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDownloadReport(audit)}
                            data-testid={`button-download-${audit.id}`}
                          >
                            Download Report
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
