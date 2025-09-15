import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, ExternalLink, Eye } from "lucide-react";

interface PrivacyRisk {
  type: string;
  severity: "low" | "medium" | "high";
  description: string;
  recommendation: string;
  platform: string;
}

interface PrivacyAuditCardProps {
  audit: {
    id: string;
    platform: string;
    findings: PrivacyRisk[];
    riskLevel: "low" | "medium" | "high";
    recommendations: string[];
    createdAt: string;
  };
  onViewDetails?: (auditId: string) => void;
  onDownload?: (auditId: string) => void;
}

export default function PrivacyAuditCard({ audit, onViewDetails, onDownload }: PrivacyAuditCardProps) {
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

  const getRiskIcon = (severity: string) => {
    switch (severity) {
      case "high":
      case "medium":
        return <AlertTriangle className="h-4 w-4" />;
      case "low":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  return (
    <Card data-testid={`privacy-audit-card-${audit.id}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <span data-testid={`text-platform-${audit.id}`}>
              {audit.platform.charAt(0).toUpperCase() + audit.platform.slice(1)} Audit
            </span>
            <Badge 
              variant={getRiskBadgeVariant(audit.riskLevel)}
              data-testid={`badge-risk-level-${audit.id}`}
            >
              {audit.riskLevel.toUpperCase()} RISK
            </Badge>
          </CardTitle>
          <span className="text-sm text-muted-foreground" data-testid={`text-date-${audit.id}`}>
            {new Date(audit.createdAt).toLocaleDateString()}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-3" data-testid={`text-findings-title-${audit.id}`}>
              Privacy Issues Found ({audit.findings.length})
            </h4>
            <div className="space-y-2">
              {audit.findings.slice(0, 3).map((finding, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className={getRiskColor(finding.severity)}>
                      {getRiskIcon(finding.severity)}
                    </div>
                    <div>
                      <div className="font-medium text-sm" data-testid={`text-finding-description-${audit.id}-${index}`}>
                        {finding.description}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {finding.recommendation}
                      </div>
                    </div>
                  </div>
                  <Badge 
                    variant={getRiskBadgeVariant(finding.severity)}
                    data-testid={`badge-finding-severity-${audit.id}-${index}`}
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
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onViewDetails?.(audit.id)}
              data-testid={`button-view-details-${audit.id}`}
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onDownload?.(audit.id)}
              data-testid={`button-download-${audit.id}`}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Download Report
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
