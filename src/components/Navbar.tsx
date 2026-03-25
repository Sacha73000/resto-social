"use client";

// Barre de navigation principale — s'affiche sur toutes les pages
// Affiche des liens différents si l'utilisateur est connecté ou non

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

export default function Navbar() {
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const supabase = getSupabaseBrowser();

  useEffect(() => {
    async function init() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    }
    init();

    // Écoute les changements de connexion/déconnexion
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event: string, session: { user: { id: string } | null } | null) => {
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <nav className="bg-white shadow-sm border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🍽️</span>
            <span className="font-bold text-xl text-gray-900">
              Resto<span className="text-orange-500">Social</span>
            </span>
          </Link>

          {/* Menu desktop */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-orange-500 transition"
                >
                  Dashboard
                </Link>
                <Link
                  href="/generate"
                  className="text-gray-600 hover:text-orange-500 transition"
                >
                  Générer
                </Link>
                <Link
                  href="/subscription"
                  className="text-gray-600 hover:text-orange-500 transition"
                >
                  Abonnement
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/#pricing"
                  className="text-gray-600 hover:text-orange-500 transition"
                >
                  Tarifs
                </Link>
                <Link
                  href="/auth/login"
                  className="text-gray-600 hover:text-orange-500 transition"
                >
                  Connexion
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
                >
                  Essai gratuit
                </Link>
              </>
            )}
          </div>

          {/* Bouton menu mobile (hamburger) */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Menu mobile déroulant */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="block py-2 text-gray-600 hover:text-orange-500"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/generate"
                  className="block py-2 text-gray-600 hover:text-orange-500"
                  onClick={() => setMenuOpen(false)}
                >
                  Générer
                </Link>
                <Link
                  href="/subscription"
                  className="block py-2 text-gray-600 hover:text-orange-500"
                  onClick={() => setMenuOpen(false)}
                >
                  Abonnement
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-orange-500 font-medium"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/#pricing"
                  className="block py-2 text-gray-600 hover:text-orange-500"
                  onClick={() => setMenuOpen(false)}
                >
                  Tarifs
                </Link>
                <Link
                  href="/auth/login"
                  className="block py-2 text-gray-600 hover:text-orange-500"
                  onClick={() => setMenuOpen(false)}
                >
                  Connexion
                </Link>
                <Link
                  href="/auth/signup"
                  className="block py-2 text-orange-500 font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  Essai gratuit
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
