export interface ContentData {
    leatherProducts: Product[];
    iosApps: { id: string; name: string; }[];
    shopifyApps: Product[];
    snsAccounts: Product[];
    printImages: string[];
    furusatoItems: FurusatoItem[];
    youtubeVideos: YouTubeVideo[];
    tabs: TabItem[];
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
    id: 'leather' | 'ios' | 'shopify' | 'sns' | '3d-printer' | 'furusato' | 'youtube';
    label: string;
}

export interface Product {
    title: string;
    description: string;
    url: string;
    category: string;
}
