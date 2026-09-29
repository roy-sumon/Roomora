'use client';

import React from 'react';
import { RoomId, Room } from '@/types';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Eye, EyeOff } from 'lucide-react';

interface RoomNavigationProps {
  rooms: Room[];
  activeRoomId: RoomId;
  onSelectRoom: (roomId: RoomId) => void;
  showHotspots: boolean;
  onToggleHotspots: () => void;
  activeHotspotCount: number;
}

export const RoomNavigation: React.FC<RoomNavigationProps> = ({
  rooms,
  activeRoomId,
  onSelectRoom,
  showHotspots,
  onToggleHotspots,
  activeHotspotCount,
}) => {
  const { totalCount, openCart } = useCart();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 md:px-12 py-5 sm:py-6 flex items-center justify-between pointer-events-none transition-all duration-300">
      {/* Brand Logo */}
      <div className="pointer-events-auto flex items-center gap-3">
        <button
          onClick={() => onSelectRoom('living')}
          className="text-left group cursor-pointer focus:outline-none"
          aria-label="Roomora Home"
        >
          <span className="font-serif-luxury text-2xl sm:text-3xl font-light tracking-[0.25em] uppercase text-[#F5F1E9] group-hover:text-[#C5A880] transition-colors duration-300">
            Roomora
          </span>
          <span className="hidden md:block text-[9px] tracking-[0.35em] uppercase text-[#A39E93] font-light -mt-0.5">
            Curated Living Atelier
          </span>
        </button>
      </div>

      {/* Center Room Selector */}
      <nav
        aria-label="Room navigation"
        className="pointer-events-auto bg-[#161412]/85 backdrop-blur-xl border border-white/12 rounded-full px-2 sm:px-3 py-1.5 shadow-2xl flex items-center gap-1 max-w-[calc(100vw-140px)] overflow-x-auto no-scrollbar"
      >
        {rooms.map((room) => {
          const isActive = room.id === activeRoomId;
          return (
            <button
              key={room.id}
              onClick={() => onSelectRoom(room.id)}
              className={`relative px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-[13px] tracking-[0.14em] uppercase transition-all duration-300 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'text-[#0E0D0C] font-semibold bg-[#F5F1E9] shadow-lg'
                  : 'text-[#C7C2B6] hover:text-white hover:bg-white/5'
              }`}
            >
              {room.name}
            </button>
          );
        })}
      </nav>

      {/* Right Controls: Highlights Toggle, Piece Count & Cart */}
      <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
        {/* Toggle Highlights Visibility */}
        <button
          onClick={onToggleHotspots}
          title={showHotspots ? 'Hide product highlights' : 'Show product highlights'}
          aria-label={showHotspots ? 'Hide product highlights' : 'Show product highlights'}
          className={`flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-full border transition-all duration-300 backdrop-blur-xl cursor-pointer text-xs uppercase tracking-wider ${
            showHotspots
              ? 'bg-[#161412]/85 border-white/15 text-[#C5A880] hover:text-white hover:border-white/30'
              : 'bg-[#C5A880] border-[#C5A880] text-[#0E0D0C] font-medium'
          }`}
        >
          {showHotspots ? (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Highlights</span>
            </>
          ) : (
            <>
              <EyeOff className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Hidden</span>
            </>
          )}
        </button>

        {/* Piece Count Pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#161412]/85 backdrop-blur-xl border border-white/10 text-[11px] text-[#A39E93] tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
          <span>{activeHotspotCount} Pieces</span>
        </div>

        {/* Cart Drawer Trigger */}
        <button
          onClick={openCart}
          aria-label={`Shopping cart with ${totalCount} items`}
          className="relative group p-2 sm:p-2.5 rounded-full bg-[#161412]/85 backdrop-blur-xl border border-white/12 hover:border-white/30 text-[#F5F1E9] hover:text-[#C5A880] transition-all duration-300 shadow-xl cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4 sm:w-[18px] sm:h-[18px] transition-transform duration-300 group-hover:scale-105" />
          {totalCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#C5A880] text-[#0E0D0C] text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg">
              {totalCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
