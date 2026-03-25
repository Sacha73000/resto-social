"use client";

// PAGE DE CONNEXION — style sombre luxueux

import { useState } from "react";
import Link from "next/link";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = getSupabaseBrowser();
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        if (error.message.includes("Invalid login")) {
          setError("Email ou mot de passe incorrect.");
        } else if (error.message.includes("Email not confirmed")) {
          setError("Confirme ton email avant de te connecter. Vérifie ta boîte mail.");
        } else {
          setError("Erreur de connexion : " + error.message);
        }
        return;
      }

      window.location.href = "/dashboard";
    } catch {
      setError("Une erreur inattendue est survenue. Réessaie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 pt-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-white">Connexion</h1>
          <p className="mt-2 text-gray-500">
            Content de te revoir ! Connecte-toi à ton compte.
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-8 space-y-5"
        >
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="ton@email.com"
              className="w-full px-4 py-2.5 rounded-lg bg-[#222] border border-[#333] text-white placeholder-gray-600 focus:border-[#C9A96E] focus:ring-1 focus:ring-[#C9A96E]/20 outline-none transition"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-lg bg-[#222] border border-[#333] text-white placeholder-gray-600 focus:border-[#C9A96E] focus:ring-1 focus:ring-[#C9A96E]/20 outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C9A96E] text-black py-3 rounded-lg font-semibold hover:bg-[#D4B87A] transition disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>

          <p className="text-center text-sm text-gray-500">
            Pas encore de compte ?{" "}
            <Link href="/auth/signup" className="text-[#C9A96E] font-medium hover:underline">
              Créer un compte
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
