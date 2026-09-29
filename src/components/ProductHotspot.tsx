'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Hotspot, Product } from '@/types';
import { ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductHotspotProps {
  hotspot: Hotspot;
  product?: Product;
  index: number;
  isActive: boolean;
  isVisible: boolean;
  onClick: (e: React.MouseEvent) => void;
}

export const ProductHotspot: React.FC<ProductHotspotProps> = ({
  hotspot,
  product,
  index,
  isActive,
  isVisible,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!isVisible || !product) return null;

  // Tooltip smart placement
  const isRightSide = hotspot.x > 50;
  const isBottomSide = hotspot.y > 60;

  return (
    <div
      style={{
        left: `${hotspot.x}%`,
        top: `${hotspot.y}%`,
      }}
      className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 
        Calm, static luxury marker:
        - No blinking
        - No plus icon
        - Minimalist numbered lens or calm frosted circle
      */}
      <button
        onClick={onClick}
        type="button"
        aria-label={`Inspect ${product.name}, ${product.currency}${product.price}`}
        className={`relative flex items-center justify-center cursor-pointer focus:outline-none transition-all duration-300 p-2 ${
          isActive ? 'scale-115' : 'hover:scale-110'
        }`}
      >
        <span
          className={`flex items-center justify-center w-7 h-7 rounded-full border backdrop-blur-md transition-all duration-300 shadow-xl ${
            isActive
              ? 'bg-[#C5A880] border-[#C5A880] text-[#0E0D0C] shadow-[0_0_24px_rgba(197,168,128,0.7)]'
              : isHovered
                ? 'bg-[#F5F1E9] border-white text-[#0E0D0C] shadow-[0_0_16px_rgba(255,255,255,0.4)]'
                : 'bg-black/55 border-white/50 text-[#F5F1E9] hover:border-white'
          }`}
        >
          <span className="text-[10px] font-medium tracking-tight">
            0{index + 1}
          </span>
        </span>
      </button>

      {/* 
        "hover korle halka short details show hobe"
        Smooth floating short details preview card on hover
      */}
      <AnimatePresence>
        {isHovered && !isActive && (
          <motion.div
            initial={{ opacity: 0, y: isBottomSide ? 8 : -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: isBottomSide ? 8 : -8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={onClick}
            className={`absolute z-30 pointer-events-auto cursor-pointer ${
              isBottomSide ? 'bottom-full mb-3' : 'top-full mt-3'
            } ${isRightSide ? 'right-0 origin-top-right' : 'left-0 origin-top-left'}`}
          >
            <div className="w-64 bg-[#141210]/95 backdrop-blur-2xl border border-white/15 rounded-xl p-3 shadow-2xl text-[#F5F1E9] flex gap-3 items-center group/card hover:border-[#C5A880]/50 transition-colors">
              {/* Product Thumbnail */}
              <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-[#24211D] shrink-0 border border-white/10">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                  sizes="56px"
                />
              </div>

              {/* Short Details */}
              <div className="flex-1 min-w-0">
                <div className="text-[9px] uppercase tracking-[0.2em] text-[#C5A880] font-medium truncate">
                  {product.category}
                </div>
                <h4 className="font-serif-luxury text-sm font-light text-[#F5F1E9] truncate leading-tight mt-0.5">
                  {product.name}
                </h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-serif-luxury text-xs text-[#C5A880]">
                    {product.currency}{product.price.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-white/50 group-hover/card:text-white flex items-center gap-0.5 transition-colors">
                    <span>Full Details</span>
                    <ArrowUpRight className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
