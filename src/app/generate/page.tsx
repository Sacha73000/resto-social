"use client";

// PAGE DE GÉNÉRATION — style sombre luxueux

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

export default function GeneratePage() {
  const [restaurantName, setRestaurantName] = useState("");
  const [cuisineType, setCuisineType] = useState("");
  const [postType, setPostType] = useState("");
  const [platform, setPlatform] = useState("");
  const [tone, setTone] = useState("");
  const [details, setDetails] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const router = useRouter();
  const supabase = getSupabaseBrowser();

  useEffect(() => {
    async function check() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) { router.push("/auth/login"); } else { setCheckingAuth(false); }
    }
    check();
  }, [supabase.auth, router]);

  const cuisineTypes = [
    "Française", "Italienne", "Japonaise", "Chinoise", "Mexicaine",
    "Indienne", "Thaïlandaise", "Libanaise", "Américaine (Burger)",
    "Pizza", "Fruits de mer", "Végétarien/Vegan", "Brasserie",
    "Gastronomique", "Street food", "Autre",
  ];

  const postTypes = [
    "Plat du jour", "Nouveau plat", "Promotion / Offre spéciale",
    "Événement (soirée, brunch...)", "Ambiance du restaurant",
    "Avis client / Témoignage", "Recrutement", "Annonce générale",
  ];

  const platforms = [
    { value: "instagram", label: "Instagram", emoji: "📸" },
    { value: "facebook", label: "Facebook", emoji: "👍" },
    { value: "twitter", label: "Twitter / X", emoji: "🐦" },
    { value: "linkedin", label: "LinkedIn", emoji: "💼" },
    { value: "google", label: "Google My Business", emoji: "📍" },
  ];

  const tones = [
    "Fun et décontracté", "Élégant et raffiné", "Promotionnel (vente)",
    "Chaleureux et familial", "Branché et moderne", "Informatif",
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult("");
    setLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurantName, cuisineType, postType, platform, tone, details }),
      });

      const data = await response.json();
      if (!response.ok) { setError(data.error || "Erreur lors de la génération. Réessaie."); return; }
      setResult(data.content);
    } catch {
      setError("Erreur de connexion. Vérifie ta connexion internet et réessaie.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A96E]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-white">Générer un post</h1>
        <p className="text-gray-500 mt-1">Remplis le formulaire et laisse l&apos;IA créer ton post.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* FORMULAIRE */}
        <form onSubmit={handleGenerate} className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-6 space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Nom du restaurant *</label>
            <input
              type="text" value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)}
              required placeholder="Ex: Le Petit Bistro"
              className="w-full px-4 py-2.5 rounded-lg bg-[#222] border border-[#333] text-white placeholder-gray-600 focus:border-[#C9A96E] focus:ring-1 focus:ring-[#C9A96E]/20 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Type de cuisine *</label>
            <select
              value={cuisineType} onChange={(e) => setCuisineType(e.target.value)} required
              className="w-full px-4 py-2.5 rounded-lg bg-[#222] border border-[#333] text-white focus:border-[#C9A96E] focus:ring-1 focus:ring-[#C9A96E]/20 outline-none transition"
            >
              <option value="">Choisis un type</option>
              {cuisineTypes.map((type) => (<option key={type} value={type}>{type}</option>))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Type de post *</label>
            <select
              value={postType} onChange={(e) => setPostType(e.target.value)} required
              className="w-full px-4 py-2.5 rounded-lg bg-[#222] border border-[#333] text-white focus:border-[#C9A96E] focus:ring-1 focus:ring-[#C9A96E]/20 outline-none transition"
            >
              <option value="">Choisis un type</option>
              {postTypes.map((type) => (<option key={type} value={type}>{type}</option>))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Plateforme *</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {platforms.map((p) => (
                <button
                  type="button" key={p.value} onClick={() => setPlatform(p.value)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition ${
                    platform === p.value
                      ? "border-[#C9A96E] bg-[#C9A96E]/10 text-[#C9A96E]"
                      : "border-[#333] hover:border-[#444] text-gray-400"
                  }`}
                >
                  <span>{p.emoji}</span>{p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Ton souhaité *</label>
            <select
              value={tone} onChange={(e) => setTone(e.target.value)} required
              className="w-full px-4 py-2.5 rounded-lg bg-[#222] border border-[#333] text-white focus:border-[#C9A96E] focus:ring-1 focus:ring-[#C9A96E]/20 outline-none transition"
            >
              <option value="">Choisis un ton</option>
              {tones.map((t) => (<option key={t} value={t}>{t}</option>))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Détails supplémentaires <span className="text-gray-600">(optionnel)</span>
            </label>
            <textarea
              value={details} onChange={(e) => setDetails(e.target.value)}
              placeholder="Ex: On lance un nouveau burger au foie gras, prix à 18€..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg bg-[#222] border border-[#333] text-white placeholder-gray-600 focus:border-[#C9A96E] focus:ring-1 focus:ring-[#C9A96E]/20 outline-none transition resize-none"
            />
          </div>

          <button
            type="submit" disabled={loading || !platform}
            className="w-full bg-[#C9A96E] text-black py-3 rounded-lg font-semibold hover:bg-[#D4B87A] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-wider text-sm"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                Génération en cours...
              </>
            ) : (
              <>✦ Générer le post</>
            )}
          </button>
        </form>

        {/* RÉSULTAT */}
        <div>
          <div className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-6 min-h-[300px] flex flex-col">
            <h2 className="text-lg font-semibold text-white mb-4">Résultat</h2>

            {result ? (
              <div className="flex-1 flex flex-col">
                <div className="flex-1 bg-[#222] rounded-lg p-4 mb-4 border border-[#333]">
                  <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{result}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={copyToClipboard}
                    className="flex-1 bg-[#C9A96E] text-black py-2.5 rounded-lg font-semibold hover:bg-[#D4B87A] transition uppercase tracking-wider text-sm"
                  >
                    {copied ? "✓ Copié !" : "Copier le post"}
                  </button>
                  <button
                    onClick={() => handleGenerate({ preventDefault: () => {} } as React.FormEvent)}
                    className="px-4 py-2.5 rounded-lg border border-[#333] text-gray-400 hover:text-[#C9A96E] hover:border-[#C9A96E] transition"
                  >
                    ↻
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center">
                <div>
                  <span className="text-5xl">✨</span>
                  <p className="mt-4 text-gray-500">
                    Remplis le formulaire et clique sur &quot;Générer&quot; pour voir ton post apparaître ici.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
