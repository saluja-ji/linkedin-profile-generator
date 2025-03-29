import { 
  users, type User, type InsertUser,
  profiles, type Profile, type InsertProfile,
  enhancementSettings, type EnhancementSettings, type InsertEnhancementSettings,
  websites, type Website, type InsertWebsite,
  waitlistEntries, type WaitlistEntry, type InsertWaitlistEntry
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Waitlist methods
  createWaitlistEntry(entry: InsertWaitlistEntry): Promise<WaitlistEntry>;
  getWaitlistEntryByEmail(email: string): Promise<WaitlistEntry | undefined>;
  
  // Profile methods
  createProfile(profile: InsertProfile): Promise<Profile>;
  getProfile(id: number): Promise<Profile | undefined>;
  getProfileByUserId(userId: number): Promise<Profile | undefined>;
  updateProfile(id: number, data: Partial<Profile>): Promise<Profile>;
  
  // Enhancement settings methods
  createEnhancementSettings(settings: InsertEnhancementSettings & { userId: number, profileId: number }): Promise<EnhancementSettings>;
  getEnhancementSettings(id: number): Promise<EnhancementSettings | undefined>;
  getEnhancementSettingsByProfile(profileId: number): Promise<EnhancementSettings | undefined>;
  updateEnhancementSettings(id: number, data: Partial<InsertEnhancementSettings>): Promise<EnhancementSettings>;
  
  // Website methods
  createWebsite(website: InsertWebsite & { userId: number }): Promise<Website>;
  getWebsite(id: number): Promise<Website | undefined>;
  getWebsitesByUserId(userId: number): Promise<Website[]>;
  updateWebsite(id: number, data: Partial<Website>): Promise<Website>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private waitlistEntries: Map<number, WaitlistEntry>;
  private profiles: Map<number, Profile>;
  private enhancementSettings: Map<number, EnhancementSettings>;
  private websites: Map<number, Website>;
  private currentUserId: number;
  private currentWaitlistId: number;
  private currentProfileId: number;
  private currentEnhancementSettingsId: number;
  private currentWebsiteId: number;

  constructor() {
    this.users = new Map();
    this.waitlistEntries = new Map();
    this.profiles = new Map();
    this.enhancementSettings = new Map();
    this.websites = new Map();
    this.currentUserId = 1;
    this.currentWaitlistId = 1;
    this.currentProfileId = 1;
    this.currentEnhancementSettingsId = 1;
    this.currentWebsiteId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      email: insertUser.email || null,
      name: insertUser.name || null,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  // Waitlist methods
  async createWaitlistEntry(entry: InsertWaitlistEntry): Promise<WaitlistEntry> {
    const id = this.currentWaitlistId++;
    const now = new Date().toISOString();
    const waitlistEntry: WaitlistEntry = {
      id,
      email: entry.email,
      linkedinUrl: entry.linkedinUrl || null,
      profession: entry.profession || null,
      createdAt: now
    };
    this.waitlistEntries.set(id, waitlistEntry);
    return waitlistEntry;
  }

  async getWaitlistEntryByEmail(email: string): Promise<WaitlistEntry | undefined> {
    return Array.from(this.waitlistEntries.values()).find(
      (entry) => entry.email === email
    );
  }

  // Profile methods
  async createProfile(profile: InsertProfile): Promise<Profile> {
    const id = this.currentProfileId++;
    const now = new Date();
    const newProfile: Profile = {
      id,
      linkedinUrl: profile.linkedinUrl,
      userId: profile.userId || null,
      originalData: {},
      enhancedData: null,
      lastUpdated: now
    };
    this.profiles.set(id, newProfile);
    return newProfile;
  }

  async getProfile(id: number): Promise<Profile | undefined> {
    return this.profiles.get(id);
  }

  async getProfileByUserId(userId: number): Promise<Profile | undefined> {
    return Array.from(this.profiles.values()).find(
      (profile) => profile.userId === userId
    );
  }

  async updateProfile(id: number, data: Partial<Profile>): Promise<Profile> {
    const profile = this.profiles.get(id);
    if (!profile) {
      throw new Error(`Profile with ID ${id} not found`);
    }
    
    const updatedProfile: Profile = {
      ...profile,
      ...data,
      lastUpdated: new Date()
    };
    
    this.profiles.set(id, updatedProfile);
    return updatedProfile;
  }

  // Enhancement settings methods
  async createEnhancementSettings(settings: InsertEnhancementSettings & { userId: number, profileId: number }): Promise<EnhancementSettings> {
    const id = this.currentEnhancementSettingsId++;
    const now = new Date();
    const enhancementSetting: EnhancementSettings = {
      id,
      userId: settings.userId,
      profileId: settings.profileId,
      tone: settings.tone || "professional",
      focus: settings.focus || "balanced",
      length: settings.length || "detailed",
      highlightAchievements: settings.highlightAchievements !== undefined ? settings.highlightAchievements : true,
      emphasizeSkills: settings.emphasizeSkills !== undefined ? settings.emphasizeSkills : true,
      includeMetrics: settings.includeMetrics !== undefined ? settings.includeMetrics : false,
      createdAt: now,
      updatedAt: now
    };
    
    this.enhancementSettings.set(id, enhancementSetting);
    return enhancementSetting;
  }

  async getEnhancementSettings(id: number): Promise<EnhancementSettings | undefined> {
    return this.enhancementSettings.get(id);
  }

  async getEnhancementSettingsByProfile(profileId: number): Promise<EnhancementSettings | undefined> {
    return Array.from(this.enhancementSettings.values()).find(
      (settings) => settings.profileId === profileId
    );
  }

  async updateEnhancementSettings(id: number, data: Partial<InsertEnhancementSettings>): Promise<EnhancementSettings> {
    const settings = this.enhancementSettings.get(id);
    if (!settings) {
      throw new Error(`Enhancement settings with ID ${id} not found`);
    }
    
    const updatedSettings: EnhancementSettings = {
      ...settings,
      ...data,
      updatedAt: new Date()
    };
    
    this.enhancementSettings.set(id, updatedSettings);
    return updatedSettings;
  }

  // Website methods
  async createWebsite(website: InsertWebsite & { userId: number }): Promise<Website> {
    const id = this.currentWebsiteId++;
    const now = new Date();
    const newWebsite: Website = {
      id,
      userId: website.userId,
      profileId: website.profileId,
      templateId: website.templateId,
      subdomain: website.subdomain || null,
      customDomain: website.customDomain || null,
      settings: website.settings || {},
      published: false,
      createdAt: now,
      updatedAt: now
    };
    
    this.websites.set(id, newWebsite);
    return newWebsite;
  }

  async getWebsite(id: number): Promise<Website | undefined> {
    return this.websites.get(id);
  }

  async getWebsitesByUserId(userId: number): Promise<Website[]> {
    return Array.from(this.websites.values()).filter(
      (website) => website.userId === userId
    );
  }

  async updateWebsite(id: number, data: Partial<Website>): Promise<Website> {
    const website = this.websites.get(id);
    if (!website) {
      throw new Error(`Website with ID ${id} not found`);
    }
    
    const updatedWebsite: Website = {
      ...website,
      ...data,
      updatedAt: new Date()
    };
    
    this.websites.set(id, updatedWebsite);
    return updatedWebsite;
  }
}

export const storage = new MemStorage();
