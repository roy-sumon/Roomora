'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { RoomId, Hotspot, Product } from '@/types';
import { rooms } from '@/data/rooms';
import { products } from '@/data/products';
import { RoomNavigation } from './RoomNavigation';
import { RoomImage } from './RoomImage';
import { ProductPopup } from './ProductPopup';
import { CartDrawer } from './CartDrawer';
import { useCart } from '@/context/CartContext';
import { Check, Sparkles, ChevronLeft, ChevronRight, Layers, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const RoomExplorer: React.FC = () => {
  const [activeRoomId, setActiveRoomId] = useState<RoomId>('living');
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showHotspots, setShowHotspots] = useState(true);
  const [showPiecesTray, setShowPiecesTray] = useState(false);
  const { lastAddedProduct, dismissNotification, openCart } = useCart();

  // Find active room data
  const currentRoom = rooms.find((r) => r.id === activeRoomId) || rooms[0];

  // List of all products in current room
  const roomProducts = currentRoom.hotspots
    .map((h) => products[h.productId])
    .filter(Boolean) as Product[];

  // Change room handler
  const handleSelectRoom = useCallback((roomId: RoomId) => {
    setActiveRoomId(roomId);
    setActiveHotspot(null);
    setSelectedProduct(null);
  }, []);

  // Hotspot click handler -> opens full product details
  const handleSelectHotspot = useCallback((hotspot: Hotspot) => {
    setActiveHotspot(hotspot);
    const prod = products[hotspot.productId] || null;
    setSelectedProduct(prod);
  }, []);

  // Direct product selector (from tray or next/prev)
  const handleSelectProduct = useCallback((prod: Product) => {
    setSelectedProduct(prod);
    const matchHs = currentRoom.hotspots.find((h) => h.productId === prod.id) || null;
    setActiveHotspot(matchHs);
  }, [currentRoom.hotspots]);

  // Close full product details popup
  const handleClosePopup = useCallback(() => {
    setActiveHotspot(null);
    setSelectedProduct(null);
  }, []);

  // Keyboard navigation: Left/Right arrows or 1-5 keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      const roomIds: RoomId[] = ['living', 'bedroom', 'kitchen', 'dining', 'office'];
      const currentIndex = roomIds.indexOf(activeRoomId);

      if (e.key === 'ArrowRight') {
        const nextIndex = (currentIndex + 1) % roomIds.length;
        handleSelectRoom(roomIds[nextIndex]);
      } else if (e.key === 'ArrowLeft') {
        const prevIndex = (currentIndex - 1 + roomIds.length) % roomIds.length;
        handleSelectRoom(roomIds[prevIndex]);
      } else if (['1', '2', '3', '4', '5'].includes(e.key)) {
        const targetIndex = parseInt(e.key, 10) - 1;
        if (targetIndex >= 0 && targetIndex < roomIds.length) {
          handleSelectRoom(roomIds[targetIndex]);
        }
      } else if (e.key.toLowerCase() === 'h') {
        setShowHotspots((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeRoomId, handleSelectRoom]);

  // Auto-dismiss "Added to Cart" notification toast after 4s
  useEffect(() => {
    if (lastAddedProduct) {
      const timer = setTimeout(() => {
        dismissNotification();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [lastAddedProduct, dismissNotification]);

  // Room navigation helpers
  const roomIndex = rooms.findIndex((r) => r.id === activeRoomId);
  const prevRoom = rooms[(roomIndex - 1 + rooms.length) % rooms.length];
  const nextRoom = rooms[(roomIndex + 1) % rooms.length];

  return (
    <main className="relative w-full h-[100dvh] bg-[#0A0908] overflow-hidden select-none">
      {/* Floating Header */}
      <RoomNavigation
        rooms={rooms}
        activeRoomId={activeRoomId}
        onSelectRoom={handleSelectRoom}
        showHotspots={showHotspots}
        onToggleHotspots={() => setShowHotspots((prev) => !prev)}
        activeHotspotCount={currentRoom.hotspots.length}
      />

      {/* Main Room Viewport */}
      <RoomImage
        room={currentRoom}
        products={products}
        activeHotspotId={activeHotspot?.id || null}
        showHotspots={showHotspots}
        onSelectHotspot={handleSelectHotspot}
      />

      {/* Lateral Previous / Next Space Buttons (Desktop) */}
      <div className="hidden lg:flex items-center justify-between absolute inset-y-0 left-6 right-6 pointer-events-none z-30">
        <button
          onClick={() => handleSelectRoom(prevRoom.id)}
          aria-label={`Previous room: ${prevRoom.name}`}
          className="pointer-events-auto p-3.5 rounded-full bg-[#161412]/80 backdrop-blur-xl border border-white/12 text-white/70 hover:text-white hover:bg-[#161412] hover:scale-105 transition-all duration-300 cursor-pointer group shadow-2xl"
        >
          <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
        </button>
        <button
          onClick={() => handleSelectRoom(nextRoom.id)}
          aria-label={`Next room: ${nextRoom.name}`}
          className="pointer-events-auto p-3.5 rounded-full bg-[#161412]/80 backdrop-blur-xl border border-white/12 text-white/70 hover:text-white hover:bg-[#161412] hover:scale-105 transition-all duration-300 cursor-pointer group shadow-2xl"
        >
          <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Bottom Editorial Bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 px-4 sm:px-8 md:px-12 py-5 flex items-end justify-between pointer-events-none">
        {/* Space Title and Subtitle */}
        <div className="pointer-events-auto flex flex-col gap-1 max-w-lg">
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#C5A880] font-medium">
              Space 0{roomIndex + 1} / 0{rooms.length}
            </span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span className="text-[10px] tracking-[0.16em] uppercase text-[#A39E93]">
              {currentRoom.name}
            </span>
          </div>
          <h1 className="font-serif-luxury text-xl sm:text-2xl md:text-3xl font-light tracking-wide text-[#F5F1E9]">
            {currentRoom.subtitle}
          </h1>
          <p className="hidden md:block text-xs text-[#A39E93] font-light leading-relaxed max-w-md line-clamp-2">
            {currentRoom.description}
          </p>
        </div>

        {/* Center / Right: Quick Pieces Tray Trigger */}
        <div className="pointer-events-auto flex items-center gap-3">
          <button
            onClick={() => setShowPiecesTray((prev) => !prev)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-xl transition-all duration-300 text-xs uppercase tracking-wider cursor-pointer shadow-xl ${
              showPiecesTray
                ? 'bg-[#F5F1E9] text-[#0E0D0C] border-white font-medium'
                : 'bg-[#161412]/85 text-[#F5F1E9] border-white/15 hover:border-white/30 hover:text-[#C5A880]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{showPiecesTray ? 'Close Pieces' : `Explore ${roomProducts.length} Pieces`}</span>
          </button>
        </div>
      </footer>

      {/* Quick Pieces Tray */}
      <AnimatePresence>
        {showPiecesTray && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-20 left-4 right-4 sm:left-8 sm:right-8 md:left-12 md:right-12 z-35 pointer-events-auto"
          >
            <div className="bg-[#141210]/95 backdrop-blur-2xl border border-white/15 rounded-2xl p-4 shadow-2xl">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-medium">
                  Pieces Visible in {currentRoom.name}
                </span>
                <span className="text-[10px] text-[#A39E93] uppercase tracking-wider">
                  Hover or click any item to view full details
                </span>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
                {roomProducts.map((prod, idx) => (
                  <button
                    key={prod.id}
                    onClick={() => {
                      handleSelectProduct(prod);
                      setShowPiecesTray(false);
                    }}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-[#1C1A17] border border-white/10 hover:border-[#C5A880]/50 transition-all text-left shrink-0 w-60 group cursor-pointer"
                  >
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#24211D] shrink-0">
                      <Image
                        src={prod.image}
                        alt={prod.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="48px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[9px] uppercase tracking-wider text-[#A39E93] truncate">
                        0{idx + 1} · {prod.category}
                      </div>
                      <div className="font-serif-luxury text-xs text-[#F5F1E9] truncate font-light">
                        {prod.name}
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="font-serif-luxury text-xs text-[#C5A880]">
                          {prod.currency}{prod.price.toLocaleString()}
                        </span>
                        <ArrowUpRight className="w-3 h-3 text-white/40 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Product Details Slide-over Panel */}
      {selectedProduct && (
        <ProductPopup
          product={selectedProduct}
          hotspot={activeHotspot}
          roomProducts={roomProducts}
          onSelectProduct={handleSelectProduct}
          onClose={handleClosePopup}
        />
      )}

      {/* Slide-out Cart Drawer */}
      <CartDrawer />

      {/* Toast Notification when product added */}
      <AnimatePresence>
        {lastAddedProduct && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 pointer-events-auto"
          >
            <div className="bg-[#181614]/95 backdrop-blur-2xl border border-[#C5A880]/40 rounded-xl p-3.5 pr-5 shadow-2xl flex items-center gap-3.5 text-[#F5F1E9] max-w-sm">
              <div className="w-9 h-9 rounded-lg bg-[#C5A880]/15 border border-[#C5A880]/30 flex items-center justify-center text-[#C5A880] shrink-0">
                <Check className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] uppercase tracking-wider text-[#C5A880] font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Added to Collection
                </div>
                <div className="font-serif-luxury text-sm font-light text-[#F5F1E9] truncate">
                  {lastAddedProduct.name}
                </div>
              </div>
              <button
                onClick={() => {
                  dismissNotification();
                  openCart();
                }}
                className="text-[11px] font-semibold uppercase tracking-wider text-[#C5A880] hover:text-[#DFCAAB] underline shrink-0 cursor-pointer"
              >
                View
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};
