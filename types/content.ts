export interface ContentData {
    leatherProducts: ShopifyLeatherProduct[];
    iosApps: IosApp[];
    shopifyApps: Product[];
    snsAccounts: SNSAccount[];
    printImages: string[];
    furusatoItems: FurusatoItem[];
    youtubeVideos: YouTubeVideo[];
    videoProductionVideos: YouTubeVideo[];
    audioTracks: AudioTrack[];
    noteItems: NoteItem[];
    brainItems: NoteItem[];
    officeItems: OfficeItem[];
    sketchMarkItems: SketchMarkItem[];
    tiktokItems: TikTokItem[];
    tabs: TabItem[];
    settings: Settings;
    legalInfo?: LegalInfo;
}

export interface TikTokItem {
    id: string;
    title: string;
    url: string;
    thumbnailUrl?: string;
    platform?: 'tiktok' | 'instagram';
    isFeatured?: boolean;
}

export interface LegalInfo {
    businessName: string;
    representativeName?: string;
    contactEmail: string;
    addressInfo: string;
    shippingInfo: string;
    returnPolicy: string;
    sellingPrice?: string;
    additionalCharges?: string;
    paymentMethod?: string;
    paymentTiming?: string;
}

// Shopify商品（革製品用）
export interface ShopifyLeatherProduct {
    handle: string;
    isFeatured?: boolean;
    category: string;
}

export interface IosApp {
    id: string;
    name: string;
    isFeatured?: boolean;
}

export interface FurusatoItem {
    title: string;
    url: string;
    imageUrl: string;
    siteName?: string;
    isFeatured?: boolean;
}

export interface YouTubeVideo {
    id: string;
    url: string;
    title: string;
    isFeatured?: boolean;
}

export interface AudioTrack {
    id: string;
    title: string;
    url: string;
    description: string;
    isFeatured?: boolean;
}

export interface NoteItem {
    title: string;
    url: string;
    imageUrl: string;
    siteName?: string;
    isFeatured?: boolean;
}

export interface SketchMarkItem {
    id: string | number;
    title: string;
    url: string;
    imageUrl: string;
    type: 'base' | 'instagram';
    price?: number | null;
}

export interface OfficeItem {
    id: string;
    title: string;
    description?: string;
    consultationUrl?: string; // Google Form URL etc.
    buyButtonId: string;
    publishableKey: string;
    imageUrl?: string;
    isFeatured?: boolean;
}

export interface TabItem {
    id: 'home' | 'leather' | 'ios' | 'shopify' | 'sns' | '3d-printer' | 'furusato' | 'youtube' | 'videoProduction' | 'audio' | 'note' | 'sketchMark' | 'office' | 'tiktok';
    label: string;
}

export interface Product {
    title: string;
    description: string;
    url: string;
    category: string;
    isFeatured?: boolean;
}

export interface SNSAccount {
    title: string;
    description: string;
    url: string;
    category: string;
    isFeatured?: boolean;
    platformType?: 'instagram' | 'x' | 'youtube' | 'tiktok' | 'facebook' | 'linkedin' | 'sora' | 'other';
    tagline?: string;
    thumbnailUrl?: string;
}

export interface Settings {
    siteTitle?: string;
    profileName?: string;
    profileTagline?: string;
    featuredIntro?: string;
    videoProductionIntro?: string;
    audioIntro?: string;
    xUsername?: string;
    featuredOrder?: string[];
    // Category Intro Texts
    homeIntro?: string;
    leatherIntro?: string;
    snsIntro?: string;
    printer3dIntro?: string;
    iosIntro?: string;
    youtubeIntro?: string;
    shopifyIntro?: string;
    furusatoIntro?: string;
    noteIntro?: string;
    brainIntro?: string;
    sketchMarkIntro?: string;
    officeIntro?: string;
    tiktokIntro?: string;
}

export type FeaturedItem =
    | { type: 'ios'; data: IosApp; id: string }
    | { type: 'leather'; data: ShopifyLeatherProduct; id: string }
    | { type: 'shopify'; data: Product; id: string }
    | { type: 'sns'; data: SNSAccount; id: string }
    | { type: 'youtube'; data: YouTubeVideo; id: string }
    | { type: 'videoProduction'; data: YouTubeVideo; id: string }
    | { type: 'furusato'; data: FurusatoItem; id: string }
    | { type: 'audio'; data: AudioTrack; id: string }
    | { type: 'note'; data: NoteItem; id: string }
    | { type: 'sketchMark'; data: SketchMarkItem; id: string }
    | { type: 'office'; data: OfficeItem; id: string }
    | { type: 'tiktok'; data: TikTokItem; id: string };
