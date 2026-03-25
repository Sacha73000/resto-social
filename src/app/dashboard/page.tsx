"use client";

// PAGE DASHBOARD
// Affiche l'historique des posts générés et les stats de l'utilisateur

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

// Type pour une génération dans l'historique
interface Generation {
  id: string;
  restaurant_name: string;
  cuisine_type: string;
  post_type: string;
  platform: string;
  tone: string;
  generated_content: string;
  created_at: string;
}

interface Subscription {
  plan: string;
  status: string;
}

export default function DashboardPage() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [monthlyCount, setMonthlyCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const router = useRouter();
  const supabase = getSupabaseBrowser();

  useEffect(() => {
    async function loadData() {
      // Vérifie que l'utilisateur est connecté
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      // Charge l'historique des générations (les 50 plus récentes)
      const { data: gens } = await supabase
        .from("generations")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      // Charge l'abonnement
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("plan, status")
        .single();

      // Compte les générations de ce mois
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count } = await supabase
        .from("generations")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startOfMonth.toISOString());

      setGenerations(gens || []);
      setSubscription(sub);
      setMonthlyCount(count || 0);
      setLoading(false);
    }

    loadData();
  }, [supabase, router]);

  // Copier un post dans le presse-papier
  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Labels en français pour les plateformes
  const platformEmoji: Record<string, string> = {
    instagram: "📸",
    facebook: "👍",
    twitter: "🐦",
    linkedin: "💼",
    google: "📍",
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  const plan = subscription?.plan || "starter";
  const maxGenerations = plan === "pro" ? Infinity : 30;
  const remaining =
    plan === "pro" ? "∞" : Math.max(0, maxGenerations - monthlyCount);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Gère tes posts et suis ton utilisation.
          </p>
        </div>
        <Link
          href="/generate"
          className="bg-orange-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-orange-600 transition shadow-sm"
        >
          + Nouveau post
        </Link>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Générations ce mois</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {monthlyCount}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Restantes</p>
          <p className="text-3xl font-bold text-orange-500 mt-1">{remaining}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Plan actuel</p>
          <p className="text-3xl font-bold text-gray-900 mt-1 capitalize">
            {plan}
          </p>
          <Link
            href="/subscription"
            className="text-sm text-orange-500 hover:underline"
          >
            Gérer →
          </Link>
        </div>
      </div>

      {/* Historique des générations */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Historique des posts
      </h2>

      {generations.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <span className="text-5xl">🍽️</span>
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            Aucun post généré
          </h3>
          <p className="mt-2 text-gray-500">
            Crée ton premier post pour ton restaurant !
          </p>
          <Link
            href="/generate"
            className="mt-4 inline-block bg-orange-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-orange-600 transition"
          >
            Générer un post
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {generations.map((gen) => (
            <div
              key={gen.id}
              className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span>{platformEmoji[gen.platform] || "📝"}</span>
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {gen.platform}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-500 capitalize">
                      {gen.post_type}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-400">
                      {new Date(gen.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                    {gen.generated_content}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(gen.generated_content, gen.id)}
                  className="flex-shrink-0 bg-gray-50 hover:bg-orange-50 text-gray-600 hover:text-orange-500 px-3 py-2 rounded-lg text-sm transition"
                >
                  {copiedId === gen.id ? "✓ Copié !" : "Copier"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
