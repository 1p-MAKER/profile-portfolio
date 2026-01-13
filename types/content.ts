export interface ContentData {
    leatherProducts: Product[];
    iosAppIds: string[];
    shopifyApps: Product[];
    snsAccounts: Product[];
    printImages: string[];
}

export interface Product {
    title: string;
    description: string;
    url: string;
    category: string;
}
