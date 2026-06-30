"use client";

import { useState } from "react";
import { X, Car, Droplet, Zap, TreePine, Square, ArrowRight } from "lucide-react";
import type { Posting } from "@/lib/types";
import { useAppStore } from "@/store";
import { formatPrice, formatDate, getLocationLabel } from "@/lib/utils";
import AmenityBadge from "./AmenityBadge";

interface PostingDetailModalProps {
  posting: Posting;
  onClose: () => void;
}

export default function PostingDetailModal({
  posting,
  onClose,
}: PostingDetailModalProps) {
  const { currentUser, addBid, acceptBid, rejectBid } = useAppStore();
  const [bidAmount, setBidAmount] = useState(posting.targetPrice.toString());
  const [bidMessage, setBidMessage] = useState("");
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidSubmitted, setBidSubmitted] = useState(false);

  const isOwner = currentUser?.id === posting.userId;
  const isDetailer = currentUser?.role === "DETAILER";
  const alreadyBid = posting.bids.some(
    (b) => b.detailerId === currentUser?.id
  );

  const handleSubmitBid = () => {
    if (!currentUser) return;
    addBid({
      postingId: posting.id,
      detailerId: currentUser.id,
      detailerName: currentUser.name,
      amount: parseFloat(bidAmount),
      message: bidMessage || undefined,
    });
    setBidSubmitted(true);
    setShowBidForm(false);
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative glass-strong max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-7 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="eyebrow mb-2 block">
                {getLocationLabel(posting.locationType)}
              </span>
              <h2 className="serif text-3xl text-white leading-tight">
                {posting.title}
              </h2>
              <p className="text-[var(--text-muted)] text-sm mt-2">
                Posted by {posting.userName} · {formatDate(posting.createdAt)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Photo grid */}
          <div className="grid grid-cols-3 gap-3">
            {(posting.photos.length > 0
              ? posting.photos
              : [null, null, null]
            ).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-xl flex items-center justify-center border border-[var(--border)]"
                style={{
                  background:
                    "linear-gradient(135deg, #1a1f2b 0%, #0d1117 60%, #07090d 100%)",
                }}
              >
                <Car className="w-7 h-7 text-[var(--text-faint)] opacity-50" strokeWidth={1.25} />
              </div>
            ))}
          </div>

          {posting.description && (
            <p className="text-[var(--text-body)] leading-relaxed">
              {posting.description}
            </p>
          )}

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass p-4">
              <div className="eyebrow mb-1">Target Price</div>
              <div className="serif text-3xl gold-text">
                {formatPrice(posting.targetPrice)}
              </div>
            </div>
            <div className="glass p-4">
              <div className="eyebrow mb-1">Location</div>
              <div className="text-white font-medium mt-1">
                {getLocationLabel(posting.locationType)}
              </div>
            </div>
          </div>

          {posting.address && (
            <div className="glass p-4">
              <div className="eyebrow mb-1">Address</div>
              <div className="text-white text-sm">{posting.address}</div>
            </div>
          )}

          <div>
            <div className="eyebrow mb-3">Available Amenities</div>
            <div className="flex flex-wrap gap-2">
              <AmenityBadge label="Water Hookup" active={posting.waterHookup} icon={<Droplet />} />
              <AmenityBadge label="Electrical" active={posting.electricalOut} icon={<Zap />} />
              <AmenityBadge label="Shade / Canopy" active={posting.shadeCanopy} icon={<TreePine />} />
              <AmenityBadge label="Paved / Flat" active={posting.pavedFlat} icon={<Square />} />
            </div>
          </div>

          {posting.vehicleType && (
            <div className="flex gap-4 text-sm text-[var(--text-muted)] border-t border-[var(--border)] pt-4">
              <span>
                <span className="text-[var(--text-faint)]">Vehicle:</span> {posting.vehicleType}
              </span>
              {posting.vehicleYear && (
                <span>
                  <span className="text-[var(--text-faint)]">Year:</span> {posting.vehicleYear}
                </span>
              )}
            </div>
          )}

          {/* Bids */}
          {posting.bids.length > 0 && (
            <div>
              <div className="eyebrow mb-3">Bids ({posting.bids.length})</div>
              <div className="space-y-2">
                {posting.bids.map((bid) => (
                  <div
                    key={bid.id}
                    className="glass p-4 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-white font-medium">{bid.detailerName}</div>
                      <div className="serif text-xl gold-text mt-0.5">
                        {formatPrice(bid.amount)}
                      </div>
                      {bid.message && (
                        <p className="text-[var(--text-muted)] text-sm mt-1.5">
                          {bid.message}
                        </p>
                      )}
                      <span
                        className={`text-[10px] mt-2 inline-block px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          bid.status === "PENDING"
                            ? "bg-[var(--gold)]/10 border border-[var(--gold)]/30 text-[var(--gold-light)]"
                            : bid.status === "ACCEPTED"
                              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                              : "bg-red-500/10 border border-red-500/30 text-red-300"
                        }`}
                      >
                        {bid.status}
                      </span>
                    </div>
                    {isOwner && bid.status === "PENDING" && (
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => acceptBid(posting.id, bid.id)}
                          className="btn-gold text-sm py-1.5 px-3"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => rejectBid(posting.id, bid.id)}
                          className="btn-ghost text-sm py-1.5 px-3"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bid form */}
          {isDetailer && !alreadyBid && !bidSubmitted && posting.status === "OPEN" && (
            <div>
              {!showBidForm ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      if (!currentUser) return;
                      addBid({
                        postingId: posting.id,
                        detailerId: currentUser.id,
                        detailerName: currentUser.name,
                        amount: posting.targetPrice,
                      });
                      setBidSubmitted(true);
                    }}
                    className="btn-ghost flex-1 py-3"
                  >
                    Accept at {formatPrice(posting.targetPrice)}
                  </button>
                  <button
                    onClick={() => setShowBidForm(true)}
                    className="btn-gold flex-1 py-3"
                  >
                    Counter Offer <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="glass p-5 space-y-3">
                  <h4 className="serif text-lg text-white">Submit Counter Offer</h4>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[var(--text-faint)] block mb-1.5">
                      Your Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                        $
                      </span>
                      <input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        className="input-premium pl-8"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[var(--text-faint)] block mb-1.5">
                      Message (optional)
                    </label>
                    <textarea
                      value={bidMessage}
                      onChange={(e) => setBidMessage(e.target.value)}
                      rows={2}
                      className="input-premium resize-none"
                      placeholder="Why you're the right detailer for this job..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleSubmitBid} className="btn-gold flex-1">
                      Submit Offer
                    </button>
                    <button onClick={() => setShowBidForm(false)} className="btn-ghost">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {bidSubmitted && (
            <div className="glass p-4 text-center text-[var(--gold-light)] border-[var(--gold)]/30">
              Your bid has been submitted. The customer will review it shortly.
            </div>
          )}

          {!currentUser && (
            <div className="glass p-5 text-center">
              <p className="text-[var(--text-muted)] mb-3">
                Sign in as a Detailer to bid on this job
              </p>
              <a href="/auth" className="btn-gold text-sm inline-flex">
                Sign In <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
