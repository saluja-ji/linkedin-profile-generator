import { Schema, model, Document, Types } from 'mongoose';
import type { 
  User, InsertUser,
  WaitlistEntry, InsertWaitlistEntry,
  Profile, InsertProfile,
  EnhancementSettings, InsertEnhancementSettings,
  Website, InsertWebsite
} from '@shared/schema';

// Define our MongoDB schema types
interface UserMongoDocument extends Document {
  username: string;
  password: string;
  email: string | null;
  name: string | null;
  createdAt: Date;
}

interface WaitlistEntryMongoDocument extends Document {
  email: string;
  linkedinUrl: string | null;
  profession: string | null;
  createdAt: string;
}

interface ProfileMongoDocument extends Document {
  userId: Types.ObjectId | null;
  linkedinUrl: string | undefined;
  originalData: Record<string, any>;
  enhancedData: any | null;
  lastUpdated: Date;
}

interface EnhancementSettingsMongoDocument extends Document {
  userId: Types.ObjectId;
  profileId: Types.ObjectId;
  tone: 'professional' | 'conversational' | 'enthusiastic';
  focus: 'technical' | 'leadership' | 'creative' | 'balanced';
  length: 'concise' | 'detailed' | 'comprehensive';
  highlightAchievements: boolean;
  emphasizeSkills: boolean;
  includeMetrics: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface WebsiteMongoDocument extends Document {
  userId: Types.ObjectId;
  profileId: Types.ObjectId;
  templateId: string;
  subdomain: string | null;
  customDomain: string | null;
  settings: Record<string, any>;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Schemas
const userSchema = new Schema<UserMongoDocument>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  name: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const waitlistEntrySchema = new Schema<WaitlistEntryMongoDocument>({
  email: { type: String, required: true, unique: true },
  linkedinUrl: { type: String },
  profession: { type: String },
  createdAt: { type: String, required: true }
});

const profileSchema = new Schema<ProfileMongoDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  linkedinUrl: { type: String },
  originalData: { type: Object, required: true, default: {} },
  enhancedData: { type: Object, default: null },
  lastUpdated: { type: Date, default: Date.now }
});

const enhancementSettingsSchema = new Schema<EnhancementSettingsMongoDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  profileId: { type: Schema.Types.ObjectId, ref: 'Profile', required: true },
  tone: { type: String, default: 'professional', enum: ['professional', 'conversational', 'enthusiastic'] },
  focus: { type: String, default: 'balanced', enum: ['technical', 'leadership', 'creative', 'balanced'] },
  length: { type: String, default: 'detailed', enum: ['concise', 'detailed', 'comprehensive'] },
  highlightAchievements: { type: Boolean, default: true },
  emphasizeSkills: { type: Boolean, default: true },
  includeMetrics: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const websiteSchema = new Schema<WebsiteMongoDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  profileId: { type: Schema.Types.ObjectId, ref: 'Profile', required: true },
  templateId: { type: String, required: true },
  subdomain: { type: String, unique: true, sparse: true },
  customDomain: { type: String, unique: true, sparse: true },
  settings: { type: Object, default: {} },
  published: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Compile models
export const UserModel = model<UserMongoDocument>('User', userSchema);
export const WaitlistEntryModel = model<WaitlistEntryMongoDocument>('WaitlistEntry', waitlistEntrySchema);
export const ProfileModel = model<ProfileMongoDocument>('Profile', profileSchema);
export const EnhancementSettingsModel = model<EnhancementSettingsMongoDocument>('EnhancementSettings', enhancementSettingsSchema);
export const WebsiteModel = model<WebsiteMongoDocument>('Website', websiteSchema);

// Helper function to safely convert MongoDB ObjectId to number
function objectIdToNumber(id: Types.ObjectId | string | null | undefined): number | null {
  if (!id) return null;
  // Use the timestamp part of the ObjectId as the basis for a numeric id
  const timestamp = typeof id === 'string' 
    ? parseInt(id.substring(0, 8), 16) 
    : parseInt(id.toString().substring(0, 8), 16);
  return timestamp;
}

// Helper functions to convert between MongoDB documents and our application types
export function documentToUser(doc: UserMongoDocument & { _id: Types.ObjectId }): User {
  return {
    id: objectIdToNumber(doc._id) as number,
    username: doc.username,
    password: doc.password,
    email: doc.email,
    name: doc.name,
    createdAt: doc.createdAt
  };
}

export function documentToWaitlistEntry(doc: WaitlistEntryMongoDocument & { _id: Types.ObjectId }): WaitlistEntry {
  return {
    id: objectIdToNumber(doc._id) as number,
    email: doc.email,
    linkedinUrl: doc.linkedinUrl,
    profession: doc.profession,
    createdAt: doc.createdAt
  };
}

export function documentToProfile(doc: ProfileMongoDocument & { _id: Types.ObjectId }): Profile {
  return {
    id: objectIdToNumber(doc._id) as number,
    userId: objectIdToNumber(doc.userId),
    linkedinUrl: doc.linkedinUrl,
    originalData: doc.originalData,
    enhancedData: doc.enhancedData,
    lastUpdated: doc.lastUpdated
  };
}

export function documentToEnhancementSettings(doc: EnhancementSettingsMongoDocument & { _id: Types.ObjectId }): EnhancementSettings {
  return {
    id: objectIdToNumber(doc._id) as number,
    userId: objectIdToNumber(doc.userId) as number,
    profileId: objectIdToNumber(doc.profileId) as number,
    tone: doc.tone,
    focus: doc.focus,
    length: doc.length,
    highlightAchievements: doc.highlightAchievements,
    emphasizeSkills: doc.emphasizeSkills,
    includeMetrics: doc.includeMetrics,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  };
}

export function documentToWebsite(doc: WebsiteMongoDocument & { _id: Types.ObjectId }): Website {
  return {
    id: objectIdToNumber(doc._id) as number,
    userId: objectIdToNumber(doc.userId) as number,
    profileId: objectIdToNumber(doc.profileId) as number,
    templateId: doc.templateId,
    subdomain: doc.subdomain,
    customDomain: doc.customDomain,
    settings: doc.settings,
    published: doc.published,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  };
}