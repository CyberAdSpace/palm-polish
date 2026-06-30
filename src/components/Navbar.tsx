"use client";

import Link from "next/link";
import { useAppStore } from "@/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/post", label: "Post a Job" },
  { href: "/dashboard", label: "Detailer Board" },
  { href: "/host", label: "Host a Space" },
];

function PalmMark({ size = 30 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-label="Palm Polish"
    >
      <defs>
        <linearGradient id="palmG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffcd57" />
          <stop offset="100%" stopColor="#c8941a" />
        </linearGradient>
      </defs>
      {/* trunk */}
      <path
        d="M16 31 C 15.4 24 15.2 19 16 12"
        stroke="url(#palmG)"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      {/* fronds: 6 strokes radiating from crown */}
      <g
        stroke="url(#palmG)"
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
      {/* crown dot */}
      <circle cx="16" cy="12" r="1.6" fill="url(#palmG)" />
    </svg>
  );
}

export default function Navbar() {
  const { currentUser, logout } = useAppStore();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <>
      <nav className="sticky top-0 z-50 glass-strong">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="flex items-center gap-2.5 group"
              onClick={() => setMenuOpen(false)}
            >
              <PalmMark />
              <span
                className="serif text-xl text-white"
                style={{ letterSpacing: "0.04em" }}
              >
                PALM POLISH
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-3 py-2 text-[13px] uppercase tracking-[0.12em] text-[var(--text-muted)] hover:text-[var(--gold-light)] transition-colors group"
                >
                  {link.label}
                  <span className="absolute left-3 right-3 -bottom-0.5 h-px bg-[var(--gold)] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </Link>
              ))}

              <div className="ml-4 flex items-center gap-3">
                {currentUser ? (
                  <>
                    <span className="text-sm text-[var(--text-muted)] hidden lg:inline-flex items-center gap-2">
                      {currentUser.name}
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-[var(--gold)]/30 text-[var(--gold)] bg-[var(--gold)]/10">
                        {currentUser.role.replace("_", " ")}
                      </span>
                    </span>
                    <button
                      onClick={handleLogout}
                      className="btn-ghost text-sm py-2"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link href="/auth" className="btn-gold text-sm py-2">
                    Sign In
                  </Link>
                )}
              </div>
            </div>

            <button
              onClick={() => setMenuOpen(true)}
              className="md:hidden p-2 text-[var(--text-strong)]"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm glass-strong p-6 flex flex-col">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-2.5">
                <PalmMark />
                <span
                  className="serif text-lg text-white"
                  style={{ letterSpacing: "0.04em" }}
                >
                  PALM POLISH
                </span>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 text-[var(--text-muted)]"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col gap-1 mb-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-lg py-3 border-b border-[var(--border)] uppercase tracking-[0.1em] text-[var(--text-body)] hover:text-[var(--gold-light)] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="pt-6">
              {currentUser ? (
                <>
                  <div className="text-sm text-[var(--text-muted)] mb-3">
                    Signed in as {currentUser.name}
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="btn-ghost w-full"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/auth"
                  onClick={() => setMenuOpen(false)}
                  className="btn-gold w-full"
                >
                  Sign In
                </Link>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
