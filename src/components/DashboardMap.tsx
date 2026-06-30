"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Posting } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

interface DashboardMapProps {
  postings: Posting[];
  onSelectPosting: (posting: Posting) => void;
}

// Default to Cape Coral / Fort Myers region (matches trust strip)
const DEFAULT_CENTER: [number, number] = [26.5629, -81.9495];

// Deterministic location jitter from posting id, around DEFAULT_CENTER
function hashLatLng(id: string): [number, number] {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  const lat = DEFAULT_CENTER[0] + ((h % 1000) / 1000 - 0.5) * 0.18;
  const lng = DEFAULT_CENTER[1] + (((h >> 10) % 1000) / 1000 - 0.5) * 0.18;
  return [lat, lng];
}

export default function DashboardMap({ postings, onSelectPosting }: DashboardMapProps) {
  const [icon, setIcon] = useState<L.DivIcon | null>(null);

  useEffect(() => {
    setIcon(
      L.divIcon({
        className: "shine-pin",
        html: `<div style="
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #ffe28a, #f0b429 60%, #c8941a);
          box-shadow:
            0 0 0 4px rgba(240, 180, 41, 0.18),
            0 0 12px rgba(240, 180, 41, 0.7),
            inset 0 1px 1px rgba(255,255,255,0.6);
          border: 1px solid rgba(7,9,13,0.4);
        "></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      })
    );
  }, []);

  const points = useMemo(
    () =>
      postings.map((p) => ({
        posting: p,
        pos: hashLatLng(p.id),
      })),
    [postings]
  );

  return (
    <div className="aspect-[16/9] w-full relative">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={11}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%", background: "#0d1117" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap &copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {icon &&
          points.map(({ posting, pos }) => (
            <Marker key={posting.id} position={pos} icon={icon}>
              <Popup>
                <div style={{ minWidth: 180 }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{posting.title}</div>
                  <div style={{ color: "#f0b429", fontWeight: 700, marginBottom: 6 }}>
                    {formatPrice(posting.targetPrice)}
                  </div>
                  <button
                    onClick={() => onSelectPosting(posting)}
                    style={{
                      background: "linear-gradient(180deg,#ffcd57,#f0b429)",
                      color: "#07090d",
                      padding: "6px 12px",
                      borderRadius: 8,
                      fontWeight: 600,
                      fontSize: 12,
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    View details →
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}
