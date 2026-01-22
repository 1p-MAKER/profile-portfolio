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
    tabs: TabItem[];
    settings: Settings;
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
}

export interface NoteItem {
    title: string;
    url: string;
    imageUrl: string;
    siteName?: string;
    isFeatured?: boolean;
}

export interface TabItem {
    id: 'home' | 'leather' | 'ios' | 'shopify' | 'sns' | '3d-printer' | 'furusato' | 'youtube' | 'videoProduction' | 'audio' | 'note' | 'sketchMark';
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
}
