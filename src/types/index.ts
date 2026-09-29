export type RoomId = 'living' | 'bedroom' | 'kitchen' | 'dining' | 'office';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  shortDescription: string;
  fullDescription?: string;
  materials?: string;
  dimensions?: string;
  finish?: string;
  origin?: string;
  image: string;
  roomId: RoomId;
  shopifyVariantId: string;
  shopifyHandle: string;
  inStock: boolean;
}

export interface Hotspot {
  id: string;
  productId: string;
  x: number; // percentage (0 to 100)
  y: number; // percentage (0 to 100)
  label?: string;
}

export interface Room {
  id: RoomId;
  name: string;
  subtitle: string;
  description: string;
  imageSrc: string;
  alt: string;
  hotspots: Hotspot[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShopifyLineItemInput {
  merchandiseId: string;
  quantity: number;
}
