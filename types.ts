
export enum UserRole {
  GUEST = 'GUEST',
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  credits: number;
  profilePic?: string;
  whatsapp?: string;
  address?: string;
  bio?: string;
}

export interface PromptItem {
  id: string;
  title: string;
  prompt: string;
  category: string;
  tags: string[];
  thumbnail?: string;
}

export enum ViewState {
  LANDING = 'LANDING',
  PHOTO_STUDIO = 'PHOTO_STUDIO',
  VIDEO_STUDIO = 'VIDEO_STUDIO',
  LIBRARY = 'LIBRARY',
  ADMIN = 'ADMIN',
  ADMIN_LOGIN = 'ADMIN_LOGIN',
  LOGIN = 'LOGIN',
  AI_LAB = 'AI_LAB',
  PRICING = 'PRICING',
  DASHBOARD = 'DASHBOARD',
  ABOUT = 'ABOUT'
}

export interface GeneratedAsset {
  id: string;
  type: 'image' | 'video';
  url: string;
  createdAt: Date;
  prompt: string;
}

export interface InboxMessage {
  id: string;
  fromUser: string;
  email: string;
  subject: string;
  content: string;
  date: string;
  read: boolean;
  aiResponse?: string; // The auto-reply sent to the user
  adminAnalysis?: string; // The technical solution for the admin
}

export interface PaymentSettings {
  crypto: {
    enabled: boolean;
    usdtAddress: string;
    btcAddress: string;
  };
  local: {
    enabled: boolean;
    jazzcash: { number: string; title: string };
    easypaisa: { number: string; title: string };
  };
}

// Global type for the AI Studio key selection on window
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}
