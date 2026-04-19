
export enum Language {
  ENGLISH = 'en',
  MARATHI = 'mr',
  HINDI = 'hi', // Keeping for enum support if needed, but primary focus is MR
  KANNADA = 'kn'
}

export interface Seller {
  id: string;
  name: string;
  rating: number;
  isVerified: boolean;
  distance: string;
  phone: string;
  location: string;
  speciality: string[];
  daysOnApp: number;
  totalSold: number;
  bio: string;
  bioMr: string;
  avatarColor: string;
}

export interface Product {
  id: string;
  name: string;
  nameMr: string;
  category: string;
  variety: string;
  varietyMr: string;
  price: number;
  unit: string;
  unitMr: string;
  quantity: number;
  age?: string;
  ageMr?: string;
  imageUrl: string;
  sellerId: string;
  certificates?: string[];
  harvestDate?: string;
  description: string;
  descriptionMr: string;
  mspPrice?: number; // Minimum Support Price for comparison badge (optional — not all products have MSP)
}

export type AppScreen = 'HOME' | 'DETAILS' | 'SELL' | 'LISTINGS' | 'ORDERS' | 'PROFILE' | 'ASSISTANT' | 'ONBOARDING' | 'EXPLORE' | 'CALENDAR' | 'CART' | 'CHECKOUT' | 'SELLER_PROFILE' | 'MESSAGES';

export interface AppState {
  currentScreen: AppScreen;
  selectedProduct?: Product;
  selectedSellerId?: string;
  userLanguage: Language;
  location: string;
}

export interface Category {
  id: string;
  name: string;
  nameMr: string;
  icon: string;
}
