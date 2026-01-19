export interface ContentData {
    leatherProducts: Product[];
    iosApps: IosApp[];
    shopifyApps: Product[];
    snsAccounts: Product[];
    printImages: string[];
    furusatoItems: FurusatoItem[];
    youtubeVideos: YouTubeVideo[];
    videoProductionVideos: YouTubeVideo[];
    tabs: TabItem[];
    settings: Settings;
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

export interface TabItem {
    id: 'home' | 'leather' | 'ios' | 'shopify' | 'sns' | '3d-printer' | 'furusato' | 'youtube' | 'videoProduction';
    label: string;
}

export interface Product {
    title: string;
    description: string;
    url: string;
    category: string;
    isFeatured?: boolean;
}

export interface Settings {
    siteTitle?: string;
    profileName?: string;
    profileTagline?: string;
    featuredIntro?: string;
    videoProductionIntro?: string;
    xUsername?: string;
}
