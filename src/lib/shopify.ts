import { CartItem, ShopifyLineItemInput } from '@/types';

/**
 * Shopify Storefront API Configuration & Adapter
 *
 * To connect to a live Shopify store:
 * 1. Set NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN in .env.local (e.g., your-store.myshopify.com)
 * 2. Set NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env.local
 * 3. The checkout flow automatically creates a real Shopify Cart and redirects to checkout.
 */

const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ACCESS_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const SHOPIFY_GRAPHQL_URL = SHOPIFY_STORE_DOMAIN
  ? `https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`
  : null;

export const CART_CREATE_MUTATION = /* GraphQL */ `
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export function formatShopifyLineItems(cartItems: CartItem[]): ShopifyLineItemInput[] {
  return cartItems.map((item) => ({
    merchandiseId: item.product.shopifyVariantId,
    quantity: item.quantity,
  }));
}

export async function createShopifyCheckout(
  cartItems: CartItem[]
): Promise<{ success: boolean; checkoutUrl?: string; payloadPreview: object; error?: string }> {
  const lineItems = formatShopifyLineItems(cartItems);

  const payload = {
    query: CART_CREATE_MUTATION,
    variables: {
      input: {
        lines: lineItems,
        attributes: [
          { key: 'source', value: 'Roomora Interactive Experience' },
        ],
      },
    },
  };

  // If live credentials are provided, call Shopify Storefront API
  if (SHOPIFY_GRAPHQL_URL && SHOPIFY_ACCESS_TOKEN) {
    try {
      const response = await fetch(SHOPIFY_GRAPHQL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': SHOPIFY_ACCESS_TOKEN,
        },
        body: JSON.stringify(payload),
      });

      const json = await response.json();
      if (json.errors || json.data?.cartCreate?.userErrors?.length > 0) {
        const errorMsg = json.errors?.[0]?.message || json.data.cartCreate.userErrors[0].message;
        return { success: false, error: errorMsg, payloadPreview: payload };
      }

      return {
        success: true,
        checkoutUrl: json.data.cartCreate.cart.checkoutUrl,
        payloadPreview: payload,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Network error';
      return { success: false, error: message, payloadPreview: payload };
    }
  }

  // Simulated luxury checkout link when live API keys are not yet configured
  const mockCheckoutId = `chk_${Math.random().toString(36).substring(2, 10)}`;
  return {
    success: true,
    checkoutUrl: `https://checkout.roomora.internal/session/${mockCheckoutId}`,
    payloadPreview: payload,
  };
}
