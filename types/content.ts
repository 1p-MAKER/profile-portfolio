export interface ContentData {
    leatherProducts: Product[];
    iosApps: { id: string; name: string; }[];
    shopifyApps: Product[];
    snsAccounts: Product[];
    printImages: string[];
    furusatoItems: FurusatoItem[];
    tabs: TabItem[];
}

export interface FurusatoItem {
    title: string;
    url: string;
    imageUrl: string;
    siteName?: string;
}

export interface TabItem {
    id: 'leather' | 'ios' | 'shopify' | 'sns' | '3d-printer' | 'furusato';
    label: string;
}

export interface Product {
    title: string;
    description: string;
    url: string;
    category: string;
}
