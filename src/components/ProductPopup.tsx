'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Product, Hotspot } from '@/types';
import { useCart } from '@/context/CartContext';
import { X, Check, ShoppingBag, Plus, Minus, ArrowRight, ShieldCheck, Sparkles, MapPin, Layers, Ruler, Paintbrush, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductPopupProps {
  product: Product | null;
  hotspot: Hotspot | null;
  roomProducts?: Product[];
  onSelectProduct?: (prod: Product) => void;
  onClose: () => void;
}

interface ProductPopupContentProps {
  product: Product;
  roomProducts?: Product[];
  onSelectProduct?: (prod: Product) => void;
  onClose: () => void;
}

const ProductPopupContent: React.FC<ProductPopupContentProps> = ({
  product,
  roomProducts = [],
  onSelectProduct,
  onClose,
}) => {
  const { addItem, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
    }, 2000);
  };

  // Next / Previous piece in room
  const currentIndex = roomProducts.findIndex((p) => p.id === product.id);
  const prevProduct = currentIndex > 0 ? roomProducts[currentIndex - 1] : null;
  const nextProduct = currentIndex < roomProducts.length - 1 ? roomProducts[currentIndex + 1] : null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Dimmed Blur Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs cursor-pointer"
      />

      {/* Slide-over Full Details Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        className="relative w-full max-w-lg md:max-w-xl bg-[#141210] border-l border-white/12 text-[#F5F1E9] shadow-2xl h-full flex flex-col z-10 overflow-hidden"
      >
        {/* Panel Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-[#161412]/80 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-medium flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              <span>Piece 0{currentIndex + 1} of 0{roomProducts.length}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Quick Prev / Next Buttons */}
            {onSelectProduct && (
              <div className="flex items-center border border-white/10 rounded-full mr-2">
                <button
                  onClick={() => prevProduct && onSelectProduct(prevProduct)}
                  disabled={!prevProduct}
                  title="Previous piece in room"
                  aria-label="Previous piece in room"
                  className="p-1.5 text-white/60 hover:text-white disabled:opacity-20 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="w-px h-3 bg-white/10" />
                <button
                  onClick={() => nextProduct && onSelectProduct(nextProduct)}
                  disabled={!nextProduct}
                  title="Next piece in room"
                  aria-label="Next piece in room"
                  className="p-1.5 text-white/60 hover:text-white disabled:opacity-20 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
            <button
              onClick={onClose}
              aria-label="Close product details"
              className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Large High-Res Product Image Frame */}
          <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden bg-[#1C1A17] border border-white/10 shadow-xl group">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 550px"
              priority
            />
            {/* Category tag */}
            <div className="absolute top-3.5 left-3.5 z-10 flex gap-2">
              <span className="text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-[#0E0D0C]/80 backdrop-blur-md text-[#C5A880] border border-white/10 font-medium">
                {product.category}
              </span>
              {product.inStock && (
                <span className="text-[9px] uppercase tracking-[0.16em] px-2.5 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  In Stock
                </span>
              )}
            </div>
          </div>

          {/* Title & Price */}
          <div>
            <h2
              id="product-modal-title"
              className="font-serif-luxury text-2xl sm:text-3xl font-light tracking-wide text-[#F5F1E9] leading-tight"
            >
              {product.name}
            </h2>
            <div className="mt-2.5 flex items-baseline gap-3">
              <span className="text-2xl font-serif-luxury text-[#C5A880] font-normal">
                {product.currency}{product.price.toLocaleString()}
              </span>
              <span className="text-[11px] text-[#A39E93] uppercase tracking-wider">
                VAT & Complimentary White-Glove Curation Incl.
              </span>
            </div>
          </div>

          {/* Narrative / Description */}
          <div className="border-t border-b border-white/10 py-4">
            <h3 className="text-xs uppercase tracking-[0.2em] text-[#A39E93] mb-2 font-medium">
              The Narrative
            </h3>
            <p className="text-sm leading-relaxed text-[#DCD6CA] font-light">
              {product.fullDescription || product.shortDescription}
            </p>
          </div>

          {/* Full Specifications Grid */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-[0.2em] text-[#A39E93] font-medium">
              Specifications & Craft
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {product.materials && (
                <div className="p-3.5 rounded-xl bg-[#1B1916] border border-white/5 flex gap-2.5 items-start">
                  <Layers className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#A39E93] block text-[10px] uppercase tracking-wider">
                      Materials
                    </span>
                    <span className="text-[#F5F1E9] font-light">
                      {product.materials}
                    </span>
                  </div>
                </div>
              )}

              {product.dimensions && (
                <div className="p-3.5 rounded-xl bg-[#1B1916] border border-white/5 flex gap-2.5 items-start">
                  <Ruler className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#A39E93] block text-[10px] uppercase tracking-wider">
                      Dimensions
                    </span>
                    <span className="text-[#F5F1E9] font-light">
                      {product.dimensions}
                    </span>
                  </div>
                </div>
              )}

              {product.finish && (
                <div className="p-3.5 rounded-xl bg-[#1B1916] border border-white/5 flex gap-2.5 items-start">
                  <Paintbrush className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#A39E93] block text-[10px] uppercase tracking-wider">
                      Finish
                    </span>
                    <span className="text-[#F5F1E9] font-light">
                      {product.finish}
                    </span>
                  </div>
                </div>
              )}

              {product.origin && (
                <div className="p-3.5 rounded-xl bg-[#1B1916] border border-white/5 flex gap-2.5 items-start">
                  <MapPin className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#A39E93] block text-[10px] uppercase tracking-wider">
                      Crafted In
                    </span>
                    <span className="text-[#F5F1E9] font-light">
                      {product.origin}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Panel Sticky Footer: Quantity & Add to Cart */}
        <div className="p-6 border-t border-white/10 bg-[#161412] space-y-3">
          <div className="flex items-center gap-3">
            {/* Quantity Picker */}
            <div className="flex items-center border border-white/20 rounded-xl bg-[#1B1916] px-3 py-2">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
                className="p-1 text-white/70 hover:text-white disabled:opacity-30 transition-colors cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center text-sm font-medium text-[#F5F1E9]">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
                className="p-1 text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Cart CTA */}
            <button
              onClick={handleAddToCart}
              disabled={justAdded}
              className={`flex-1 py-3.5 px-6 rounded-xl font-medium text-xs sm:text-sm tracking-[0.16em] uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-2xl ${
                justAdded
                  ? 'bg-[#3D5A46] text-white'
                  : 'bg-[#F5F1E9] text-[#0E0D0C] hover:bg-[#C5A880] hover:text-[#0E0D0C]'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4 animate-in zoom-in" />
                  <span>Added to Curation</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag — {product.currency}{(product.price * quantity).toLocaleString()}</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between pt-1 text-[11px] text-[#A39E93]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Shopify Storefront Connected</span>
            </span>
            <button
              onClick={() => {
                onClose();
                openCart();
              }}
              className="text-[#C5A880] hover:text-[#DFCAAB] underline uppercase tracking-wider font-medium cursor-pointer flex items-center gap-1"
            >
              <span>View Cart & Checkout</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const ProductPopup: React.FC<ProductPopupProps> = ({
  product,
  roomProducts = [],
  onSelectProduct,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {product && (
        <ProductPopupContent
          key={product.id}
          product={product}
          roomProducts={roomProducts}
          onSelectProduct={onSelectProduct}
          onClose={onClose}
        />
      )}
    </AnimatePresence>
  );
};
