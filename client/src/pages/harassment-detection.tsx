import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Bot, AlertTriangle, Shield, Download, Eye, EyeOff, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

interface HarassmentAnalysis {
  id: string;
  threatLevel: "none" | "low" | "medium" | "high" | "critical";
  categories: string[];
  confidence: string;
  recommendations: string[];
  evidenceGenerated: boolean;
  createdAt: string;
  analysis?: {
    explanation: string;
    evidencePoints: string[];
  };
}

export default function HarassmentDetection() {
  const [content, setContent] = useState("");
  const [context, setContext] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const { toast } = useToast();

  const sessionId = localStorage.getItem('cybershe-session');

  // Get previous analyses
  const { data: analyses = [], isLoading, error } = useQuery<HarassmentAnalysis[]>({
    queryKey: ['/api/harassment-analyses'],
    enabled: !!sessionId,
  });

  // Debug logging
  console.log('Session ID:', sessionId);
  console.log('Analyses:', analyses);
  console.log('Loading:', isLoading);
  console.log('Error:', error);

  // Analysis mutation
  const analysisMutation = useMutation({
    mutationFn: async (data: { content: string; context?: string }) => {
      const response = await apiRequest('POST', '/api/harassment-analysis', data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Analysis Complete",
        description: "Your harassment analysis has been completed.",
      });
      setIsAnalyzing(false);
      setContent("");
      setContext("");
      // Force refresh the analyses list
      queryClient.invalidateQueries({ queryKey: ['/api/harassment-analyses'] });
      queryClient.refetchQueries({ queryKey: ['/api/harassment-analyses'] });
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsAnalyzing(false);
    },
  });

  const handleAnalyze = async () => {
    if (!content.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter the message or content to analyze.",
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

    setIsAnalyzing(true);
    analysisMutation.mutate({ content, context });
  };

  const getThreatColor = (level: string) => {
    switch (level) {
      case "critical": return "text-red-600";
      case "high": return "text-destructive";
      case "medium": return "text-orange-600";
      case "low": return "text-yellow-600";
      case "none": return "text-green-600";
      default: return "text-muted-foreground";
    }
  };

  const getThreatBadgeVariant = (level: string) => {
    switch (level) {
      case "critical": return "destructive";
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      case "none": return "default";
      default: return "outline";
    }
  };

  const getThreatIcon = (level: string) => {
    switch (level) {
      case "critical":
      case "high":
        return <AlertTriangle className="h-4 w-4" />;
      case "medium":
        return <AlertTriangle className="h-4 w-4" />;
      case "low":
        return <Shield className="h-4 w-4" />;
      case "none":
        return <Shield className="h-4 w-4" />;
      default:
        return <Bot className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="harassment-detection-page">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4" data-testid="page-title">Harassment Detection</h1>
          <p className="text-xl text-muted-foreground" data-testid="page-description">
            AI-powered analysis to identify harassment patterns, threats, and concerning behavior
          </p>
        </div>

        <Tabs defaultValue="analyze" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="analyze" data-testid="tab-new-analysis">New Analysis</TabsTrigger>
            <TabsTrigger value="history" data-testid="tab-analysis-history">Analysis History</TabsTrigger>
          </TabsList>

          <TabsContent value="analyze" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bot className="h-5 w-5" />
                  <span data-testid="text-analyze-content">Analyze Content for Harassment</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription data-testid="alert-privacy">
                    All content is encrypted and analyzed securely. No data is stored unencrypted or shared with third parties.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="content" data-testid="label-content">
                      Message or Content to Analyze *
                    </Label>
                    <Textarea
                      id="content"
                      placeholder="Paste the message, email, or social media content you want to analyze..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="min-h-[120px] secure-input"
                      disabled={isAnalyzing}
                      data-testid="textarea-content"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Copy and paste suspicious messages, comments, or any content you're concerned about
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="context" data-testid="label-context">
                      Additional Context (Optional)
                    </Label>
                    <Textarea
                      id="context"
                      placeholder="Provide any additional context about the situation, relationship, or pattern of behavior..."
                      value={context}
                      onChange={(e) => setContext(e.target.value)}
                      className="min-h-[80px]"
                      disabled={isAnalyzing}
                      data-testid="textarea-context"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Context helps our AI provide more accurate threat assessment
                    </p>
                  </div>
                </div>

                <div className="bg-muted/50 border border-border rounded-lg p-6">
                  <h3 className="font-semibold mb-4 flex items-center space-x-2">
                    <Bot className="h-5 w-5 text-primary" />
                    <span data-testid="text-ai-analysis">AI Analysis Capabilities</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div>• Threat level assessment</div>
                      <div>• Sexual harassment detection</div>
                      <div>• Stalking behavior patterns</div>
                      <div>• Doxxing attempts</div>
                    </div>
                    <div className="space-y-2">
                      <div>• Intimidation tactics</div>
                      <div>• Implicit threats</div>
                      <div>• Evidence documentation</div>
                      <div>• Safety recommendations</div>
                    </div>
                  </div>
                </div>

                {isAnalyzing && (
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center space-x-2 text-muted-foreground">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      <span data-testid="text-analyzing">Analyzing content for harassment patterns...</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Our AI is carefully examining the content for threats, harassment, and concerning behavior.
                    </p>
                  </div>
                )}

                <Button 
                  onClick={handleAnalyze}
                  disabled={!content.trim() || isAnalyzing}
                  className="w-full"
                  size="lg"
                  data-testid="button-analyze"
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze for Harassment"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            {analyses.length === 0 && !isLoading ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2" data-testid="text-no-analyses">No analyses found</h3>
                  <p className="text-muted-foreground mb-4">Start your first harassment analysis to see results here.</p>
                  <p className="text-sm text-muted-foreground">Session ID: {sessionId || 'Not found'}</p>
                  <Button onClick={() => {}} data-testid="button-start-first-analysis">
                    Start Your First Analysis
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {analyses.map((analysis) => (
                  <Card key={analysis.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center space-x-2">
                          <div className={getThreatColor(analysis.threatLevel)}>
                            {getThreatIcon(analysis.threatLevel)}
                          </div>
                          <span data-testid={`text-analysis-title-${analysis.id}`}>
                            Harassment Analysis
                          </span>
                          <Badge 
                            variant={getThreatBadgeVariant(analysis.threatLevel)}
                            data-testid={`badge-threat-${analysis.id}`}
                          >
                            {analysis.threatLevel.toUpperCase()} THREAT
                          </Badge>
                        </CardTitle>
                        <span className="text-sm text-muted-foreground" data-testid={`text-analysis-date-${analysis.id}`}>
                          {new Date(analysis.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-2" data-testid={`text-threat-level-${analysis.id}`}>Threat Level</h4>
                            <div className={`flex items-center space-x-2 ${getThreatColor(analysis.threatLevel)}`}>
                              {getThreatIcon(analysis.threatLevel)}
                              <span className="font-medium">{analysis.threatLevel.toUpperCase()}</span>
                              <span className="text-sm text-muted-foreground">
                                ({Math.round(parseFloat(analysis.confidence) * 100)}% confidence)
                              </span>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2" data-testid={`text-categories-${analysis.id}`}>Categories Detected</h4>
                            <div className="flex flex-wrap gap-2">
                              {analysis.categories.length > 0 ? (
                                analysis.categories.map((category, index) => (
                                  <Badge key={index} variant="outline" data-testid={`badge-category-${analysis.id}-${index}`}>
                                    {category}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-sm text-muted-foreground">No concerning patterns detected</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {analysis.analysis && (
                          <div>
                            <h4 className="font-medium mb-2" data-testid={`text-explanation-${analysis.id}`}>AI Analysis</h4>
                            <p className="text-sm text-muted-foreground mb-3">
                              {analysis.analysis.explanation}
                            </p>
                            
                            {analysis.analysis.evidencePoints.length > 0 && (
                              <div>
                                <h5 className="text-sm font-medium mb-2">Evidence Points:</h5>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                  {analysis.analysis.evidencePoints.map((point, index) => (
                                    <li key={index} className="flex items-start space-x-2">
                                      <span className="text-destructive">•</span>
                                      <span data-testid={`text-evidence-${analysis.id}-${index}`}>{point}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}

                        {analysis.recommendations.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2" data-testid={`text-recommendations-${analysis.id}`}>Recommended Actions</h4>
                            <ul className="text-sm space-y-1">
                              {analysis.recommendations.map((rec, index) => (
                                <li key={index} className="flex items-start space-x-2">
                                  <span className="text-primary">•</span>
                                  <span data-testid={`text-recommendation-${analysis.id}-${index}`}>{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                          {analysis.evidenceGenerated && (
                            <Button variant="outline" size="sm" data-testid={`button-generate-report-${analysis.id}`}>
                              <FileText className="h-4 w-4 mr-2" />
                              Generate Evidence Report
                            </Button>
                          )}
                          <Button variant="outline" size="sm" data-testid={`button-download-analysis-${analysis.id}`}>
                            <Download className="h-4 w-4 mr-2" />
                            Download Analysis
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setShowContent(!showContent)}
                            data-testid={`button-toggle-content-${analysis.id}`}
                          >
                            {showContent ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                            {showContent ? "Hide Content" : "View Content"}
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
