
export enum Language {
  ENGLISH   = 'en',
  MARATHI   = 'mr',
  HINDI     = 'hi',
  GUJARATI  = 'gu',
  TELUGU    = 'te',
  PUNJABI   = 'pa',
  KANNADA   = 'kn',
  TAMIL     = 'ta',
  BENGALI   = 'bn',
  ODIA      = 'or',
  MALAYALAM = 'ml',
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
  photos?: string[];
  sellerId: string;
  certificates?: string[];
  harvestDate?: string;
  description: string;
  descriptionMr: string;
  mspPrice?: number; // Minimum Support Price for comparison badge (optional — not all products have MSP)
}

export type AppScreen = 'HOME' | 'DETAILS' | 'SELL' | 'LISTINGS' | 'ORDERS' | 'PROFILE' | 'ASSISTANT' | 'ONBOARDING' | 'EXPLORE' | 'CALENDAR' | 'CART' | 'CHECKOUT' | 'SELLER_PROFILE' | 'MESSAGES' | 'DUKAAN';

export type UserRole = 'farmer' | 'shopkeeper';

export type ShopVerificationStatus = 'pending' | 'approved' | 'rejected';

export interface ShopProfile {
  shopName: string;
  shopNameMr?: string;
  gstOrLicense: string;
  exteriorPhotoUri: string;
  interiorPhotoUri: string;
  verificationStatus: ShopVerificationStatus;
  shopkeeperId?: string;
  location?: string;
  distance?: string;
}

export type ShopItemCategory =
  | 'seeds'
  | 'fertilizer'
  | 'pesticide'
  | 'tools'
  | 'feed'
  | 'other';

export interface ShopItem {
  id: string;
  shopkeeperId: string;
  name: string;
  nameMr: string;
  category: ShopItemCategory;
  price: number;
  unit: string;
  stockQty: number;
  stockThreshold: number;
  description: string;
  descriptionMr: string;
  imageUris: string[];
  brand?: string;
  expiryDate?: string;
  isActive: boolean;
  createdAt: string;
}

export interface MappedShopProduct extends Product {
  isDukaanItem: true;
  brand?: string;
  expiryDate?: string;
}

export interface AppState {
  currentScreen: AppScreen;
  selectedProduct?: Product;
  selectedSellerId?: string;
  userLanguage: Language;
  location: string;
  userRole: UserRole;
}

export interface Category {
  id: string;
  name: string;
  nameMr: string;
  icon: string;
}
