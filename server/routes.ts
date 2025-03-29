import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { waitlistFormSchema, profileSchema, enhancementSettingsSchema, websiteSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { enhanceProfileContent, enhanceFullProfile, generateContentRecommendations, defaultEnhancementOptions } from "./services/openai";
import { fetchLinkedInProfile, processLinkedInProfile } from "./services/profile";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route for adding to waitlist
  app.post("/api/waitlist", async (req, res) => {
    try {
      // Validate request body
      const data = waitlistFormSchema.parse({
        email: req.body.email,
        linkedinUrl: req.body.linkedinUrl || "",
        profession: req.body.profession,
      });

      // Check if email already exists in waitlist
      const existingEntry = await storage.getWaitlistEntryByEmail(data.email);
      if (existingEntry) {
        return res.status(400).json({
          success: false,
          message: "This email is already on our waitlist.",
        });
      }

      // Add to waitlist
      const entry = await storage.createWaitlistEntry({
        email: data.email,
        linkedinUrl: data.linkedinUrl || "",
        profession: data.profession,
      });

      return res.status(201).json({
        success: true,
        message: "Thank you for joining our waitlist!",
        data: { id: entry.id },
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({
          success: false,
          message: validationError.message,
        });
      }

      console.error("Error adding to waitlist:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while processing your request. Please try again later.",
      });
    }
  });

  // API route for creating a profile
  app.post("/api/profiles", async (req, res) => {
    try {
      // Validate request body
      const data = profileSchema.parse({
        linkedinUrl: req.body.linkedinUrl,
        userId: req.body.userId,
      });

      // Create the profile
      const profile = await storage.createProfile({
        linkedinUrl: data.linkedinUrl,
        userId: data.userId,
      });

      return res.status(201).json({
        success: true,
        message: "Profile created successfully",
        data: profile,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({
          success: false,
          message: validationError.message,
        });
      }

      console.error("Error creating profile:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while creating your profile. Please try again later.",
      });
    }
  });

  // API route for fetching a LinkedIn profile
  app.post("/api/profiles/:id/fetch", async (req, res) => {
    try {
      const profileId = parseInt(req.params.id);
      
      // Get the profile
      const profile = await storage.getProfile(profileId);
      if (!profile) {
        return res.status(404).json({
          success: false,
          message: "Profile not found",
        });
      }

      // Fetch LinkedIn data
      if (!profile.linkedinUrl) {
        return res.status(400).json({
          success: false,
          message: "LinkedIn URL is required",
        });
      }
      const linkedinData = await fetchLinkedInProfile(profile.linkedinUrl);
      
      // Update the profile with the fetched data
      const updatedProfile = await storage.updateProfile(profileId, {
        originalData: linkedinData,
      });

      return res.status(200).json({
        success: true,
        message: "LinkedIn profile data fetched successfully",
        data: updatedProfile,
      });
    } catch (error) {
      console.error("Error fetching LinkedIn profile:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while fetching LinkedIn data. Please try again later.",
      });
    }
  });

  // API route for creating enhancement settings
  app.post("/api/profiles/:id/settings", async (req, res) => {
    try {
      const profileId = parseInt(req.params.id);
      
      // Get the profile
      const profile = await storage.getProfile(profileId);
      if (!profile) {
        return res.status(404).json({
          success: false,
          message: "Profile not found",
        });
      }

      // Validate request body
      const data = enhancementSettingsSchema.parse({
        tone: req.body.tone || defaultEnhancementOptions.tone,
        focus: req.body.focus || defaultEnhancementOptions.focus,
        length: req.body.length || defaultEnhancementOptions.length,
        highlightAchievements: req.body.highlightAchievements !== undefined ? req.body.highlightAchievements : defaultEnhancementOptions.highlightAchievements,
        emphasizeSkills: req.body.emphasizeSkills !== undefined ? req.body.emphasizeSkills : defaultEnhancementOptions.emphasizeSkills,
        includeMetrics: req.body.includeMetrics !== undefined ? req.body.includeMetrics : defaultEnhancementOptions.includeMetrics,
      });

      // Check if settings already exist for this profile
      const existingSettings = await storage.getEnhancementSettingsByProfile(profileId);
      if (existingSettings) {
        // Update existing settings
        const updatedSettings = await storage.updateEnhancementSettings(existingSettings.id, data);
        return res.status(200).json({
          success: true,
          message: "Enhancement settings updated successfully",
          data: updatedSettings,
        });
      }

      // Create new settings
      const settings = await storage.createEnhancementSettings({
        ...data,
        userId: profile.userId || 0, // Use a default value if userId is null
        profileId,
      });

      return res.status(201).json({
        success: true,
        message: "Enhancement settings created successfully",
        data: settings,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({
          success: false,
          message: validationError.message,
        });
      }

      console.error("Error creating enhancement settings:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while creating enhancement settings. Please try again later.",
      });
    }
  });

  // API route for enhancing a profile
  app.post("/api/profiles/:id/enhance", async (req, res) => {
    try {
      const profileId = parseInt(req.params.id);
      
      // Get the profile
      const profile = await storage.getProfile(profileId);
      if (!profile) {
        return res.status(404).json({
          success: false,
          message: "Profile not found",
        });
      }

      // Check if profile has original data
      if (!profile.originalData || Object.keys(profile.originalData).length === 0) {
        return res.status(400).json({
          success: false,
          message: "Profile data needs to be fetched before enhancement",
        });
      }

      // Get enhancement settings or use defaults
      const dbSettings = await storage.getEnhancementSettingsByProfile(profileId);
      
      // Convert database settings to EnhancementOptions format or use default
      const settings = dbSettings ? {
        tone: dbSettings.tone as "professional" | "conversational" | "enthusiastic",
        focus: dbSettings.focus as "technical" | "leadership" | "creative" | "balanced",
        length: dbSettings.length as "concise" | "detailed" | "comprehensive",
        highlightAchievements: !!dbSettings.highlightAchievements,
        emphasizeSkills: !!dbSettings.emphasizeSkills,
        includeMetrics: !!dbSettings.includeMetrics
      } : defaultEnhancementOptions;
      
      // Process the profile with AI
      // Convert originalData to string if it's an object
      const originalDataString = typeof profile.originalData === 'object' 
        ? JSON.stringify(profile.originalData) 
        : String(profile.originalData);
      
      const result = await processLinkedInProfile(originalDataString, settings);
      
      // Update the profile with enhanced data
      const updatedProfile = await storage.updateProfile(profileId, {
        enhancedData: result.enhancedProfile,
      });

      return res.status(200).json({
        success: true,
        message: "Profile enhanced successfully",
        data: {
          profile: updatedProfile,
          original: result.originalProfile,
          enhanced: result.enhancedProfile,
        },
      });
    } catch (error) {
      console.error("Error enhancing profile:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while enhancing your profile. Please try again later.",
      });
    }
  });

  // API route for getting content recommendations
  app.get("/api/profiles/:id/recommendations", async (req, res) => {
    try {
      const profileId = parseInt(req.params.id);
      
      // Get the profile
      const profile = await storage.getProfile(profileId);
      if (!profile) {
        return res.status(404).json({
          success: false,
          message: "Profile not found",
        });
      }

      // Check if profile has original data
      if (!profile.originalData || Object.keys(profile.originalData).length === 0) {
        return res.status(400).json({
          success: false,
          message: "Profile data needs to be fetched before getting recommendations",
        });
      }

      // Generate content recommendations
      // Convert originalData to string if it's an object
      const originalDataString = typeof profile.originalData === 'object' 
        ? JSON.stringify(profile.originalData) 
        : String(profile.originalData);
        
      const recommendations = await generateContentRecommendations(originalDataString);

      return res.status(200).json({
        success: true,
        message: "Content recommendations generated successfully",
        data: recommendations,
      });
    } catch (error) {
      console.error("Error generating content recommendations:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while generating content recommendations. Please try again later.",
      });
    }
  });

  // API route for creating a website
  app.post("/api/websites", async (req, res) => {
    try {
      // Validate request body
      const data = websiteSchema.parse({
        profileId: req.body.profileId,
        templateId: req.body.templateId,
        subdomain: req.body.subdomain,
        customDomain: req.body.customDomain,
        settings: req.body.settings,
      });

      // Get the profile to check if it exists and get userId
      const profile = await storage.getProfile(data.profileId);
      if (!profile) {
        return res.status(404).json({
          success: false,
          message: "Profile not found",
        });
      }

      // Create the website
      const website = await storage.createWebsite({
        ...data,
        userId: profile.userId || 0, // Use a default value if userId is null
      });

      return res.status(201).json({
        success: true,
        message: "Website created successfully",
        data: website,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({
          success: false,
          message: validationError.message,
        });
      }

      console.error("Error creating website:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while creating your website. Please try again later.",
      });
    }
  });

  // API route for updating a website
  app.patch("/api/websites/:id", async (req, res) => {
    try {
      const websiteId = parseInt(req.params.id);
      
      // Get the website
      const website = await storage.getWebsite(websiteId);
      if (!website) {
        return res.status(404).json({
          success: false,
          message: "Website not found",
        });
      }

      // Update the website
      const updatedWebsite = await storage.updateWebsite(websiteId, req.body);

      return res.status(200).json({
        success: true,
        message: "Website updated successfully",
        data: updatedWebsite,
      });
    } catch (error) {
      console.error("Error updating website:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating your website. Please try again later.",
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
