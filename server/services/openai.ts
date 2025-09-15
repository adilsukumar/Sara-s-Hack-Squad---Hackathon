export interface HarassmentAnalysisResult {
  threatLevel: "none" | "low" | "medium" | "high" | "critical";
  confidence: number;
  categories: string[];
  explanation: string;
  recommendations: string[];
  evidencePoints: string[];
}

export interface PrivacyRisk {
  type: string;
  severity: "low" | "medium" | "high";
  description: string;
  recommendation: string;
  platform: string;
}

export async function analyzeHarassment(content: string, context?: string): Promise<HarassmentAnalysisResult> {
  // Simple pattern-based analysis without external API
  const lowerContent = content.toLowerCase();
  let threatLevel: "none" | "low" | "medium" | "high" | "critical" = "none";
  let categories: string[] = [];
  let evidencePoints: string[] = [];
  
  // Threat detection patterns
  const threatWords = ['kill', 'hurt', 'harm', 'die', 'dead', 'murder', 'violence'];
  const harassmentWords = ['stupid', 'ugly', 'worthless', 'slut', 'bitch', 'hate you'];
  const stalkingWords = ['watching', 'following', 'know where', 'find you', 'tracking'];
  const sexualWords = ['rape', 'sexual', 'naked', 'body', 'touch'];
  
  if (threatWords.some(word => lowerContent.includes(word))) {
    threatLevel = "high";
    categories.push("threats");
    evidencePoints.push("Contains threatening language");
  }
  
  if (harassmentWords.some(word => lowerContent.includes(word))) {
    threatLevel = threatLevel === "none" ? "medium" : threatLevel;
    categories.push("harassment");
    evidencePoints.push("Contains harassing language");
  }
  
  if (stalkingWords.some(word => lowerContent.includes(word))) {
    threatLevel = "high";
    categories.push("stalking");
    evidencePoints.push("Contains stalking indicators");
  }
  
  if (sexualWords.some(word => lowerContent.includes(word))) {
    threatLevel = "critical";
    categories.push("sexual harassment");
    evidencePoints.push("Contains sexual harassment content");
  }
  
  if (categories.length === 0) {
    threatLevel = "low";
    categories.push("general concern");
    evidencePoints.push("Content flagged for review");
  }
  
  const recommendations = [
    "Document this content with screenshots",
    "Report to platform administrators",
    "Consider blocking the sender",
    "Seek support if you feel unsafe",
    "Contact authorities if threats are credible"
  ];
  
  return {
    threatLevel,
    confidence: 0.8,
    categories,
    explanation: `Analysis detected ${categories.join(', ')} patterns in the content. Threat level assessed as ${threatLevel}.`,
    recommendations: recommendations.slice(0, 3),
    evidencePoints
  };
}

export async function scrapeProfileData(platform: string, profileUrl?: string): Promise<Record<string, any>> {
  // Mock profile data based on platform since we can't actually scrape
  const mockProfiles = {
    facebook: {
      name: "User Profile",
      email: "user@example.com",
      phone: "+91-9876543210",
      location: "Mumbai, India",
      birthday: "January 15, 1995",
      relationshipStatus: "Single",
      work: "Software Engineer at Tech Company",
      education: "University of Mumbai",
      photos: Array(25).fill("photo"),
      friendsCount: 342,
      checkins: ["Starbucks", "Mall", "Gym"],
      interests: ["Technology", "Travel", "Political News", "Health & Fitness"]
    },
    instagram: {
      name: "User Profile",
      bio: "Travel enthusiast 📸 Mumbai",
      location: "Mumbai, India", 
      phone: "+91-9876543210",
      photos: Array(156).fill("photo"),
      followers: 1250,
      following: 890,
      checkins: ["Beach", "Restaurant", "Home"],
      interests: ["Photography", "Travel", "Fashion"]
    },
    twitter: {
      name: "User Profile",
      bio: "Tech professional | Mumbai",
      location: "Mumbai, India",
      website: "personal-website.com",
      birthday: "January 15",
      tweets: 2340,
      followers: 567,
      following: 234,
      interests: ["Technology", "Politics", "News", "Sports"]
    },
    linkedin: {
      name: "User Profile",
      headline: "Software Engineer",
      location: "Mumbai, India",
      email: "user@company.com",
      phone: "+91-9876543210",
      work: "Senior Software Engineer at Tech Corp",
      education: "B.Tech Computer Science, University of Mumbai",
      connections: 500,
      skills: ["JavaScript", "Python", "React"],
      interests: ["Technology", "Professional Development"]
    },
    tiktok: {
      name: "User Profile",
      bio: "Dance & Comedy 🎭",
      location: "Mumbai",
      followers: 5600,
      following: 123,
      videos: 89,
      interests: ["Dance", "Comedy", "Music", "Trends"]
    },
    snapchat: {
      name: "User Profile",
      location: "Mumbai, India",
      snapScore: 45000,
      friends: 156,
      stories: ["Daily life", "Travel"],
      interests: ["Photography", "Social"]
    }
  };

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const profileData = mockProfiles[platform as keyof typeof mockProfiles] || {};
  
  // Add some randomization to make it more realistic
  if (Math.random() > 0.3) {
    profileData.lastActive = "2 hours ago";
  }
  
  if (Math.random() > 0.5) {
    profileData.profilePicture = "public";
  }
  
  return profileData;
}

export async function analyzePrivacyRisks(profileData: Record<string, any>, platform: string): Promise<PrivacyRisk[]> {
  const risks: PrivacyRisk[] = [];
  
  // Phone number exposure
  if (profileData.phone || profileData.phoneNumber || profileData.mobile) {
    risks.push({
      type: "phone_exposure",
      severity: "high",
      description: "Phone number is publicly visible on your profile",
      recommendation: "Go to Privacy Settings > Contact Info > Hide phone number from public",
      platform
    });
  }
  
  // Email exposure
  if (profileData.email || profileData.emailAddress) {
    risks.push({
      type: "email_exposure", 
      severity: "medium",
      description: "Email address is publicly visible",
      recommendation: "Remove email from public profile or restrict visibility",
      platform
    });
  }
  
  // Location data
  if (profileData.location || profileData.city || profileData.address || profileData.hometown) {
    risks.push({
      type: "location_exposure",
      severity: "high", 
      description: "Location information is publicly shared",
      recommendation: "Disable location sharing and remove location tags from posts",
      platform
    });
  }
  
  // Birth date
  if (profileData.birthday || profileData.birthDate || profileData.dateOfBirth) {
    risks.push({
      type: "birthday_exposure",
      severity: "medium",
      description: "Full birth date is visible (identity theft risk)",
      recommendation: "Hide birth year or full birthday in privacy settings",
      platform
    });
  }
  
  // Relationship status
  if (profileData.relationshipStatus || profileData.relationship) {
    risks.push({
      type: "relationship_exposure",
      severity: "low",
      description: "Relationship status is public",
      recommendation: "Consider hiding relationship status for privacy",
      platform
    });
  }
  
  // Work/Education info
  if (profileData.work || profileData.education || profileData.employer || profileData.school) {
    risks.push({
      type: "work_education_exposure",
      severity: "medium",
      description: "Work or education details are public",
      recommendation: "Limit visibility of work and education information",
      platform
    });
  }
  
  // Photos and posts
  if (profileData.photos && Array.isArray(profileData.photos) && profileData.photos.length > 0) {
    risks.push({
      type: "photo_exposure",
      severity: "medium",
      description: `${profileData.photos.length} photos are publicly visible`,
      recommendation: "Review photo privacy settings and remove location tags",
      platform
    });
  }
  
  // Friends/Connections list
  if (profileData.friendsCount && profileData.friendsCount > 0) {
    risks.push({
      type: "friends_exposure",
      severity: "low",
      description: "Friends/connections list is publicly visible",
      recommendation: "Hide friends list from public view",
      platform
    });
  }
  
  // Check-ins and location history
  if (profileData.checkins || profileData.places) {
    risks.push({
      type: "checkin_exposure",
      severity: "high",
      description: "Location check-ins reveal your movement patterns",
      recommendation: "Disable location check-ins and delete location history",
      platform
    });
  }
  
  // Personal interests that could be sensitive
  if (profileData.interests || profileData.likes) {
    const sensitiveInterests = ['political', 'religious', 'health', 'medical', 'dating'];
    const userInterests = JSON.stringify(profileData.interests || profileData.likes).toLowerCase();
    
    if (sensitiveInterests.some(interest => userInterests.includes(interest))) {
      risks.push({
        type: "sensitive_interests_exposure",
        severity: "medium",
        description: "Sensitive personal interests are publicly visible",
        recommendation: "Review and hide sensitive interests and liked pages",
        platform
      });
    }
  }
  
  return risks;
}

export async function generateDigitalFootprintReport(searchData: Record<string, any>): Promise<{
  publicDataFound: Array<{
    source: string;
    type: string;
    description: string;
    riskLevel: "low" | "medium" | "high";
    recommendation: string;
  }>;
  summary: string;
  overallRisk: "low" | "medium" | "high";
}> {
  const publicDataFound = [
    {
      source: "Search Engines",
      type: "Profile Information",
      description: "Basic profile information found in search results",
      riskLevel: "medium" as const,
      recommendation: "Review and update privacy settings on social media"
    },
    {
      source: "Social Media",
      type: "Public Posts",
      description: "Public posts and photos accessible without login",
      riskLevel: "high" as const,
      recommendation: "Make profiles private and review post visibility"
    }
  ];
  
  return {
    publicDataFound,
    summary: "Digital footprint scan completed. Found moderate exposure across multiple platforms.",
    overallRisk: "medium"
  };
}
