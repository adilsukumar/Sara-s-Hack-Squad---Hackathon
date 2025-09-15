import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Fingerprint, Search, Globe, Database, AlertTriangle, CheckCircle, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FootprintData {
  source: string;
  type: string;
  description: string;
  riskLevel: "low" | "medium" | "high";
  recommendation: string;
}

interface FootprintReport {
  publicDataFound: FootprintData[];
  summary: string;
  overallRisk: "low" | "medium" | "high";
}

export default function DigitalFootprint() {
  const [searchTerms, setSearchTerms] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [report, setReport] = useState<FootprintReport | null>(null);
  const [scanTimestamp, setScanTimestamp] = useState<string>("");
  const { toast } = useToast();

  const handleDownloadReport = () => {
    if (!report || !scanTimestamp) return;

    const reportContent = {
      title: "Digital Footprint Report",
      searchTerms,
      scanDate: new Date(scanTimestamp).toLocaleString(),
      overallRisk: report.overallRisk,
      summary: report.summary,
      publicDataFound: report.publicDataFound,
      recommendations: report.publicDataFound.map(item => item.recommendation)
    };

    const blob = new Blob([JSON.stringify(reportContent, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `digital-footprint-report-${new Date(scanTimestamp).toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Report Downloaded",
      description: "Your digital footprint report has been saved.",
    });
  };

  const handleStartScan = async () => {
    if (!searchTerms.trim()) {
      toast({
        title: "Search Terms Required",
        description: "Please enter your name or information to search for.",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    setReport(null);

    try {
      // Simulate progressive scanning
      const progressSteps = [
        { step: 20, message: "Searching public databases..." },
        { step: 40, message: "Analyzing social media presence..." },
        { step: 60, message: "Checking data broker sites..." },
        { step: 80, message: "Scanning search engine results..." },
        { step: 100, message: "Generating report..." }
      ];

      for (const { step, message } of progressSteps) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setScanProgress(step);
        toast({
          title: message,
          description: `Scan progress: ${step}%`,
        });
      }

      const response = await fetch('/api/digital-footprint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchTerms }),
      });

      if (response.ok) {
        const reportData = await response.json();
        setReport(reportData);
        setScanTimestamp(new Date().toISOString());
        toast({
          title: "Footprint Scan Complete",
          description: "Your digital footprint analysis is ready.",
        });
      } else {
        throw new Error('Scan failed');
      }
    } catch (error) {
      toast({
        title: "Scan Failed",
        description: "Unable to complete digital footprint scan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
      setScanProgress(0);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high": return "text-destructive";
      case "medium": return "text-orange-600";
      case "low": return "text-green-600";
      default: return "text-muted-foreground";
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "high": return <AlertTriangle className="h-4 w-4" />;
      case "medium": return <AlertTriangle className="h-4 w-4" />;
      case "low": return <CheckCircle className="h-4 w-4" />;
      default: return <Search className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="digital-footprint-page">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4" data-testid="page-title">Digital Footprint Scanner</h1>
          <p className="text-xl text-muted-foreground" data-testid="page-description">
            Discover what information about you is publicly accessible across the internet
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Fingerprint className="h-5 w-5" />
                <span data-testid="text-scan-title">Start Digital Footprint Scan</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="search-terms" data-testid="label-search-terms">
                  Search Information *
                </Label>
                <Input
                  id="search-terms"
                  placeholder="Enter your full name, email, or username"
                  value={searchTerms}
                  onChange={(e) => setSearchTerms(e.target.value)}
                  disabled={isScanning}
                  data-testid="input-search-terms"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  We'll search for this information across public databases, social media, and data broker sites
                </p>
              </div>

              <div className="bg-muted/50 border border-border rounded-lg p-6">
                <h3 className="font-semibold mb-4 flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-primary" />
                  <span data-testid="text-what-we-scan">What We Scan</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Search className="h-4 w-4 text-secondary" />
                      <span>Search Engine Results</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Database className="h-4 w-4 text-secondary" />
                      <span>Public Records</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-secondary" />
                      <span>Social Media Platforms</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Database className="h-4 w-4 text-secondary" />
                      <span>Data Broker Sites</span>
                    </div>
                  </div>
                </div>
              </div>

              {isScanning && (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="inline-flex items-center space-x-2 text-muted-foreground">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      <span data-testid="text-scanning">Scanning digital footprint...</span>
                    </div>
                  </div>
                  <Progress value={scanProgress} className="w-full" />
                  <p className="text-sm text-muted-foreground text-center">
                    This comprehensive scan may take several minutes to complete.
                  </p>
                </div>
              )}

              <Button 
                onClick={handleStartScan}
                disabled={!searchTerms.trim() || isScanning}
                className="w-full"
                size="lg"
                data-testid="button-start-scan"
              >
                {isScanning ? "Scanning..." : "Start Footprint Scan"}
              </Button>
            </CardContent>
          </Card>

          {report && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <span data-testid="text-scan-results">Scan Results</span>
                  </CardTitle>
                  <Badge 
                    variant={report.overallRisk === "high" ? "destructive" : 
                            report.overallRisk === "medium" ? "secondary" : "default"}
                    data-testid="badge-overall-risk"
                  >
                    {report.overallRisk.toUpperCase()} RISK
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/50 border border-border rounded-lg p-4">
                  <h4 className="font-medium mb-2" data-testid="text-summary-title">Summary</h4>
                  <p className="text-sm text-muted-foreground" data-testid="text-summary">{report.summary}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-4" data-testid="text-public-data">
                    Public Data Found ({report.publicDataFound.length} items)
                  </h4>
                  <div className="space-y-3">
                    {report.publicDataFound.map((item, index) => (
                      <div 
                        key={index}
                        className="flex items-start justify-between p-4 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-start space-x-3 flex-1">
                          <div className={getRiskColor(item.riskLevel)}>
                            {getRiskIcon(item.riskLevel)}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm mb-1" data-testid={`text-data-item-${index}`}>
                              {item.type} - {item.source}
                            </div>
                            <div className="text-sm text-muted-foreground mb-2">
                              {item.description}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              <strong>Recommendation:</strong> {item.recommendation}
                            </div>
                          </div>
                        </div>
                        <Badge 
                          variant={item.riskLevel === "high" ? "destructive" : 
                                  item.riskLevel === "medium" ? "secondary" : "default"}
                          data-testid={`badge-item-risk-${index}`}
                        >
                          {item.riskLevel}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" onClick={handleDownloadReport} data-testid="button-download-report">
                    Download Full Report
                  </Button>
                  <Button variant="outline" data-testid="button-removal-guide">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Data Removal Guide
                  </Button>
                  <Button data-testid="button-new-scan" onClick={() => {
                    setReport(null);
                    setScanTimestamp("");
                    setSearchTerms("");
                  }}>
                    Start New Scan
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
