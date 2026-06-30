"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, X as XIcon, MapPin, Handshake, Home as HomeIcon, Droplet, Zap, TreePine, Square, Sparkles, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAppStore } from "@/store";
import type { LocationType } from "@/lib/types";

const locationOptions = [
  { value: "ON_SITE" as const, label: "On-Site", desc: "Detailer comes to me", icon: MapPin },
  { value: "MEET_UP" as const, label: "Meet Up", desc: "I go to the detailer", icon: Handshake },
  { value: "NEED_A_PLACE" as const, label: "Need a Place", desc: "Match me with a host", icon: HomeIcon },
];

const amenityOptions = [
  { key: "water", label: "Water Hookup", icon: Droplet },
  { key: "electric", label: "Electrical Outlet", icon: Zap },
  { key: "shade", label: "Shade / Canopy", icon: TreePine },
  { key: "paved", label: "Paved / Flat Ground", icon: Square },
] as const;

export default function PostJobPage() {
  const router = useRouter();
  const { currentUser, addPosting } = useAppStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [targetPrice, setTargetPrice] = useState("");
  const [locationType, setLocationType] = useState<LocationType>("ON_SITE");
  const [address, setAddress] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleYear, setVehicleYear] = useState("");
  const [amenities, setAmenities] = useState({
    water: false,
    electric: false,
    shade: false,
    paved: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newPhotos: string[] = [];
    for (let i = 0; i < Math.min(files.length, 4 - photos.length); i++) {
      newPhotos.push(URL.createObjectURL(files[i]));
    }
    setPhotos((prev) => [...prev, ...newPhotos].slice(0, 4));
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      router.push("/auth");
      return;
    }
    addPosting({
      userId: currentUser.id,
      userName: currentUser.name,
      title,
      description: description || undefined,
      photos: photos.length > 0 ? photos : ["/demo/car1.jpg"],
      targetPrice: parseFloat(targetPrice),
      locationType,
      address: address || undefined,
      vehicleType: vehicleType || undefined,
      vehicleYear: vehicleYear || undefined,
      waterHookup: amenities.water,
      electricalOut: amenities.electric,
      shadeCanopy: amenities.shade,
      pavedFlat: amenities.paved,
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="text-center max-w-md glass p-10">
            <div className="w-14 h-14 rounded-full bg-[var(--gold)]/15 border border-[var(--gold)]/30 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-7 h-7 text-[var(--gold)]" />
            </div>
            <h1 className="serif text-3xl text-white mb-3">Posted.</h1>
            <p className="text-[var(--text-muted)] mb-8">
              Your detailing request is live. Detailers in your area can now see it and submit bids.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => router.push("/dashboard")} className="btn-gold">
                View Board <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setTitle("");
                  setDescription("");
                  setPhotos([]);
                  setTargetPrice("");
                }}
                className="btn-ghost"
              >
                Post Another
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-10">
            <span className="eyebrow mb-2 block">For Clean Needers</span>
            <h1 className="serif text-5xl text-white">Post a detailing job</h1>
            <p className="text-[var(--text-muted)] mt-3">
              Upload photos, set a price, and let detailers come to you.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photos */}
            <section className="glass p-6">
              <div className="mb-4">
                <span className="eyebrow">Step 1</span>
                <h2 className="serif text-xl text-white mt-1">Vehicle photos</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {photos.map((photo, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-xl relative overflow-hidden group border border-[var(--border)]"
                  >
                    <Image
                      src={photo}
                      alt={`Vehicle photo ${i + 1}`}
                      className="w-full h-full object-cover"
                      width={200}
                      height={200}
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute top-1.5 right-1.5 bg-[var(--bg-base)]/80 backdrop-blur text-white w-7 h-7 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center border border-[var(--border-bright)]"
                    >
                      <XIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {photos.length < 4 && (
                  <label className="aspect-square bg-white/[0.02] border-2 border-dashed border-[var(--border-bright)] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[var(--gold)] hover:bg-[var(--gold)]/[0.04] transition-colors">
                    <Plus className="w-7 h-7 text-[var(--text-faint)] mb-1.5" strokeWidth={1.5} />
                    <span className="text-[10px] uppercase tracking-wider text-[var(--text-faint)]">
                      Add photo
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                      multiple
                    />
                  </label>
                )}
              </div>
              <p className="text-xs text-[var(--text-faint)] mt-3">
                Upload 3–4 photos ({photos.length}/4)
              </p>
            </section>

            {/* Vehicle */}
            <section className="glass p-6 space-y-4">
              <div className="mb-1">
                <span className="eyebrow">Step 2</span>
                <h2 className="serif text-xl text-white mt-1">Vehicle details</h2>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-[var(--text-faint)] block mb-1.5">
                  Job Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="input-premium"
                  placeholder="e.g., 2021 Honda Civic — Full Detail Needed"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-[var(--text-faint)] block mb-1.5">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="input-premium resize-none"
                  placeholder="Describe what needs to be done..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-[var(--text-faint)] block mb-1.5">
                    Vehicle Type
                  </label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="input-premium"
                  >
                    <option value="">Select type</option>
                    <option>Sedan</option>
                    <option>SUV</option>
                    <option>Truck</option>
                    <option>Van</option>
                    <option>Coupe</option>
                    <option>Convertible</option>
                    <option>Motorcycle</option>
                    <option>Boat</option>
                    <option>RV</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-[var(--text-faint)] block mb-1.5">
                    Year
                  </label>
                  <input
                    type="text"
                    value={vehicleYear}
                    onChange={(e) => setVehicleYear(e.target.value)}
                    className="input-premium"
                    placeholder="e.g., 2023"
                  />
                </div>
              </div>
            </section>

            {/* Price */}
            <section className="glass p-6">
              <div className="mb-4">
                <span className="eyebrow">Step 3</span>
                <h2 className="serif text-xl text-white mt-1">Your offer</h2>
              </div>
              <div className="relative max-w-xs">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-2xl serif">
                  $
                </span>
                <input
                  type="number"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  required
                  min="1"
                  step="0.01"
                  className="input-premium pl-9 text-3xl serif gold-text"
                  placeholder="0.00"
                  style={{ paddingTop: "0.6rem", paddingBottom: "0.6rem" }}
                />
              </div>
              <p className="text-xs text-[var(--text-faint)] mt-3">
                Set your target price. Detailers can accept or counter-offer.
              </p>
            </section>

            {/* Location */}
            <section className="glass p-6 space-y-4">
              <div className="mb-1">
                <span className="eyebrow">Step 4</span>
                <h2 className="serif text-xl text-white mt-1">Where</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {locationOptions.map((loc) => {
                  const Icon = loc.icon;
                  const active = locationType === loc.value;
                  return (
                    <button
                      key={loc.value}
                      type="button"
                      onClick={() => setLocationType(loc.value)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        active
                          ? "border-[var(--gold)]/50 bg-[var(--gold)]/[0.08]"
                          : "border-[var(--border)] bg-white/[0.02] hover:border-[var(--border-bright)]"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 mb-2 ${active ? "text-[var(--gold)]" : "text-[var(--text-muted)]"}`}
                      />
                      <div
                        className={`text-sm font-medium ${active ? "text-[var(--gold-light)]" : "text-white"}`}
                      >
                        {loc.label}
                      </div>
                      <div className="text-xs text-[var(--text-faint)] mt-0.5">
                        {loc.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-[var(--text-faint)] block mb-1.5">
                  Address / Area
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="input-premium"
                  placeholder="Enter your address or general area"
                />
              </div>
            </section>

            {/* Amenities */}
            <section className="glass p-6">
              <div className="mb-4">
                <span className="eyebrow">Step 5</span>
                <h2 className="serif text-xl text-white mt-1">Available amenities</h2>
                <p className="text-sm text-[var(--text-muted)] mt-2">
                  Toggle what&apos;s available at your location.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {amenityOptions.map((amenity) => {
                  const Icon = amenity.icon;
                  const active = amenities[amenity.key];
                  return (
                    <button
                      key={amenity.key}
                      type="button"
                      onClick={() =>
                        setAmenities((a) => ({ ...a, [amenity.key]: !a[amenity.key] }))
                      }
                      className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                        active
                          ? "border-[var(--gold)]/50 bg-[var(--gold)]/[0.08]"
                          : "border-[var(--border)] bg-white/[0.02] hover:border-[var(--border-bright)]"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${active ? "text-[var(--gold)]" : "text-[var(--text-muted)]"}`}
                      />
                      <div>
                        <div
                          className={`text-sm font-medium ${active ? "text-[var(--gold-light)]" : "text-white"}`}
                        >
                          {amenity.label}
                        </div>
                        <div className="text-xs text-[var(--text-faint)]">
                          {active ? "Available" : "Not available"}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Submit */}
            <div className="pt-2">
              <button type="submit" className="btn-gold w-full py-4 text-base justify-center">
                Post Detailing Job <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {!currentUser && (
              <p className="text-center text-[var(--text-faint)] text-sm">
                You&apos;ll need to sign in before posting.
              </p>
            )}
          </form>
        </div>
      </main>
    </>
  );
}
