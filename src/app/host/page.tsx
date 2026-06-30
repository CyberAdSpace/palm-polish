"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  Warehouse,
  Building2,
  Droplet,
  Zap,
  TreePine,
  Square,
  Sparkles,
  Plus,
  X,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import HostListingCard from "@/components/HostListingCard";
import { useAppStore } from "@/store";
import type { SpaceType, RateType } from "@/lib/types";

export default function HostPage() {
  const router = useRouter();
  const { currentUser, hostListings, addHostListing } = useAppStore();
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [spaceType, setSpaceType] = useState<SpaceType>("DRIVEWAY");
  const [address, setAddress] = useState("");
  const [rateType, setRateType] = useState<RateType>("HOURLY");
  const [hourlyRate, setHourlyRate] = useState("");
  const [flatRate, setFlatRate] = useState("");
  const [waterHookup, setWaterHookup] = useState(false);
  const [electricalOut, setElectricalOut] = useState(false);
  const [shadeCanopy, setShadeCanopy] = useState(false);
  const [pavedFlat, setPavedFlat] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      router.push("/auth");
      return;
    }

    addHostListing({
      hostId: currentUser.id,
      hostName: currentUser.name,
      title,
      description: description || undefined,
      spaceType,
      address,
      hourlyRate: rateType === "HOURLY" ? parseFloat(hourlyRate) : undefined,
      flatRate: rateType === "FLAT" ? parseFloat(flatRate) : undefined,
      rateType,
      waterHookup,
      electricalOut,
      shadeCanopy,
      pavedFlat,
    });

    setSubmitted(true);
    setShowForm(false);
    setTitle("");
    setDescription("");
    setAddress("");
    setHourlyRate("");
    setFlatRate("");
  };

  const availableListings = hostListings.filter((l) => l.available);

  const spaceTypes: { value: SpaceType; label: string; Icon: typeof Home }[] = [
    { value: "DRIVEWAY", label: "Driveway", Icon: Home },
    { value: "GARAGE", label: "Garage", Icon: Warehouse },
    { value: "COMMERCIAL_BAY", label: "Commercial", Icon: Building2 },
  ];

  const amenities = [
    {
      key: "water",
      label: "Water Hookup",
      Icon: Droplet,
      active: waterHookup,
      toggle: () => setWaterHookup(!waterHookup),
    },
    {
      key: "electric",
      label: "Electrical Outlet",
      Icon: Zap,
      active: electricalOut,
      toggle: () => setElectricalOut(!electricalOut),
    },
    {
      key: "shade",
      label: "Shade / Canopy",
      Icon: TreePine,
      active: shadeCanopy,
      toggle: () => setShadeCanopy(!shadeCanopy),
    },
    {
      key: "paved",
      label: "Paved / Flat Ground",
      Icon: Square,
      active: pavedFlat,
      toggle: () => setPavedFlat(!pavedFlat),
    },
  ];

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
            <div>
              <div className="eyebrow mb-3">For Hosts</div>
              <h1 className="serif text-4xl sm:text-5xl text-white tracking-tight">
                Host a detailing space
              </h1>
              <p className="text-[var(--text-muted)] mt-3 max-w-xl">
                List your driveway, garage, or commercial bay for detailers
                ready to work. Earn from space you already own.
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className={showForm ? "btn-ghost" : "btn-gold"}
            >
              {showForm ? (
                <>
                  <X className="w-4 h-4" /> Cancel
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> List a Space
                </>
              )}
            </button>
          </div>

          {submitted && (
            <div className="glass rounded-2xl px-5 py-4 mb-8 flex items-center gap-3 border-emerald-500/30">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-300 text-sm">
                Your space has been listed. Detailers can now find it when
                booking work in the area.
              </span>
            </div>
          )}

          {/* Create Form */}
          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-6 mb-12">
              {/* Step 1 — Space basics */}
              <section className="glass-strong rounded-2xl p-7">
                <div className="eyebrow mb-1">Step 1</div>
                <h2 className="serif text-2xl text-white mb-6">
                  Space basics
                </h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[var(--text-faint)] mb-2">
                      Listing Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="input-premium"
                      placeholder="e.g., Shaded driveway with water"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[var(--text-faint)] mb-2">
                      Space Type
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {spaceTypes.map((type) => {
                        const Icon = type.Icon;
                        const active = spaceType === type.value;
                        return (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => setSpaceType(type.value)}
                            className={`p-3 rounded-xl border text-center transition-all ${
                              active
                                ? "border-[var(--gold)]/60 bg-[var(--gold)]/10"
                                : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                            }`}
                          >
                            <Icon
                              className={`w-5 h-5 mx-auto ${active ? "text-[var(--gold)]" : "text-[var(--text-muted)]"}`}
                            />
                            <div
                              className={`text-xs mt-1.5 ${active ? "text-[var(--gold-light)]" : "text-[var(--text-muted)]"}`}
                            >
                              {type.label}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <label className="block text-xs uppercase tracking-wider text-[var(--text-faint)] mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="input-premium resize-none"
                    placeholder="What's included, any rules, hours of access..."
                  />
                </div>
              </section>

              {/* Step 2 — Location */}
              <section className="glass-strong rounded-2xl p-7">
                <div className="eyebrow mb-1">Step 2</div>
                <h2 className="serif text-2xl text-white mb-6">Location</h2>
                <label className="block text-xs uppercase tracking-wider text-[var(--text-faint)] mb-2">
                  Full Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="input-premium"
                  placeholder="Street, city, state, ZIP"
                />
                <p className="text-xs text-[var(--text-faint)] mt-2">
                  Address is only shared after a booking is confirmed.
                </p>
              </section>

              {/* Step 3 — Rate */}
              <section className="glass-strong rounded-2xl p-7">
                <div className="eyebrow mb-1">Step 3</div>
                <h2 className="serif text-2xl text-white mb-6">Rate</h2>
                <div className="grid sm:grid-cols-2 gap-3 mb-5">
                  <button
                    type="button"
                    onClick={() => setRateType("HOURLY")}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      rateType === "HOURLY"
                        ? "border-[var(--gold)]/60 bg-[var(--gold)]/10"
                        : "border-white/10 bg-white/[0.02] hover:border-white/20"
                    }`}
                  >
                    <div
                      className={`font-medium ${rateType === "HOURLY" ? "text-[var(--gold-light)]" : "text-white"}`}
                    >
                      Hourly Rate
                    </div>
                    <div className="text-xs text-[var(--text-faint)] mt-1">
                      Per-hour fee
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRateType("FLAT")}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      rateType === "FLAT"
                        ? "border-[var(--gold)]/60 bg-[var(--gold)]/10"
                        : "border-white/10 bg-white/[0.02] hover:border-white/20"
                    }`}
                  >
                    <div
                      className={`font-medium ${rateType === "FLAT" ? "text-[var(--gold-light)]" : "text-white"}`}
                    >
                      Flat Rate
                    </div>
                    <div className="text-xs text-[var(--text-faint)] mt-1">
                      One-time fee per use
                    </div>
                  </button>
                </div>
                <div className="relative max-w-xs">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--gold)] text-lg font-semibold">
                    $
                  </span>
                  <input
                    type="number"
                    value={rateType === "HOURLY" ? hourlyRate : flatRate}
                    onChange={(e) =>
                      rateType === "HOURLY"
                        ? setHourlyRate(e.target.value)
                        : setFlatRate(e.target.value)
                    }
                    required
                    min="1"
                    step="0.01"
                    className="input-premium pl-9 pr-20 text-xl font-bold"
                    placeholder="0.00"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-faint)] text-xs uppercase tracking-wider">
                    {rateType === "HOURLY" ? "/hour" : "flat"}
                  </span>
                </div>
              </section>

              {/* Step 4 — Amenities */}
              <section className="glass-strong rounded-2xl p-7">
                <div className="eyebrow mb-1">Step 4</div>
                <h2 className="serif text-2xl text-white mb-6">
                  Utilities & amenities
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {amenities.map((a) => {
                    const Icon = a.Icon;
                    return (
                      <button
                        key={a.key}
                        type="button"
                        onClick={a.toggle}
                        className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                          a.active
                            ? "border-[var(--gold)]/60 bg-[var(--gold)]/10"
                            : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            a.active
                              ? "bg-[var(--gold)]/20"
                              : "bg-white/[0.04]"
                          }`}
                        >
                          <Icon
                            className={`w-5 h-5 ${a.active ? "text-[var(--gold)]" : "text-[var(--text-muted)]"}`}
                          />
                        </div>
                        <div>
                          <div
                            className={`text-sm font-medium ${a.active ? "text-white" : "text-[var(--text-body)]"}`}
                          >
                            {a.label}
                          </div>
                          <div className="text-xs text-[var(--text-faint)] mt-0.5">
                            {a.active ? "Provided" : "Not provided"}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Submit */}
              <div className="glass-strong rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-sm">
                  <div className="text-white font-medium">Ready to publish</div>
                  {!currentUser && (
                    <div className="text-xs text-[var(--text-faint)] mt-0.5">
                      You&apos;ll need to sign in before listing.
                    </div>
                  )}
                </div>
                <button type="submit" className="btn-gold">
                  List My Space
                </button>
              </div>
            </form>
          )}

          {/* Existing Listings */}
          <div className="mt-4">
            <div className="flex items-end justify-between mb-6">
              <div>
                <div className="eyebrow mb-1">
                  Available Spaces · {availableListings.length}
                </div>
                <h2 className="serif text-3xl text-white">
                  Browse listed spaces
                </h2>
              </div>
            </div>

            {availableListings.length === 0 ? (
              <div className="glass rounded-2xl py-20 text-center">
                <Home className="w-12 h-12 mx-auto text-[var(--gold)]/60 mb-4" />
                <h3 className="serif text-2xl text-white mb-2">
                  No spaces listed yet
                </h3>
                <p className="text-[var(--text-muted)] max-w-md mx-auto">
                  Be the first to list a detailing space in your area and start
                  earning from the driveway you already have.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableListings.map((listing) => (
                  <HostListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
