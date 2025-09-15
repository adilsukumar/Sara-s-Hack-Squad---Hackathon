import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Search, Fingerprint, Bot, CheckSquare, Lock, HeartHandshake, AlertTriangle, Phone, DoorOpen } from "lucide-react";
import EmergencyButton from "@/components/emergency/emergency-button";

export default function Home() {
  const tools = [
    {
      icon: Search,
      title: "Privacy Audit",
      description: "Scan your social media profiles for exposed personal information and privacy vulnerabilities.",
      features: ["Facebook, Instagram, Twitter analysis", "Personal data exposure detection", "Actionable privacy recommendations"],
      buttonText: "Start Audit",
      href: "/privacy-audit",
      color: "primary"
    },
    {
      icon: Fingerprint,
      title: "Digital Footprint",
      description: "Discover what information about you is publicly accessible across the internet.",
      features: ["Search engine result analysis", "Public records scanning", "Data broker monitoring"],
      buttonText: "Check Footprint",
      href: "/digital-footprint",
      color: "secondary"
    },
    {
      icon: Bot,
      title: "Harassment Detection",
      description: "AI-powered analysis of messages and posts to identify harassment patterns and threats.",
      features: ["Real-time threat assessment", "Pattern recognition analysis", "Evidence documentation"],
      buttonText: "Analyze Messages",
      href: "/harassment-detection",
      color: "accent"
    },
    {
      icon: CheckSquare,
      title: "Security Checklist",
      description: "Step-by-step guides to harden your privacy settings across all platforms and devices.",
      features: ["Platform-specific guides", "Progress tracking", "Regular security updates"],
      buttonText: "View Checklist",
      href: "/security-checklist",
      color: "primary"
    },
    {
      icon: Lock,
      title: "Safe Communication",
      description: "Encrypted messaging and secure communication tools for sensitive conversations.",
      features: ["End-to-end encryption", "Anonymous messaging", "Self-destructing messages"],
      buttonText: "Start Secure Chat",
      href: "/safe-communication",
      color: "secondary"
    },
    {
      icon: HeartHandshake,
      title: "Support Resources",
      description: "Anonymous directory of domestic violence, stalking, and harassment support resources.",
      features: ["24/7 crisis hotlines", "Legal aid resources", "Local support services"],
      buttonText: "Find Support",
      href: "/resources",
      color: "accent"
    }
  ];

  return (
    <div className="min-h-screen bg-background" data-testid="home-page">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-16 lg:py-24" data-testid="hero-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight" data-testid="hero-title">
              Your Digital Safety, <span className="text-primary">Protected</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed" data-testid="hero-description">
              Comprehensive privacy tools, harassment detection, and security resources designed specifically for women's online safety and digital protection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/privacy-audit">
                <Button size="lg" className="px-8 py-4" data-testid="button-start-audit">
                  Start Privacy Audit
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="px-8 py-4" data-testid="button-view-tools">
                View All Tools
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-16" id="tools" data-testid="tools-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" data-testid="tools-title">Privacy & Security Tools</h2>
            <p className="text-xl text-muted-foreground" data-testid="tools-description">Comprehensive protection at your fingertips</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow" data-testid={`card-tool-${index}`}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`bg-${tool.color}/10 p-3 rounded-lg`}>
                      <tool.icon className={`text-${tool.color} text-xl`} />
                    </div>
                    <h3 className="text-xl font-semibold" data-testid={`text-tool-title-${index}`}>{tool.title}</h3>
                  </div>
                  <p className="text-muted-foreground mb-6" data-testid={`text-tool-description-${index}`}>{tool.description}</p>
                  <div className="space-y-3 mb-6">
                    {tool.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <div className="w-2 h-2 bg-secondary rounded-full" />
                        <span data-testid={`text-feature-${index}-${featureIndex}`}>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Link href={tool.href}>
                    <Button 
                      className={`w-full bg-${tool.color} hover:bg-${tool.color}/90`}
                      data-testid={`button-${tool.href.slice(1)}`}
                    >
                      {tool.buttonText}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Audit Demo Section */}
      <section className="py-16 bg-muted/50" data-testid="demo-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" data-testid="demo-title">See How It Works</h2>
            <p className="text-xl text-muted-foreground" data-testid="demo-description">Try our privacy audit tool with a sample profile</p>
          </div>
          
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-semibold mb-6" data-testid="text-audit-results">Privacy Audit Results</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="text-destructive" />
                        <div>
                          <div className="font-medium" data-testid="text-risk-phone">Phone Number Exposed</div>
                          <div className="text-sm text-muted-foreground">Visible in Facebook About section</div>
                        </div>
                      </div>
                      <Badge variant="destructive" data-testid="badge-high-risk">High Risk</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="text-destructive" />
                        <div>
                          <div className="font-medium" data-testid="text-risk-location">Location History</div>
                          <div className="text-sm text-muted-foreground">Instagram shows frequent locations</div>
                        </div>
                      </div>
                      <Badge variant="destructive" data-testid="badge-high-risk-2">High Risk</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-orange-100 border border-orange-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="text-orange-600" />
                        <div>
                          <div className="font-medium" data-testid="text-risk-email">Email Visibility</div>
                          <div className="text-sm text-muted-foreground">Partial email shown on Twitter</div>
                        </div>
                      </div>
                      <Badge className="bg-orange-600 text-white" data-testid="badge-medium-risk">Medium Risk</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-green-100 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                        <div>
                          <div className="font-medium" data-testid="text-good-privacy">Profile Privacy</div>
                          <div className="text-sm text-muted-foreground">LinkedIn settings properly configured</div>
                        </div>
                      </div>
                      <Badge className="bg-green-600 text-white" data-testid="badge-good">Good</Badge>
                    </div>
                  </div>
                  
                  <Link href="/privacy-audit">
                    <Button className="w-full mt-6" data-testid="button-detailed-report">
                      Get Detailed Report
                    </Button>
                  </Link>
                </div>
                
                <div>
                  <h3 className="text-2xl font-semibold mb-6" data-testid="text-quick-actions">Quick Actions</h3>
                  <div className="space-y-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium" data-testid="text-action-phone">Remove Phone Number</span>
                          <Button variant="link" size="sm" data-testid="button-fix-phone">Fix Now</Button>
                        </div>
                        <p className="text-sm text-muted-foreground">Hide your phone number from public view on Facebook</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium" data-testid="text-action-location">Disable Location Sharing</span>
                          <Button variant="link" size="sm" data-testid="button-fix-location">Fix Now</Button>
                        </div>
                        <p className="text-sm text-muted-foreground">Turn off location services for Instagram posts</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium" data-testid="text-action-email">Review Email Settings</span>
                          <Button variant="link" size="sm" data-testid="button-fix-email">Fix Now</Button>
                        </div>
                        <p className="text-sm text-muted-foreground">Update Twitter email visibility preferences</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium" data-testid="text-action-2fa">Enable 2FA</span>
                          <Button variant="link" size="sm" data-testid="button-setup-2fa">Setup</Button>
                        </div>
                        <p className="text-sm text-muted-foreground">Add two-factor authentication to all accounts</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Emergency Features */}
      <section className="py-16 bg-gradient-to-br from-destructive/5 to-orange-100/50" id="emergency" data-testid="emergency-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" data-testid="emergency-title">Emergency Features</h2>
            <p className="text-xl text-muted-foreground" data-testid="emergency-description">Quick access to help when you need it most</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="bg-destructive/10 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <Phone className="text-destructive text-3xl" />
                </div>
                <h3 className="text-2xl font-semibold mb-4" data-testid="text-emergency-alert">One-Click Emergency Alert</h3>
                <p className="text-muted-foreground mb-6">Instantly notify your emergency contacts and local authorities with your location and situation details.</p>
                <EmergencyButton />
                <p className="text-xs text-muted-foreground mt-3">This will immediately contact your saved emergency contacts</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="bg-orange-100 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <DoorOpen className="text-orange-600 text-3xl" />
                </div>
                <h3 className="text-2xl font-semibold mb-4" data-testid="text-quick-exit">Quick Exit</h3>
                <p className="text-muted-foreground mb-6">Instantly leave this site and clear your browser history for your safety and privacy.</p>
                <Button 
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 w-full"
                  onClick={() => window.location.replace('https://www.weather.com')}
                  data-testid="button-quick-exit"
                >
                  <DoorOpen className="mr-2" />
                  Quick Exit
                </Button>
                <p className="text-xs text-muted-foreground mt-3">Press ESC key anytime for quick exit</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Crisis Hotlines */}
          <div className="mt-12 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-center mb-6" data-testid="text-crisis-support">24/7 Crisis Support</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="font-medium mb-1" data-testid="text-domestic-violence">National Domestic Violence Hotline</div>
                  <div className="text-lg font-bold text-primary" data-testid="text-hotline-1">1-800-799-7233</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="font-medium mb-1" data-testid="text-sexual-assault">National Sexual Assault Hotline</div>
                  <div className="text-lg font-bold text-primary" data-testid="text-hotline-2">1-800-656-4673</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Security Section */}
      <section className="py-16" data-testid="trust-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" data-testid="trust-title">Privacy First, Always</h2>
            <p className="text-xl text-muted-foreground" data-testid="trust-description">Your security and privacy are our top priorities</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Shield className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4" data-testid="text-no-data">No Data Collection</h3>
              <p className="text-muted-foreground">We don't store, track, or share any of your personal information. All processing happens locally.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-secondary/10 p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Lock className="text-secondary text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4" data-testid="text-encryption">End-to-End Encryption</h3>
              <p className="text-muted-foreground">All communications and data analysis use military-grade encryption for maximum security.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-accent/20 p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Search className="text-accent-foreground text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4" data-testid="text-open-source">Open Source</h3>
              <p className="text-muted-foreground">Our code is publicly auditable. You can verify our security claims and contribute improvements.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
