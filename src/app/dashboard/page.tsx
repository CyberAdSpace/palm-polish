"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { LayoutGrid, Map as MapIcon, SlidersHorizontal, Droplet, Zap, TreePine, Square, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import PostingCard from "@/components/PostingCard";
import PostingDetailModal from "@/components/PostingDetailModal";
import { useAppStore } from "@/store";
import type { Posting } from "@/lib/types";
import type { PostingFilters } from "@/store";

const DashboardMap = dynamic(() => import("@/components/DashboardMap"), {
  ssr: false,
  loading: () => (
    <div className="glass aspect-[16/9] flex items-center justify-center">
      <span className="text-[var(--text-faint)] text-sm uppercase tracking-wider">
        Loading map…
      </span>
    </div>
  ),
});

export default function DashboardPage() {
  const { postings } = useAppStore();
  const [selectedPosting, setSelectedPosting] = useState<Posting | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [filters, setFilters] = useState<PostingFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const filteredPostings = useMemo(() => {
    let result = postings.filter((p) => p.status === "OPEN");
    if (filters.minPrice !== undefined)
      result = result.filter((p) => p.targetPrice >= filters.minPrice!);
    if (filters.maxPrice !== undefined)
      result = result.filter((p) => p.targetPrice <= filters.maxPrice!);
    if (filters.waterHookup) result = result.filter((p) => p.waterHookup);
    if (filters.electricalOut) result = result.filter((p) => p.electricalOut);
    if (filters.shadeCanopy) result = result.filter((p) => p.shadeCanopy);
    if (filters.pavedFlat) result = result.filter((p) => p.pavedFlat);
    return result;
  }, [postings, filters]);

  const handleViewDetails = (posting: Posting) => {
    const fresh = postings.find((p) => p.id === posting.id);
    setSelectedPosting(fresh ?? posting);
  };

  const activeFilterCount = Object.values(filters).filter((v) => v !== undefined && v !== false).length;

  const amenityChips = [
    { key: "waterHookup" as const, label: "Water", icon: Droplet },
    { key: "electricalOut" as const, label: "Electric", icon: Zap },
    { key: "shadeCanopy" as const, label: "Shade", icon: TreePine },
    { key: "pavedFlat" as const, label: "Paved", icon: Square },
  ];

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
            <div>
              <span className="eyebrow mb-2 block">
                Detailer Board · {filteredPostings.length} Open
              </span>
              <h1 className="serif text-5xl text-white">Open Jobs</h1>
              <p className="text-[var(--text-muted)] mt-2 text-sm">
                Browse local detailing requests. Accept, counter-offer, or pass.
              </p>
            </div>

            <div className="flex gap-2 self-start sm:self-end">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`btn-ghost py-2.5 text-sm ${showFilters ? "border-[var(--gold)] text-[var(--gold-light)]" : ""}`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-[var(--gold)] text-[#07090d] font-semibold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <div className="flex glass overflow-hidden p-0.5">
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-4 py-2 text-sm uppercase tracking-wider rounded-[12px] inline-flex items-center gap-1.5 transition-colors ${
                    viewMode === "list"
                      ? "bg-white/[0.06] text-white"
                      : "text-[var(--text-faint)] hover:text-white"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  List
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`px-4 py-2 text-sm uppercase tracking-wider rounded-[12px] inline-flex items-center gap-1.5 transition-colors ${
                    viewMode === "map"
                      ? "bg-white/[0.06] text-white"
                      : "text-[var(--text-faint)] hover:text-white"
                  }`}
                >
                  <MapIcon className="w-4 h-4" />
                  Map
                </button>
              </div>
            </div>
          </div>

          {/* Filter chip row */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {amenityChips.map(({ key, label, icon: Icon }) => {
              const active = filters[key];
              return (
                <button
                  key={key}
                  onClick={() =>
                    setFilters((f) => ({
                      ...f,
                      [key]: f[key] ? undefined : true,
                    }))
                  }
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs uppercase tracking-wider border transition-all ${
                    active
                      ? "border-[var(--gold)]/40 bg-[var(--gold)]/10 text-[var(--gold-light)]"
                      : "border-[var(--border)] bg-white/[0.02] text-[var(--text-muted)] hover:border-[var(--border-bright)] hover:text-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              );
            })}
            {activeFilterCount > 0 && (
              <button
                onClick={() => setFilters({})}
                className="text-xs uppercase tracking-wider text-[var(--text-faint)] hover:text-[var(--gold-light)] transition-colors ml-2"
              >
                Clear
              </button>
            )}
          </div>

          {/* Advanced filters panel */}
          {showFilters && (
            <div className="glass p-6 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="eyebrow block mb-2">Price Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice ?? ""}
                      onChange={(e) =>
                        setFilters((f) => ({
                          ...f,
                          minPrice: e.target.value ? Number(e.target.value) : undefined,
                        }))
                      }
                      className="input-premium text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice ?? ""}
                      onChange={(e) =>
                        setFilters((f) => ({
                          ...f,
                          maxPrice: e.target.value ? Number(e.target.value) : undefined,
                        }))
                      }
                      className="input-premium text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          {viewMode === "list" ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPostings.length === 0 ? (
                <div className="sm:col-span-2 lg:col-span-3 text-center py-24 glass">
                  <Search
                    className="w-10 h-10 mx-auto mb-4 text-[var(--text-faint)] opacity-50"
                    strokeWidth={1.25}
                  />
                  <h3 className="serif text-2xl text-white mb-2">No jobs found</h3>
                  <p className="text-[var(--text-muted)] text-sm">
                    {activeFilterCount > 0
                      ? "Try adjusting your filters"
                      : "Check back soon for new detailing requests"}
                  </p>
                </div>
              ) : (
                filteredPostings.map((posting) => (
                  <PostingCard
                    key={posting.id}
                    posting={posting}
                    onViewDetails={handleViewDetails}
                  />
                ))
              )}
            </div>
          ) : (
            <div className="glass overflow-hidden">
              {mounted && (
                <DashboardMap
                  postings={filteredPostings}
                  onSelectPosting={handleViewDetails}
                />
              )}
              <div className="p-4 border-t border-[var(--border)]">
                <div className="space-y-2">
                  {filteredPostings.map((posting) => (
                    <button
                      key={posting.id}
                      onClick={() => handleViewDetails(posting)}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-transparent hover:border-[var(--border)] transition-colors text-left"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-white text-sm font-medium truncate">
                          {posting.title}
                        </div>
                        <div className="text-[var(--text-faint)] text-xs truncate">
                          {posting.address ?? "Location not specified"}
                        </div>
                      </div>
                      <span className="serif text-lg gold-text shrink-0 ml-3">
                        ${posting.targetPrice}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {selectedPosting && (
        <PostingDetailModal
          posting={
            postings.find((p) => p.id === selectedPosting.id) ?? selectedPosting
          }
          onClose={() => setSelectedPosting(null)}
        />
      )}
    </>
  );
}
