import { Types } from 'mongoose';
import { IStorage } from '../storage';
import { 
  UserModel, WaitlistEntryModel, ProfileModel, 
  EnhancementSettingsModel, WebsiteModel,
  documentToUser, documentToWaitlistEntry, documentToProfile,
  documentToEnhancementSettings, documentToWebsite
} from './models';
import type {
  User, InsertUser,
  WaitlistEntry, InsertWaitlistEntry,
  Profile, InsertProfile,
  EnhancementSettings, InsertEnhancementSettings,
  Website, InsertWebsite
} from '@shared/schema';

// Helper function to safely convert a numeric ID to a MongoDB ObjectId
function numericIdToObjectId(id: number): Types.ObjectId {
  try {
    // Try converting directly if the number happens to be a valid ObjectId (unlikely)
    return new Types.ObjectId(id.toString());
  } catch (e) {
    // Generate a deterministic ObjectId based on the number
    // This is a simple approach and may not be suitable for all cases
    const paddedId = id.toString().padStart(24, '0');
    return new Types.ObjectId(paddedId.substring(0, 24));
  }
}

export class MongoDBStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    try {
      // First try using the ObjectId conversion
      const objectId = numericIdToObjectId(id);
      let user = await UserModel.findById(objectId);
      
      // If not found, try finding by numeric ID in a custom field
      if (!user) {
        console.log(`User with ObjectId ${objectId} not found, trying alternative methods`);
      }
      
      return user ? documentToUser(user) : undefined;
    } catch (error) {
      console.error('Error fetching user:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const user = await UserModel.findOne({ username });
      return user ? documentToUser(user) : undefined;
    } catch (error) {
      console.error('Error fetching user by username:', error);
      return undefined;
    }
  }

  async createUser(user: InsertUser): Promise<User> {
    try {
      const newUser = await UserModel.create({
        username: user.username,
        password: user.password,
        email: user.email || null,
        name: user.name || null,
        createdAt: new Date()
      });
      
      return documentToUser(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Waitlist methods
  async createWaitlistEntry(entry: InsertWaitlistEntry): Promise<WaitlistEntry> {
    try {
      const now = new Date().toISOString();
      const newEntry = await WaitlistEntryModel.create({
        email: entry.email,
        linkedinUrl: entry.linkedinUrl || null,
        profession: entry.profession || null,
        createdAt: now
      });
      
      return documentToWaitlistEntry(newEntry);
    } catch (error) {
      console.error('Error creating waitlist entry:', error);
      throw error;
    }
  }

  async getWaitlistEntryByEmail(email: string): Promise<WaitlistEntry | undefined> {
    try {
      const entry = await WaitlistEntryModel.findOne({ email });
      return entry ? documentToWaitlistEntry(entry) : undefined;
    } catch (error) {
      console.error('Error fetching waitlist entry by email:', error);
      return undefined;
    }
  }

  // Profile methods
  async createProfile(profile: InsertProfile): Promise<Profile> {
    try {
      const userId = profile.userId ? numericIdToObjectId(profile.userId) : null;
      
      const newProfile = await ProfileModel.create({
        linkedinUrl: profile.linkedinUrl,
        userId: userId,
        originalData: {},
        enhancedData: null,
        lastUpdated: new Date()
      });
      
      return documentToProfile(newProfile);
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  }

  async getProfile(id: number): Promise<Profile | undefined> {
    try {
      const objectId = numericIdToObjectId(id);
      const profile = await ProfileModel.findById(objectId);
      return profile ? documentToProfile(profile) : undefined;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return undefined;
    }
  }

  async getProfileByUserId(userId: number): Promise<Profile | undefined> {
    try {
      const objectId = numericIdToObjectId(userId);
      const profile = await ProfileModel.findOne({ userId: objectId });
      return profile ? documentToProfile(profile) : undefined;
    } catch (error) {
      console.error('Error fetching profile by user ID:', error);
      return undefined;
    }
  }

  async updateProfile(id: number, data: Partial<Profile>): Promise<Profile> {
    try {
      const objectId = numericIdToObjectId(id);
      const profile = await ProfileModel.findById(objectId);
      
      if (!profile) {
        throw new Error(`Profile with ID ${id} not found`);
      }
      
      // Update profile with new data
      if (data.linkedinUrl !== undefined) profile.linkedinUrl = data.linkedinUrl;
      if (data.originalData !== undefined) profile.originalData = data.originalData;
      if (data.enhancedData !== undefined) profile.enhancedData = data.enhancedData;
      profile.lastUpdated = new Date();
      
      await profile.save();
      
      return documentToProfile(profile);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  // Enhancement settings methods
  async createEnhancementSettings(settings: InsertEnhancementSettings & { userId: number, profileId: number }): Promise<EnhancementSettings> {
    try {
      const now = new Date();
      const newSettings = await EnhancementSettingsModel.create({
        userId: numericIdToObjectId(settings.userId),
        profileId: numericIdToObjectId(settings.profileId),
        tone: settings.tone || "professional",
        focus: settings.focus || "balanced",
        length: settings.length || "detailed",
        highlightAchievements: settings.highlightAchievements !== undefined ? settings.highlightAchievements : true,
        emphasizeSkills: settings.emphasizeSkills !== undefined ? settings.emphasizeSkills : true,
        includeMetrics: settings.includeMetrics !== undefined ? settings.includeMetrics : false,
        createdAt: now,
        updatedAt: now
      });
      
      return documentToEnhancementSettings(newSettings);
    } catch (error) {
      console.error('Error creating enhancement settings:', error);
      throw error;
    }
  }

  async getEnhancementSettings(id: number): Promise<EnhancementSettings | undefined> {
    try {
      const objectId = numericIdToObjectId(id);
      const settings = await EnhancementSettingsModel.findById(objectId);
      return settings ? documentToEnhancementSettings(settings) : undefined;
    } catch (error) {
      console.error('Error fetching enhancement settings:', error);
      return undefined;
    }
  }

  async getEnhancementSettingsByProfile(profileId: number): Promise<EnhancementSettings | undefined> {
    try {
      const objectId = numericIdToObjectId(profileId);
      const settings = await EnhancementSettingsModel.findOne({ profileId: objectId });
      return settings ? documentToEnhancementSettings(settings) : undefined;
    } catch (error) {
      console.error('Error fetching enhancement settings by profile ID:', error);
      return undefined;
    }
  }

  async updateEnhancementSettings(id: number, data: Partial<InsertEnhancementSettings>): Promise<EnhancementSettings> {
    try {
      const objectId = numericIdToObjectId(id);
      const settings = await EnhancementSettingsModel.findById(objectId);
      
      if (!settings) {
        throw new Error(`Enhancement settings with ID ${id} not found`);
      }
      
      // Update settings with new data
      if (data.tone !== undefined) settings.tone = data.tone;
      if (data.focus !== undefined) settings.focus = data.focus;
      if (data.length !== undefined) settings.length = data.length;
      if (data.highlightAchievements !== undefined) settings.highlightAchievements = data.highlightAchievements;
      if (data.emphasizeSkills !== undefined) settings.emphasizeSkills = data.emphasizeSkills;
      if (data.includeMetrics !== undefined) settings.includeMetrics = data.includeMetrics;
      settings.updatedAt = new Date();
      
      await settings.save();
      
      return documentToEnhancementSettings(settings);
    } catch (error) {
      console.error('Error updating enhancement settings:', error);
      throw error;
    }
  }

  // Website methods
  async createWebsite(website: InsertWebsite & { userId: number }): Promise<Website> {
    try {
      const now = new Date();
      const newWebsite = await WebsiteModel.create({
        userId: numericIdToObjectId(website.userId),
        profileId: numericIdToObjectId(website.profileId),
        templateId: website.templateId,
        subdomain: website.subdomain || null,
        customDomain: website.customDomain || null,
        settings: website.settings || {},
        published: false,
        createdAt: now,
        updatedAt: now
      });
      
      return documentToWebsite(newWebsite);
    } catch (error) {
      console.error('Error creating website:', error);
      throw error;
    }
  }

  async getWebsite(id: number): Promise<Website | undefined> {
    try {
      const objectId = numericIdToObjectId(id);
      const website = await WebsiteModel.findById(objectId);
      return website ? documentToWebsite(website) : undefined;
    } catch (error) {
      console.error('Error fetching website:', error);
      return undefined;
    }
  }

  async getWebsitesByUserId(userId: number): Promise<Website[]> {
    try {
      const objectId = numericIdToObjectId(userId);
      const websites = await WebsiteModel.find({ userId: objectId });
      return websites.map(documentToWebsite);
    } catch (error) {
      console.error('Error fetching websites by user ID:', error);
      return [];
    }
  }

  async updateWebsite(id: number, data: Partial<Website>): Promise<Website> {
    try {
      const objectId = numericIdToObjectId(id);
      const website = await WebsiteModel.findById(objectId);
      
      if (!website) {
        throw new Error(`Website with ID ${id} not found`);
      }
      
      // Update website with new data
      if (data.templateId !== undefined) website.templateId = data.templateId;
      if (data.subdomain !== undefined) website.subdomain = data.subdomain;
      if (data.customDomain !== undefined) website.customDomain = data.customDomain;
      if (data.settings !== undefined) website.settings = data.settings;
      if (data.published !== undefined) website.published = data.published;
      website.updatedAt = new Date();
      
      await website.save();
      
      return documentToWebsite(website);
    } catch (error) {
      console.error('Error updating website:', error);
      throw error;
    }
  }
}