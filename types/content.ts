export interface ContentData {
    leatherProducts: Product[];
    iosApps: { id: string; name: string; }[];
    shopifyApps: Product[];
    snsAccounts: Product[];
    printImages: string[];
    furusatoItems: FurusatoItem[];
    youtubeVideos: YouTubeVideo[];
    tabs: TabItem[];
    settings: Settings;
}

export interface FurusatoItem {
    title: string;
    url: string;
    imageUrl: string;
    siteName?: string;
}

export interface YouTubeVideo {
    id: string;
    url: string;
    title: string;
}

export interface TabItem {
    id: 'leather' | 'ios' | 'shopify' | 'sns' | '3d-printer' | 'furusato' | 'youtube' | 'x';
    label: string;
}

export interface Product {
    title: string;
    description: string;
    url: string;
    category: string;
}

export interface Settings {
    xUsername: string;
}
