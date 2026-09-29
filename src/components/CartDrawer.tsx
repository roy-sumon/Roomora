'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Code2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isOpen,
    closeCart,
    totalCount,
    totalPrice,
    updateQuantity,
    removeItem,
    clearCart,
    isCheckingOut,
    checkoutResult,
    clearCheckoutResult,
    initiateCheckout,
  } = useCart();

  const [showApiInspector, setShowApiInspector] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative w-full max-w-md sm:max-w-lg bg-[#141210] border-l border-white/10 text-[#F5F1E9] h-full shadow-2xl flex flex-col z-10"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-medium block">
                  Curated Collection
                </span>
                <h2 className="font-serif-luxury text-2xl font-light tracking-wide text-[#F5F1E9]">
                  Your Cart {totalCount > 0 && `(${totalCount})`}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                {items.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-[10px] uppercase tracking-wider text-[#A39E93] hover:text-[#C5A880] transition-colors cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={closeCart}
                  aria-label="Close cart drawer"
                  className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Cart Items List or Empty State */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-4 py-16">
                  <div className="w-16 h-16 rounded-full bg-[#1F1C19] border border-white/10 flex items-center justify-center mb-5 text-[#C5A880]">
                    <span className="font-serif-luxury text-2xl italic">R</span>
                  </div>
                  <h3 className="font-serif-luxury text-xl font-light mb-2 text-[#F5F1E9]">
                    Your Curation Is Empty
                  </h3>
                  <p className="text-xs text-[#A39E93] max-w-xs leading-relaxed mb-6 font-light">
                    Explore the room view and tap the subtle glowing markers placed over furniture and decor to discover pieces.
                  </p>
                  <button
                    onClick={closeCart}
                    className="px-6 py-2.5 rounded-full border border-white/20 text-xs uppercase tracking-[0.16em] text-[#F5F1E9] hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    Return to Room
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-3.5 rounded-xl bg-[#1D1B18]/70 border border-white/5 group hover:border-white/10 transition-colors"
                  >
                    {/* Item Thumbnail */}
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-[#24211D] shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-serif-luxury text-base font-light text-[#F5F1E9] leading-snug line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            aria-label={`Remove ${item.product.name} from cart`}
                            className="text-white/40 hover:text-red-400 p-1 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-[10px] text-[#A39E93] uppercase tracking-wider block">
                          {item.product.category}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        {/* Quantity Adjuster */}
                        <div className="flex items-center border border-white/15 rounded bg-[#161413] px-2 py-0.5">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="text-white/60 hover:text-white p-0.5 transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-medium text-[#F5F1E9]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="text-white/60 hover:text-white p-0.5 transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price Subtotal */}
                        <span className="font-serif-luxury text-sm text-[#C5A880]">
                          {item.product.currency}
                          {(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-[#161413]/90 space-y-4">
                {/* Subtotal and perks */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-[#A39E93]">
                    <span>Subtotal</span>
                    <span className="text-[#F5F1E9] font-medium font-serif-luxury text-base">
                      ${totalPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-[#A39E93]">
                    <span>Shipping</span>
                    <span className="text-[#C5A880] uppercase tracking-wider text-[11px]">
                      Complimentary White-Glove
                    </span>
                  </div>
                  <div className="pt-2 border-t border-white/10 flex justify-between items-baseline">
                    <span className="text-sm font-medium uppercase tracking-wider text-[#F5F1E9]">
                      Total Est.
                    </span>
                    <span className="font-serif-luxury text-2xl text-[#C5A880]">
                      ${totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <button
                  onClick={initiateCheckout}
                  disabled={isCheckingOut}
                  className="w-full py-3.5 px-6 rounded-lg bg-[#F5F1E9] text-[#0E0D0C] hover:bg-[#C5A880] transition-all duration-300 font-medium text-xs sm:text-sm tracking-[0.14em] uppercase flex items-center justify-center gap-2 cursor-pointer shadow-xl disabled:opacity-50"
                >
                  {isCheckingOut ? (
                    <span>Preparing Secure Checkout...</span>
                  ) : (
                    <>
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Shopify Integration Readiness Inspector Toggle */}
                <div className="pt-2 flex items-center justify-between text-[11px] text-[#A39E93]">
                  <div className="flex items-center gap-1.5 text-white/50">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>Shopify Storefront Ready</span>
                  </div>
                  <button
                    onClick={() => setShowApiInspector((prev) => !prev)}
                    className="flex items-center gap-1 text-[#C5A880] hover:underline cursor-pointer"
                  >
                    <Code2 className="w-3 h-3" />
                    <span>{showApiInspector ? 'Hide API Payload' : 'View API Payload'}</span>
                  </button>
                </div>

                {/* Shopify API Payload Inspector */}
                {showApiInspector && (
                  <div className="mt-2 p-3 rounded-lg bg-[#0C0B0A] border border-white/10 text-[10px] font-mono text-[#C7C2B6] overflow-x-auto max-h-36">
                    <div className="text-[#C5A880] mb-1 font-semibold">
                      Shopify Storefront API cartCreate GraphQL Payload:
                    </div>
                    <pre>
                      {JSON.stringify(
                        {
                          lines: items.map((i) => ({
                            merchandiseId: i.product.shopifyVariantId,
                            quantity: i.quantity,
                            handle: i.product.shopifyHandle,
                            title: i.product.name,
                          })),
                        },
                        null,
                        2
                      )}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Checkout Result Modal */}
          {checkoutResult && (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#181614] border border-[#C5A880]/30 rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl text-[#F5F1E9]"
              >
                <div className="w-12 h-12 rounded-full bg-[#C5A880]/15 text-[#C5A880] flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-serif-luxury text-2xl font-light">
                  Shopify Checkout Connected
                </h3>
                <p className="text-xs text-[#A39E93] leading-relaxed">
                  Your curated cart of <strong className="text-white">{totalCount} items</strong> ($
                  {totalPrice.toLocaleString()}) has been compiled into the Shopify Storefront GraphQL cart format.
                </p>
                <div className="p-3 bg-[#0E0D0C] rounded-lg border border-white/10 text-left text-[11px] font-mono text-[#C5A880] overflow-x-auto">
                  <code>Session: {checkoutResult.checkoutUrl}</code>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      clearCheckoutResult();
                      closeCart();
                    }}
                    className="flex-1 py-2.5 rounded-lg border border-white/20 text-xs uppercase tracking-wider hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                  <button
                    onClick={() => {
                      clearCheckoutResult();
                      closeCart();
                      alert('In production, this initiates the official Shopify hosted checkout redirect.');
                    }}
                    className="flex-1 py-2.5 rounded-lg bg-[#C5A880] text-[#0E0D0C] text-xs font-semibold uppercase tracking-wider hover:bg-[#DFCAAB] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Simulate Redirect</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
};
