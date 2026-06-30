"use client";

import { Car, Droplet, Zap, TreePine, Square, MapPin, ArrowRight } from "lucide-react";
import type { Posting } from "@/lib/types";
import { formatPrice, formatDate, getLocationLabel } from "@/lib/utils";
import AmenityBadge from "./AmenityBadge";

interface PostingCardProps {
  posting: Posting;
  onViewDetails: (posting: Posting) => void;
}

export default function PostingCard({ posting, onViewDetails }: PostingCardProps) {
  return (
    <button
      onClick={() => onViewDetails(posting)}
      className="glass glass-hover text-left w-full overflow-hidden flex flex-col group"
    >
      {/* Image / placeholder region */}
      <div className="relative aspect-video overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #1a1f2b 0%, #0d1117 60%, #07090d 100%)",
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-[var(--text-faint)]">
          <Car className="w-10 h-10 mb-2 opacity-40" strokeWidth={1.25} />
          <span className="text-[10px] uppercase tracking-[0.2em]">
            {posting.photos.length > 0
              ? `${posting.photos.length} photos`
              : "Photos coming"}
          </span>
        </div>

        {/* Top-right price pill */}
        <div className="absolute top-3 right-3">
          <span
            className="px-3 py-1 rounded-full text-sm font-semibold"
            style={{
              background: "linear-gradient(180deg, #ffcd57 0%, #f0b429 100%)",
              color: "#07090d",
              boxShadow: "0 6px 16px -6px rgba(240, 180, 41, 0.6)",
            }}
          >
            {formatPrice(posting.targetPrice)}
          </span>
        </div>

        {/* Top-left location pill */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-md text-[11px] uppercase tracking-wider bg-[var(--bg-base)]/70 backdrop-blur-sm border border-[var(--border-bright)] text-white">
            {getLocationLabel(posting.locationType)}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="serif text-xl text-white leading-tight group-hover:text-[var(--gold-light)] transition-colors">
            {posting.title}
          </h3>
          {posting.description && (
            <p className="text-[var(--text-muted)] text-sm mt-1.5 line-clamp-2">
              {posting.description}
            </p>
          )}
        </div>

        {posting.address && (
          <p className="text-[var(--text-faint)] text-xs flex items-center gap-1.5">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{posting.address}</span>
          </p>
        )}

        <div className="flex flex-wrap gap-1.5">
          <AmenityBadge label="Water" active={posting.waterHookup} icon={<Droplet />} />
          <AmenityBadge label="Electric" active={posting.electricalOut} icon={<Zap />} />
          <AmenityBadge label="Shade" active={posting.shadeCanopy} icon={<TreePine />} />
          <AmenityBadge label="Paved" active={posting.pavedFlat} icon={<Square />} />
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[var(--border)] mt-auto">
          <div className="text-xs text-[var(--text-faint)]">
            <span>By {posting.userName}</span>
            <span className="mx-1.5">·</span>
            <span>{formatDate(posting.createdAt)}</span>
            {posting.bids.length > 0 && (
              <>
                <span className="mx-1.5">·</span>
                <span className="text-[var(--gold)]">
                  {posting.bids.length} bid{posting.bids.length !== 1 ? "s" : ""}
                </span>
              </>
            )}
          </div>
          <span className="text-[var(--gold-light)] text-sm font-medium inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            View <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </button>
  );
}
