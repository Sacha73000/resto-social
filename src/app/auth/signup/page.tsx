"use client";

// PAGE D'INSCRIPTION — style sombre luxueux

import { useState } from "react";
import Link from "next/link";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password.length < 6) {
      setError("Le mot de passe doit faire au moins 6 caractères.");
      setLoading(false);
      return;
    }

    try {
      const supabase = getSupabaseBrowser();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { restaurant_name: restaurantName } },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          setError("Un compte existe déjà avec cet email. Connecte-toi plutôt !");
        } else {
          setError("Erreur lors de l'inscription : " + error.message);
        }
        return;
      }

      // Supabase renvoie un user avec identities vide si l'email existe déjà
      if (data?.user?.identities?.length === 0) {
        setError("Un compte existe déjà avec cet email. Connecte-toi plutôt !");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Une erreur inattendue est survenue. Réessaie.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 pt-20">
        <div className="w-full max-w-md text-center">
          <div className="bg-[#1A1A1A] rounded-xl p-8 border border-[#C9A96E]/20">
            <span className="text-5xl">📧</span>
            <h2 className="mt-4 text-2xl font-[family-name:var(--font-playfair)] font-bold text-white">
              Vérifie ta boîte mail !
            </h2>
            <p className="mt-2 text-gray-400">
              On t&apos;a envoyé un email de confirmation à{" "}
              <strong className="text-[#C9A96E]">{email}</strong>. Clique sur le lien pour activer ton compte.
            </p>
            <Link
              href="/auth/login"
              className="mt-6 inline-block bg-[#C9A96E] text-black px-6 py-2.5 rounded-lg font-semibold hover:bg-[#D4B87A] transition uppercase tracking-wider text-sm"
            >
              Aller à la connexion
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 pt-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-white">Créer un compte</h1>
          <p className="mt-2 text-gray-500">
            Commence à générer des posts pour ton restaurant.
          </p>
        </div>

        <form
          onSubmit={handleSignup}
          className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-8 space-y-5"
        >
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="restaurant" className="block text-sm font-medium text-gray-400 mb-1">
              Nom du restaurant
            </label>
            <input
              id="restaurant"
              type="text"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              required
              placeholder="Ex: Le Petit Bistro"
              className="w-full px-4 py-2.5 rounded-lg bg-[#222] border border-[#333] text-white placeholder-gray-600 focus:border-[#C9A96E] focus:ring-1 focus:ring-[#C9A96E]/20 outline-none transition"
            />
          </div>

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
              placeholder="Minimum 6 caractères"
              className="w-full px-4 py-2.5 rounded-lg bg-[#222] border border-[#333] text-white placeholder-gray-600 focus:border-[#C9A96E] focus:ring-1 focus:ring-[#C9A96E]/20 outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C9A96E] text-black py-3 rounded-lg font-semibold hover:bg-[#D4B87A] transition disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm"
          >
            {loading ? "Création du compte..." : "Créer mon compte"}
          </button>

          <p className="text-center text-sm text-gray-500">
            Déjà un compte ?{" "}
            <Link href="/auth/login" className="text-[#C9A96E] font-medium hover:underline">
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
