"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { Camera, Search, Home as HomeIcon, Star, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const els = ref.current.querySelectorAll<HTMLElement>(".reveal");
    // Reduce-motion users: show immediately.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      els.forEach((el) => el.classList.add("visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -10% 0px" }
    );
    els.forEach((el) => io.observe(el));
    // Safety fallback — always reveal after 1.2s in case observer never fires
    // (e.g. during screenshot capture or when the element is far below the fold).
    const fallback = window.setTimeout(() => {
      els.forEach((el) => el.classList.add("visible"));
      io.disconnect();
    }, 1200);
    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);
  return ref;
}

export default function Home() {
  const revealRef = useReveal();

  return (
    <>
      <Navbar />
      <main className="flex-1" ref={revealRef}>
        {/* Hero */}
        <section className="relative overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0">
            <Image
              src="/img/hero.png"
              alt=""
              fill
              priority
              className="object-cover object-center"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(7,9,13,0.55) 0%, rgba(7,9,13,0.35) 45%, rgba(7,9,13,0.95) 95%)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 60% 40% at 50% 10%, rgba(240, 180, 41, 0.22), transparent 70%)",
              }}
            />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 sm:pt-32 sm:pb-44">
            <div className="max-w-3xl">
              <span className="eyebrow mb-6 block">Florida’s Mobile Detailing Marketplace</span>
              <h1 className="serif text-5xl sm:text-7xl lg:text-[88px] leading-[1.02] text-white mb-6">
                Sunshine‑state shine.
                <span className="block gold-text">Booked in minutes.</span>
              </h1>
              <p className="text-lg sm:text-xl text-[var(--text-body)] max-w-xl leading-relaxed">
                One marketplace. Three sides. Book a mobile detailer for your car, earn from your
                skills, or list your driveway — all under one palm.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-3">
                <Link href="/post" className="btn-gold text-base px-7 py-4">
                  Get my car detailed
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/dashboard" className="btn-ghost text-base px-7 py-4">
                  Earn as a detailer
                </Link>
                <Link href="/host" className="btn-ghost text-base px-7 py-4">
                  List your space
                </Link>
              </div>

              <div className="mt-14 flex items-center gap-3 text-sm text-[var(--text-muted)]">
                <Star className="w-4 h-4 fill-[var(--gold)] text-[var(--gold)]" />
                <span>Now launching in Tampa Bay &amp; Southwest Florida. Early access is open.</span>
              </div>
            </div>
          </div>
        </section>

        {/* Early access (honest launch status, no live counts until real) */}
        <section className="relative -mt-16 pb-16 sm:pb-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 reveal">
            <div className="glass p-8 sm:p-12">
              <div className="eyebrow mb-6 text-center">Early access · We&apos;re just getting started</div>
              <div className="grid sm:grid-cols-3 gap-8 sm:gap-12 sm:divide-x divide-[var(--border)]">
                <div className="text-center">
                  <div className="serif text-2xl text-white mb-2">Car owners</div>
                  <p className="text-sm text-[var(--text-muted)]">Post your request now. We&apos;ll match you as detailers join your area.</p>
                </div>
                <div className="text-center sm:px-4">
                  <div className="serif text-2xl gold-text mb-2">Detailers</div>
                  <p className="text-sm text-[var(--text-muted)]">Be one of the first pros on the platform and get first pick of jobs.</p>
                </div>
                <div className="text-center sm:pl-4">
                  <div className="serif text-2xl text-white mb-2">Space hosts</div>
                  <p className="text-sm text-[var(--text-muted)]">List a driveway or bay early and be ready when bookings start.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center max-w-2xl mx-auto mb-16 reveal">
            <span className="eyebrow mb-4 block">How it works</span>
            <h2 className="serif text-4xl sm:text-5xl text-white">
              Three sides. <span className="gold-text">One marketplace.</span>
            </h2>
            <p className="text-[var(--text-muted)] mt-4 text-base">
              Whether you need a detail, want to work, or have a driveway to lease —
              Palm Polish fits.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Camera,
                eyebrow: "For Owners",
                title: "Post your vehicle",
                description:
                  "Upload photos, set your target price, choose where the detail happens, and toggle the utilities you have on-site.",
                image: "/img/interior.png",
                href: "/post",
              },
              {
                icon: Search,
                eyebrow: "For Detailers",
                title: "Find & bid on jobs",
                description:
                  "Browse local detailing requests, filter by amenities, accept the asking price, or send a counter-offer.",
                image: "/img/work.png",
                href: "/dashboard",
              },
              {
                icon: HomeIcon,
                eyebrow: "For Hosts",
                title: "List your space",
                description:
                  "Driveway, garage, or commercial bay — set an hourly or flat rate and let detailers book your spot.",
                image: "/img/space.png",
                href: "/host",
              },
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <Link
                  key={step.title}
                  href={step.href}
                  className="glass glass-hover overflow-hidden flex flex-col reveal"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(7,9,13,0) 40%, rgba(7,9,13,0.85) 100%)",
                      }}
                    />
                    <div className="absolute top-4 left-4 w-11 h-11 rounded-xl bg-[var(--bg-base)]/70 backdrop-blur-md border border-[var(--border-bright)] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[var(--gold)]" />
                    </div>
                  </div>
                  <div className="p-7 flex-1 flex flex-col">
                    <span className="eyebrow mb-3">{step.eyebrow}</span>
                    <h3 className="serif text-2xl text-white mb-3">{step.title}</h3>
                    <p className="text-[var(--text-muted)] text-sm leading-relaxed flex-1">
                      {step.description}
                    </p>
                    <div className="mt-5 text-sm text-[var(--gold-light)] inline-flex items-center gap-1.5">
                      Get started <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden border-t border-[var(--border)]">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(240, 180, 41, 0.18), transparent 70%)",
            }}
          />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
            <span className="eyebrow mb-4 block">Get started</span>
            <h2 className="serif text-4xl sm:text-5xl text-white mb-4">
              Ready for that <span className="gold-text">mirror finish?</span>
            </h2>
            <p className="text-[var(--text-muted)] max-w-lg mx-auto mb-10">
              Sign up in under a minute. Post a job, take a job, or list your space —
              we pair you with the right person.
            </p>
            <Link href="/auth" className="btn-gold text-base px-8 py-4">
              Create your account <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-[var(--text-faint)]">
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none" aria-label="Palm Polish">
              <defs>
                <linearGradient id="footerG" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ffcd57" />
                  <stop offset="100%" stopColor="#c8941a" />
                </linearGradient>
              </defs>
              <path
                d="M16 31 C 15.4 24 15.2 19 16 12"
                stroke="url(#footerG)"
                strokeWidth="1.4"
                strokeLinecap="round"
                fill="none"
              />
              <g
                stroke="url(#footerG)"
                strokeWidth="1.6"
                strokeLinecap="round"
                fill="none"
              >
                <path d="M16 12 C 12 9 8 7 4 6" />
                <path d="M16 12 C 20 9 24 7 28 6" />
                <path d="M16 12 C 12 11 8 12 4 14" />
                <path d="M16 12 C 20 11 24 12 28 14" />
                <path d="M16 12 C 14 8 13 5 12 2" />
                <path d="M16 12 C 18 8 19 5 20 2" />
              </g>
              <circle cx="16" cy="12" r="1.6" fill="url(#footerG)" />
            </svg>
            <span className="serif text-white" style={{ letterSpacing: "0.04em" }}>
              PALM POLISH
            </span>
          </div>
          <p>
            &copy; {new Date().getFullYear()} Palm Polish. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
