"use client";

// Barre de navigation — style sombre luxueux avec accents dorés

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

export default function Navbar() {
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const supabase = getSupabaseBrowser();

  useEffect(() => {
    async function init() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    }
    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event: string, session: { user: { id: string } | null } | null) => {
        setUser(session?.user ?? null);
      }
    );

    // Effet de scroll pour la navbar
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    return () => {
      listener.subscription.unsubscribe();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-[#1A1A1A]/95 backdrop-blur-md shadow-lg shadow-black/20" : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-[family-name:var(--font-playfair)] font-bold text-2xl text-white">
              Resto<span className="text-[#C9A96E]">Social</span>
            </span>
          </Link>

          {/* Menu desktop */}
          <div className="hidden md:flex items-center gap-8">
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-400 hover:text-[#C9A96E] transition text-sm uppercase tracking-wider">
                  Dashboard
                </Link>
                <Link href="/generate" className="text-gray-400 hover:text-[#C9A96E] transition text-sm uppercase tracking-wider">
                  Générer
                </Link>
                <Link href="/subscription" className="text-gray-400 hover:text-[#C9A96E] transition text-sm uppercase tracking-wider">
                  Abonnement
                </Link>
                <button
                  onClick={handleLogout}
                  className="border border-[#C9A96E] text-[#C9A96E] px-5 py-2 rounded text-sm uppercase tracking-wider hover:bg-[#C9A96E] hover:text-black transition"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link href="/#pricing" className="text-gray-400 hover:text-[#C9A96E] transition text-sm uppercase tracking-wider">
                  Tarifs
                </Link>
                <Link href="/auth/login" className="text-gray-400 hover:text-[#C9A96E] transition text-sm uppercase tracking-wider">
                  Connexion
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-[#C9A96E] text-black px-5 py-2 rounded text-sm uppercase tracking-wider font-semibold hover:bg-[#D4B87A] transition"
                >
                  Essai gratuit
                </Link>
              </>
            )}
          </div>

          {/* Bouton menu mobile */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-6 h-6 text-[#C9A96E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Menu mobile */}
        {menuOpen && (
          <div className="md:hidden pb-6 space-y-3 bg-[#1A1A1A]/95 backdrop-blur-md rounded-b-xl px-2">
            {user ? (
              <>
                <Link href="/dashboard" className="block py-3 text-gray-400 hover:text-[#C9A96E] text-sm uppercase tracking-wider" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <Link href="/generate" className="block py-3 text-gray-400 hover:text-[#C9A96E] text-sm uppercase tracking-wider" onClick={() => setMenuOpen(false)}>Générer</Link>
                <Link href="/subscription" className="block py-3 text-gray-400 hover:text-[#C9A96E] text-sm uppercase tracking-wider" onClick={() => setMenuOpen(false)}>Abonnement</Link>
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="block w-full text-left py-3 text-[#C9A96E] font-medium text-sm uppercase tracking-wider">Déconnexion</button>
              </>
            ) : (
              <>
                <Link href="/#pricing" className="block py-3 text-gray-400 hover:text-[#C9A96E] text-sm uppercase tracking-wider" onClick={() => setMenuOpen(false)}>Tarifs</Link>
                <Link href="/auth/login" className="block py-3 text-gray-400 hover:text-[#C9A96E] text-sm uppercase tracking-wider" onClick={() => setMenuOpen(false)}>Connexion</Link>
                <Link href="/auth/signup" className="block py-3 text-[#C9A96E] font-medium text-sm uppercase tracking-wider" onClick={() => setMenuOpen(false)}>Essai gratuit</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
