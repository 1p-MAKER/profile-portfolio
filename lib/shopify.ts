// Shopify Storefront API Client

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

if (!domain || !storefrontAccessToken) {
    throw new Error('Missing Shopify environment variables');
}

const endpoint = `https://${domain}/api/2024-01/graphql.json`;

async function shopifyFetch<T>(query: string, variables: Record<string, any> = {}): Promise<T> {
    // 環境変数は上でチェック済みなので、ここでは確実に存在する
    const token = storefrontAccessToken!;

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': token,
        },
        body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
        throw new Error(`Shopify API error: ${response.statusText}`);
    }

    const json = await response.json();

    if (json.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
    }

    return json.data;
}

export interface ShopifyProduct {
    id: string;
    title: string;
    description: string;
    images: {
        edges: Array<{
            node: {
                url: string;
                altText: string | null;
            };
        }>;
    };
    variants: {
        edges: Array<{
            node: {
                id: string;
                price: {
                    amount: string;
                    currencyCode: string;
                };
            };
        }>;
    };
}

export interface CheckoutCreateResponse {
    checkoutCreate: {
        checkout: {
            id: string;
            webUrl: string;
        };
        checkoutUserErrors: Array<{
            message: string;
            field: string[];
        }>;
    };
}

/**
 * 商品データを取得
 * @param handle - 商品のハンドル（URL用のスラッグ）
 * @returns 商品データ
 */
export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
    const query = `
    query getProduct($handle: String!) {
      product(handle: $handle) {
        id
        title
        description
        images(first: 1) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 1) {
          edges {
            node {
              id
              price {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `;

    try {
        const data = await shopifyFetch<{ product: ShopifyProduct | null }>(query, { handle });
        return data.product;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

/**
 * チェックアウトを作成
 * @param variantId - 商品バリアントID
 * @returns チェックアウトURL
 */
export async function createCheckout(variantId: string): Promise<string | null> {
    const mutation = `
    mutation checkoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          id
          webUrl
        }
        checkoutUserErrors {
          message
          field
        }
      }
    }
  `;

    const input = {
        lineItems: [
            {
                variantId,
                quantity: 1,
            },
        ],
    };

    try {
        const data = await shopifyFetch<CheckoutCreateResponse>(mutation, { input });

        if (data.checkoutCreate.checkoutUserErrors.length > 0) {
            console.error('Checkout errors:', data.checkoutCreate.checkoutUserErrors);
            return null;
        }

        return data.checkoutCreate.checkout.webUrl;
    } catch (error) {
        console.error('Error creating checkout:', error);
        return null;
    }
}
