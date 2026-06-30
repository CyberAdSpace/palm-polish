"use client";

import Image from "next/image";
import { Droplet, Zap, TreePine, Square, MapPin } from "lucide-react";
import type { HostListing } from "@/lib/types";
import { formatPrice, getSpaceTypeLabel } from "@/lib/utils";
import AmenityBadge from "./AmenityBadge";

interface HostListingCardProps {
  listing: HostListing;
}

export default function HostListingCard({ listing }: HostListingCardProps) {
  return (
    <div className="glass glass-hover overflow-hidden flex flex-col">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src="/img/space.png"
          alt={listing.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(7,9,13,0.15) 30%, rgba(7,9,13,0.55) 100%)",
          }}
        />

        {/* Top-right rate pill */}
        <div className="absolute top-3 right-3">
          <span
            className="px-3 py-1 rounded-full text-sm font-semibold"
            style={{
              background: "linear-gradient(180deg, #ffcd57 0%, #f0b429 100%)",
              color: "#07090d",
              boxShadow: "0 6px 16px -6px rgba(240, 180, 41, 0.6)",
            }}
          >
            {listing.rateType === "HOURLY"
              ? `${formatPrice(listing.hourlyRate ?? 0)}/hr`
              : formatPrice(listing.flatRate ?? 0)}
          </span>
        </div>

        {/* Top-left space-type pill */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-md text-[11px] uppercase tracking-wider bg-[var(--bg-base)]/70 backdrop-blur-sm border border-[var(--border-bright)] text-white">
            {getSpaceTypeLabel(listing.spaceType)}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        <h3 className="serif text-xl text-white leading-tight">{listing.title}</h3>
        {listing.description && (
          <p className="text-[var(--text-muted)] text-sm line-clamp-2">
            {listing.description}
          </p>
        )}

        <p className="text-[var(--text-faint)] text-xs flex items-center gap-1.5">
          <MapPin className="w-3 h-3" />
          <span className="truncate">{listing.address}</span>
        </p>

        <div className="flex flex-wrap gap-1.5">
          <AmenityBadge label="Water" active={listing.waterHookup} icon={<Droplet />} />
          <AmenityBadge label="Electric" active={listing.electricalOut} icon={<Zap />} />
          <AmenityBadge label="Shade" active={listing.shadeCanopy} icon={<TreePine />} />
          <AmenityBadge label="Paved" active={listing.pavedFlat} icon={<Square />} />
        </div>

        <div className="text-xs text-[var(--text-faint)] pt-3 border-t border-[var(--border)] mt-auto">
          Hosted by <span className="text-[var(--text-muted)]">{listing.hostName}</span>
        </div>
      </div>
    </div>
  );
}
