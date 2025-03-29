/**
 * Service for handling LinkedIn profile data and transformations
 */

import { EnhancementOptions, enhanceFullProfile, generateContentRecommendations } from './openai';

export interface LinkedInProfile {
  id?: string;
  firstName: string;
  lastName: string;
  headline?: string;
  summary?: string;
  profilePictureUrl?: string;
  location?: {
    country?: string;
    city?: string;
  };
  experiences?: LinkedInExperience[];
  education?: LinkedInEducation[];
  skills?: string[];
  certifications?: LinkedInCertification[];
  languages?: LinkedInLanguage[];
  projects?: LinkedInProject[];
}

export interface LinkedInExperience {
  title: string;
  company: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  location?: string;
}

export interface LinkedInEducation {
  school: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface LinkedInCertification {
  name: string;
  authority?: string;
  date?: string;
}

export interface LinkedInLanguage {
  language: string;
  proficiency?: string;
}

export interface LinkedInProject {
  name: string;
  description?: string;
  url?: string;
  startDate?: string;
  endDate?: string;
}

// Mock function to simulate fetching a profile from LinkedIn API
// In a real implementation, this would connect to LinkedIn's API
export async function fetchLinkedInProfile(profileUrl: string): Promise<LinkedInProfile> {
  // For demo purposes, parse the LinkedIn URL to extract username
  const username = extractUsernameFromUrl(profileUrl);
  
  // This would be replaced with actual API calls in production
  console.log(`Fetching LinkedIn profile for: ${username}`);
  
  // Simulated delay to mimic API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock data for now
  return {
    firstName: "Sample",
    lastName: "User",
    headline: "Software Engineer",
    summary: "Experienced software engineer with a passion for building scalable applications.",
    skills: ["JavaScript", "React", "Node.js", "TypeScript", "AWS"],
    experiences: [
      {
        title: "Senior Software Engineer",
        company: "Tech Company",
        description: "Led development of cloud-based applications. Implemented CI/CD pipelines and microservices architecture.",
        startDate: "2020-01",
        endDate: "2023-01",
        location: "San Francisco, CA"
      },
      {
        title: "Software Developer",
        company: "Startup Inc",
        description: "Developed front-end components using React and TypeScript. Collaborated with UX designers to implement responsive designs.",
        startDate: "2018-03",
        endDate: "2019-12",
        location: "New York, NY"
      }
    ],
    education: [
      {
        school: "University of Technology",
        degree: "Bachelor of Science",
        fieldOfStudy: "Computer Science",
        startDate: "2014-09",
        endDate: "2018-05"
      }
    ]
  };
}

// Helper function to extract username from LinkedIn URL
function extractUsernameFromUrl(url: string): string {
  try {
    // Simple regex to extract username from LinkedIn URL
    // This is a simplified version and would need to be more robust in production
    const match = url.match(/linkedin\.com\/in\/([^\/]+)/);
    return match ? match[1] : "unknown";
  } catch (error) {
    console.error("Error extracting username from URL:", error);
    return "unknown";
  }
}

/**
 * Processes a LinkedIn profile through the AI enhancement pipeline
 * @param profileData Either a URL string to fetch profile data or a JSON string of profile data
 * @param options Enhancement options
 */
export async function processLinkedInProfile(
  profileData: string | Record<string, any>,
  options?: EnhancementOptions
): Promise<{
  originalProfile: LinkedInProfile;
  enhancedProfile: LinkedInProfile;
  recommendations: Record<string, string[]>;
}> {
  try {
    let originalProfile: LinkedInProfile;
    
    // Check if profileData is a URL or a JSON string/object
    if (typeof profileData === 'string' && (profileData.startsWith('http') || profileData.includes('linkedin.com'))) {
      // Fetch the profile from LinkedIn
      originalProfile = await fetchLinkedInProfile(profileData);
    } else if (typeof profileData === 'string') {
      // Parse the JSON string
      try {
        originalProfile = JSON.parse(profileData) as LinkedInProfile;
      } catch (parseError) {
        throw new Error("Invalid profile data format. Expected a LinkedIn URL or valid JSON.");
      }
    } else {
      // Use the object directly
      originalProfile = profileData as LinkedInProfile;
    }
    
    // Ensure the profile has the minimum required fields
    if (!originalProfile.firstName) {
      originalProfile.firstName = "Unknown";
    }
    if (!originalProfile.lastName) {
      originalProfile.lastName = "User";
    }
    
    // Enhance the profile with AI
    const enhancedProfile = await enhanceFullProfile(originalProfile, options);
    
    // Generate content recommendations
    const recommendations = await generateContentRecommendations(originalProfile);
    
    return {
      originalProfile,
      enhancedProfile: enhancedProfile as LinkedInProfile,
      recommendations
    };
  } catch (error) {
    console.error("Error processing LinkedIn profile:", error);
    throw new Error("Failed to process LinkedIn profile. Please try again later.");
  }
}

/**
 * Formats a LinkedIn profile for display in a specified template format
 */
export function formatProfileForTemplate(
  profile: LinkedInProfile,
  templateId: string
): Record<string, any> {
  // This would be expanded to support multiple template formats
  // For now, we'll just return a basic structure
  
  return {
    personal: {
      name: `${profile.firstName} ${profile.lastName}`,
      title: profile.headline || "",
      summary: profile.summary || "",
      image: profile.profilePictureUrl || "",
      location: profile.location ? 
        `${profile.location.city || ""}, ${profile.location.country || ""}` : ""
    },
    experience: profile.experiences || [],
    education: profile.education || [],
    skills: profile.skills || [],
    certifications: profile.certifications || [],
    languages: profile.languages || [],
    projects: profile.projects || []
  };
}