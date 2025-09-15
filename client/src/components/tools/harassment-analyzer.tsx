import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Bot, AlertTriangle, Shield, FileText, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AnalysisResult {
  threatLevel: "none" | "low" | "medium" | "high" | "critical";
  confidence: number;
  categories: string[];
  explanation: string;
  recommendations: string[];
  evidencePoints: string[];
}

interface HarassmentAnalyzerProps {
  onAnalysisComplete?: (result: AnalysisResult) => void;
  className?: string;
}

export default function HarassmentAnalyzer({ onAnalysisComplete, className }: HarassmentAnalyzerProps) {
  const [content, setContent] = useState("");
  const [context, setContext] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showContent, setShowContent] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!content.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter the message or content to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const sessionId = localStorage.getItem('cybershe-session');
      if (!sessionId) {
        throw new Error('Session not found');
      }

      const response = await fetch('/api/harassment-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': sessionId,
        },
        body: JSON.stringify({ content, context }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      const analysisResult: AnalysisResult = {
        threatLevel: data.threatLevel,
        confidence: parseFloat(data.confidence),
        categories: data.categories,
        explanation: data.analysis?.explanation || "Analysis completed",
        recommendations: data.recommendations,
        evidencePoints: data.analysis?.evidencePoints || []
      };

      setResult(analysisResult);
      onAnalysisComplete?.(analysisResult);

      toast({
        title: "Analysis Complete",
        description: `Threat level: ${analysisResult.threatLevel.toUpperCase()}`,
        variant: analysisResult.threatLevel === "high" || analysisResult.threatLevel === "critical" ? "destructive" : "default"
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
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
      case "critical":
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      case "none":
        return "default";
      default:
        return "outline";
    }
  };

  return (
    <div className={className} data-testid="harassment-analyzer">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5" />
            <span data-testid="text-analyzer-title">Harassment Content Analyzer</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription data-testid="alert-privacy-notice">
              Content is analyzed securely and encrypted. No data is stored permanently or shared.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div>
              <label htmlFor="content" className="text-sm font-medium mb-2 block">
                Content to Analyze *
              </label>
              <Textarea
                id="content"
                placeholder="Paste the suspicious message, comment, or content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[120px] secure-input"
                disabled={isAnalyzing}
                data-testid="textarea-content"
              />
            </div>

            <div>
              <label htmlFor="context" className="text-sm font-medium mb-2 block">
                Additional Context (Optional)
              </label>
              <Textarea
                id="context"
                placeholder="Provide context about the situation, relationship, or pattern of behavior..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="min-h-[80px]"
                disabled={isAnalyzing}
                data-testid="textarea-context"
              />
            </div>
          </div>

          <Button 
            onClick={handleAnalyze}
            disabled={!content.trim() || isAnalyzing}
            className="w-full"
            data-testid="button-analyze"
          >
            {isAnalyzing ? "Analyzing..." : "Analyze Content"}
          </Button>

          {result && (
            <div className="space-y-4 border-t pt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold" data-testid="text-analysis-results">Analysis Results</h3>
                <Badge 
                  variant={getThreatBadgeVariant(result.threatLevel)}
                  data-testid="badge-threat-level"
                >
                  {result.threatLevel.toUpperCase()} THREAT
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2" data-testid="text-threat-assessment">Threat Assessment</h4>
                  <div className={`flex items-center space-x-2 ${getThreatColor(result.threatLevel)}`}>
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-medium">{result.threatLevel.toUpperCase()}</span>
                    <span className="text-sm text-muted-foreground">
                      ({Math.round(result.confidence * 100)}% confidence)
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2" data-testid="text-categories">Categories Detected</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.categories.length > 0 ? (
                      result.categories.map((category, index) => (
                        <Badge key={index} variant="outline" data-testid={`badge-category-${index}`}>
                          {category}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">No concerning patterns detected</span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2" data-testid="text-explanation">AI Analysis</h4>
                <p className="text-sm text-muted-foreground" data-testid="text-explanation-content">
                  {result.explanation}
                </p>
              </div>

              {result.evidencePoints.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2" data-testid="text-evidence">Evidence Points</h4>
                  <ul className="text-sm space-y-1">
                    {result.evidencePoints.map((point, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-destructive">•</span>
                        <span data-testid={`text-evidence-point-${index}`}>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.recommendations.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2" data-testid="text-recommendations">Recommended Actions</h4>
                  <ul className="text-sm space-y-1">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-primary">•</span>
                        <span data-testid={`text-recommendation-${index}`}>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" data-testid="button-generate-report">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowContent(!showContent)}
                  data-testid="button-toggle-content"
                >
                  {showContent ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                  {showContent ? "Hide" : "Show"} Original Content
                </Button>
              </div>

              {showContent && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h5 className="text-sm font-medium mb-2">Original Content:</h5>
                  <p className="text-sm whitespace-pre-wrap" data-testid="text-original-content">
                    {content}
                  </p>
                  {context && (
                    <>
                      <h5 className="text-sm font-medium mb-2 mt-4">Context:</h5>
                      <p className="text-sm whitespace-pre-wrap" data-testid="text-original-context">
                        {context}
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
