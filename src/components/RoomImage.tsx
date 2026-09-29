'use client';

import React from 'react';
import Image from 'next/image';
import { Room, Hotspot, Product } from '@/types';
import { ProductHotspot } from './ProductHotspot';
import { motion, AnimatePresence } from 'framer-motion';

interface RoomImageProps {
  room: Room;
  products: Record<string, Product>;
  activeHotspotId: string | null;
  showHotspots: boolean;
  onSelectHotspot: (hotspot: Hotspot) => void;
}

export const RoomImage: React.FC<RoomImageProps> = ({
  room,
  products,
  activeHotspotId,
  showHotspots,
  onSelectHotspot,
}) => {
  return (
    <div className="relative w-full h-[100dvh] flex items-center justify-center bg-[#0A0908] overflow-hidden select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={room.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-center justify-center overflow-hidden"
        >
          {/* 
            True Edge-to-Edge Fullscreen Immersion:
            The image spans the entire viewport without letterboxing or black borders.
            The inner container covers the full screen while maintaining 16:9 geometry
            so percentage-based coordinates remain pinned to the furniture.
          */}
          <div className="relative min-w-full min-h-full aspect-[16/9] flex items-center justify-center overflow-hidden">
            <Image
              src={room.imageSrc}
              alt={room.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center pointer-events-none"
              quality={90}
            />

            {/* Subtle Vignette for Text Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 pointer-events-none" />

            {/* Percentage Hotspots Layer */}
            <div className="absolute inset-0 z-20 pointer-events-none">
              {room.hotspots.map((hotspot, idx) => {
                const product = products[hotspot.productId];
                const isActive = activeHotspotId === hotspot.id;

                return (
                  <div key={hotspot.id} className="pointer-events-auto">
                    <ProductHotspot
                      hotspot={hotspot}
                      product={product}
                      index={idx}
                      isActive={isActive}
                      isVisible={showHotspots}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectHotspot(hotspot);
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
