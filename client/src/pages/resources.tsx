import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { HeartHandshake, Phone, MapPin, Scale, Users, Search, ExternalLink, AlertTriangle, Clock } from "lucide-react";

export default function Resources() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("national");

  const categories = [
    { id: "all", name: "All Resources", icon: HeartHandshake },
    { id: "crisis", name: "Crisis Hotlines", icon: Phone },
    { id: "legal", name: "Legal Aid", icon: Scale },
    { id: "support", name: "Support Groups", icon: Users },
    { id: "local", name: "Local Services", icon: MapPin },
  ];

  const resources = [
    {
      id: "women-helpline",
      name: "Women Helpline (National)",
      category: "crisis",
      type: "24/7 Helpline",
      contact: "181",
      website: "https://wcd.nic.in/schemes/women-helpline-scheme",
      description: "National helpline for women in distress, providing immediate assistance and support.",
      location: "national",
      available: "24/7",
      languages: ["Hindi", "English", "Regional languages"],
      services: ["Crisis counseling", "Emergency assistance", "Legal guidance", "Shelter referrals"]
    },
    {
      id: "ncw-helpline",
      name: "National Commission for Women Helpline",
      category: "crisis",
      type: "24/7 Helpline",
      contact: "7827170170",
      website: "http://ncw.nic.in/",
      description: "NCW helpline for reporting complaints related to women's rights violations.",
      location: "national",
      available: "24/7",
      languages: ["Hindi", "English"],
      services: ["Complaint registration", "Legal assistance", "Investigation support", "Counseling"]
    },
    {
      id: "police-women-helpline",
      name: "Police Women/Senior Citizen Helpline",
      category: "crisis",
      type: "Emergency Helpline",
      contact: "1091",
      website: "https://www.indiacode.nic.in/",
      description: "Police helpline specifically for women and senior citizens in emergency situations.",
      location: "national",
      available: "24/7",
      languages: ["Hindi", "English", "Regional languages"],
      services: ["Emergency response", "Police assistance", "Immediate protection", "FIR registration"]
    },
    {
      id: "childline",
      name: "CHILDLINE India",
      category: "crisis",
      type: "24/7 Helpline",
      contact: "1098",
      website: "https://www.childlineindia.org/",
      description: "Free emergency phone service for children in need of care and protection.",
      location: "national",
      available: "24/7",
      languages: ["Hindi", "English", "Regional languages"],
      services: ["Child protection", "Emergency response", "Counseling", "Shelter services"]
    },
    {
      id: "cyber-crime-helpline",
      name: "Cyber Crime Helpline",
      category: "crisis",
      type: "24/7 Helpline",
      contact: "1930",
      website: "https://cybercrime.gov.in/",
      description: "National helpline for reporting cyber crimes including online harassment and stalking.",
      location: "national",
      available: "24/7",
      languages: ["Hindi", "English"],
      services: ["Cyber crime reporting", "Online harassment support", "Digital evidence guidance", "Legal assistance"]
    },
    {
      id: "legal-services-authority",
      name: "National Legal Services Authority (NALSA)",
      category: "legal",
      type: "Legal Aid",
      contact: "011-23384457",
      website: "https://nalsa.gov.in/",
      description: "Free legal aid and services for women, especially those from marginalized communities.",
      location: "national",
      available: "Business hours",
      languages: ["Hindi", "English", "Regional languages"],
      services: ["Free legal aid", "Court representation", "Legal awareness", "Mediation services"]
    },
    {
      id: "state-women-commission",
      name: "State Women Commissions",
      category: "legal",
      type: "Government Body",
      contact: "Varies by state",
      website: "https://wcd.nic.in/",
      description: "State-level commissions addressing women's rights and gender-based violence.",
      location: "local",
      available: "Business hours",
      languages: ["Hindi", "English", "Regional languages"],
      services: ["Complaint redressal", "Legal support", "Policy advocacy", "Awareness programs"]
    },
    {
      id: "one-stop-centres",
      name: "One Stop Centres (Sakhi Centres)",
      category: "support",
      type: "Integrated Support",
      contact: "181 for referral",
      website: "https://wcd.nic.in/schemes/one-stop-centre-scheme-1",
      description: "Integrated support and assistance to women affected by violence.",
      location: "local",
      available: "24/7",
      languages: ["Hindi", "English", "Regional languages"],
      services: ["Medical aid", "Police assistance", "Legal counseling", "Psycho-social support", "Temporary shelter"]
    },
    {
      id: "swadhar-greh",
      name: "Swadhar Greh",
      category: "local",
      type: "Shelter Homes",
      contact: "Contact local district collector",
      website: "https://wcd.nic.in/schemes/swadhar-greh",
      description: "Shelter homes for women in difficult circumstances including domestic violence survivors.",
      location: "local",
      available: "24/7 intake",
      languages: ["Hindi", "English", "Regional languages"],
      services: ["Temporary accommodation", "Food and clothing", "Medical care", "Counseling", "Skill development"]
    },
    {
      id: "mahila-police-stations",
      name: "Mahila Police Stations",
      category: "legal",
      type: "Specialized Police Stations",
      contact: "100 or local police",
      website: "https://www.indiacode.nic.in/",
      description: "All-women police stations to handle crimes against women with sensitivity.",
      location: "local",
      available: "24/7",
      languages: ["Hindi", "English", "Regional languages"],
      services: ["FIR registration", "Investigation", "Counseling", "Legal guidance", "Protection orders"]
    },
    {
      id: "nirbhaya-fund-schemes",
      name: "Nirbhaya Fund Schemes",
      category: "support",
      type: "Government Schemes",
      contact: "Contact local authorities",
      website: "https://wcd.nic.in/",
      description: "Various schemes under Nirbhaya Fund for women's safety and empowerment.",
      location: "national",
      available: "Business hours",
      languages: ["Hindi", "English", "Regional languages"],
      services: ["Safety initiatives", "Skill development", "Economic empowerment", "Legal aid", "Counseling services"]
    },
    {
      id: "women-helpdesk-courts",
      name: "Women Help Desks in Courts",
      category: "legal",
      type: "Court Services",
      contact: "Contact local court",
      website: "https://doj.gov.in/",
      description: "Special help desks in courts to assist women with legal procedures.",
      location: "local",
      available: "Court hours",
      languages: ["Hindi", "English", "Regional languages"],
      services: ["Legal guidance", "Court procedures", "Documentation help", "Referral services"]
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = searchTerm === "" || 
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
    const matchesLocation = selectedLocation === "all" || resource.location === selectedLocation;
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.icon : HeartHandshake;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "crisis": return "text-red-600";
      case "legal": return "text-blue-600";
      case "support": return "text-green-600";
      case "local": return "text-purple-600";
      default: return "text-primary";
    }
  };

  const getBadgeVariant = (category: string) => {
    switch (category) {
      case "crisis": return "destructive";
      case "legal": return "default";
      case "support": return "secondary";
      case "local": return "outline";
      default: return "outline";
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="resources-page">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4" data-testid="page-title">Support Resources</h1>
          <p className="text-xl text-muted-foreground" data-testid="page-description">
            Anonymous directory of domestic violence, stalking, and harassment support resources
          </p>
        </div>

        {/* Emergency Alert */}
        <Alert className="mb-8 border-destructive/50 bg-destructive/5">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive" data-testid="alert-emergency">
            <strong>In immediate danger?</strong> Call 100 (Police) or 108 (Emergency Services). For women's helpline, call <strong>181</strong> or NCW helpline <strong>7827170170</strong>.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="directory" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="directory" data-testid="tab-directory">Resource Directory</TabsTrigger>
            <TabsTrigger value="crisis" data-testid="tab-crisis">Crisis Support</TabsTrigger>
            <TabsTrigger value="safety" data-testid="tab-safety">Safety Planning</TabsTrigger>
          </TabsList>

          <TabsContent value="directory" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="h-5 w-5" />
                  <span data-testid="text-find-resources">Find Resources</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search resources, services, or keywords..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      data-testid="input-search-resources"
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-2 border border-border rounded-md"
                      data-testid="select-category"
                    >
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="px-3 py-2 border border-border rounded-md"
                      data-testid="select-location"
                    >
                      <option value="all">All Locations</option>
                      <option value="national">National</option>
                      <option value="local">Local</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resource Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredResources.map((resource) => {
                const IconComponent = getCategoryIcon(resource.category);
                return (
                  <Card key={resource.id} className="h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg bg-muted ${getCategoryColor(resource.category)}`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle className="text-lg" data-testid={`text-resource-name-${resource.id}`}>
                              {resource.name}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {resource.type}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Badge variant={getBadgeVariant(resource.category)} data-testid={`badge-category-${resource.id}`}>
                            {categories.find(c => c.id === resource.category)?.name}
                          </Badge>
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span data-testid={`text-availability-${resource.id}`}>{resource.available}</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground" data-testid={`text-description-${resource.id}`}>
                        {resource.description}
                      </p>

                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-primary" />
                          <span className="font-medium text-lg" data-testid={`text-contact-${resource.id}`}>
                            {resource.contact}
                          </span>
                        </div>

                        {resource.website && (
                          <div className="flex items-center space-x-2">
                            <ExternalLink className="h-4 w-4 text-primary" />
                            <a 
                              href={resource.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline text-sm"
                              data-testid={`link-website-${resource.id}`}
                            >
                              Visit Website
                            </a>
                          </div>
                        )}

                        {resource.languages && (
                          <div>
                            <h4 className="text-sm font-medium mb-1">Languages Available:</h4>
                            <p className="text-xs text-muted-foreground">
                              {resource.languages.join(", ")}
                            </p>
                          </div>
                        )}

                        <div>
                          <h4 className="text-sm font-medium mb-2" data-testid={`text-services-${resource.id}`}>Services:</h4>
                          <div className="flex flex-wrap gap-1">
                            {resource.services.map((service, index) => (
                              <Badge key={index} variant="outline" className="text-xs" data-testid={`badge-service-${resource.id}-${index}`}>
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredResources.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2" data-testid="text-no-resources">No resources found</h3>
                  <p className="text-muted-foreground">Try adjusting your search terms or filters.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="crisis" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-destructive/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-destructive">
                    <Phone className="h-5 w-5" />
                    <span data-testid="text-immediate-help">Immediate Help</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-4 bg-destructive/10 rounded-lg">
                      <h3 className="font-medium mb-2" data-testid="text-emergency-services">Emergency Services</h3>
                      <p className="text-2xl font-bold text-destructive">100</p>
                      <p className="text-sm text-muted-foreground">Police Emergency</p>
                    </div>

                    <div className="p-4 bg-primary/10 rounded-lg">
                      <h3 className="font-medium mb-2" data-testid="text-women-helpline">Women Helpline</h3>
                      <p className="text-xl font-bold text-primary">181</p>
                      <p className="text-sm text-muted-foreground">24/7 women in distress</p>
                    </div>

                    <div className="p-4 bg-secondary/10 rounded-lg">
                      <h3 className="font-medium mb-2" data-testid="text-ncw-helpline">NCW Helpline</h3>
                      <p className="text-xl font-bold text-secondary">7827170170</p>
                      <p className="text-sm text-muted-foreground">National Commission for Women</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle data-testid="text-online-support">Online Support</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-4 border border-border rounded-lg">
                      <h3 className="font-medium mb-2">Cyber Crime Helpline</h3>
                      <p className="text-lg font-bold">1930</p>
                      <p className="text-sm text-muted-foreground">24/7 cyber crime reporting</p>
                    </div>

                    <div className="p-4 border border-border rounded-lg">
                      <h3 className="font-medium mb-2">Women/Senior Citizen Helpline</h3>
                      <p className="text-lg font-bold">1091</p>
                      <p className="text-sm text-muted-foreground">Police helpline for women</p>
                    </div>

                    <div className="p-4 border border-border rounded-lg">
                      <h3 className="font-medium mb-2">Child Helpline</h3>
                      <p className="text-lg font-bold">1098</p>
                      <p className="text-sm text-muted-foreground">24/7 child protection services</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="safety" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle data-testid="text-safety-planning">Safety Planning Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-4 text-destructive" data-testid="text-immediate-safety">Immediate Safety</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Identify safe areas in your home with exits and no weapons</li>
                      <li>• Practice escape routes and teach them to your children</li>
                      <li>• Keep important documents in a safe, accessible place</li>
                      <li>• Establish code words with family and friends for emergencies</li>
                      <li>• Keep a bag packed with essentials in a safe location</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium mb-4 text-primary" data-testid="text-digital-safety">Digital Safety</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Change passwords on all accounts regularly</li>
                      <li>• Check devices for tracking software or apps</li>
                      <li>• Use secure communication methods</li>
                      <li>• Be cautious about location sharing on social media</li>
                      <li>• Consider getting a separate phone for safety</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium mb-4 text-secondary" data-testid="text-emotional-support">Emotional Support</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Connect with trusted friends and family</li>
                      <li>• Consider counseling or therapy</li>
                      <li>• Join support groups for survivors</li>
                      <li>• Practice self-care and stress management</li>
                      <li>• Document incidents for legal purposes</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium mb-4 text-green-600" data-testid="text-legal-protection">Legal Protection</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Learn about restraining orders and protection orders</li>
                      <li>• Contact local legal aid organizations</li>
                      <li>• Keep copies of important legal documents</li>
                      <li>• Document all incidents with dates and details</li>
                      <li>• Know your rights and available legal remedies</li>
                    </ul>
                  </div>
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription data-testid="alert-safety-reminder">
                    Remember: Safety planning is ongoing and personal. What works for one person may not work for another. Trust your instincts and prioritize your safety above all else.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
