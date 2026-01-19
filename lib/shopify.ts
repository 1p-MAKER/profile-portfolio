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
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
        'Accept-Language': 'ja-JP', // 日本語ロケールを優先
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
  } catch (error) {
    throw error;
  }
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
      productByHandle(handle: $handle) {
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
    // 1st Attempt: Standard fetch
    const data = await shopifyFetch<{ productByHandle: ShopifyProduct | null }>(query, { handle });

    if (data.productByHandle) {
      return data.productByHandle;
    }

    // 2nd Attempt: Fallback with URL encoding (e.g. for Japanese handles)
    // Shopify handles *should* be URL encoded if they contain special chars, but sometimes pure strings work.
    // Or sometimes the input handle is raw Japanese and needs encoding?
    // Let's try explicit encoding just in case.
    const encodedHandle = encodeURIComponent(handle);
    if (encodedHandle !== handle) {
      const dataRetry = await shopifyFetch<{ productByHandle: ShopifyProduct | null }>(query, { handle: encodedHandle });
      if (dataRetry.productByHandle) {
        return dataRetry.productByHandle;
      }
    }

    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// createCheckout removed as we rely on Direct Cart Links (Permalinks)
