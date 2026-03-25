"use client";

// PAGE ABONNEMENT — style sombre luxueux

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

interface Subscription {
  plan: string;
  status: string;
  current_period_end: string | null;
  stripe_subscription_id: string | null;
}

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const router = useRouter();
  const supabase = getSupabaseBrowser();

  useEffect(() => {
    async function loadSubscription() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth/login"); return; }

      const { data } = await supabase
        .from("subscriptions")
        .select("plan, status, current_period_end, stripe_subscription_id")
        .single();

      setSubscription(data);
      setLoading(false);
    }
    loadSubscription();
  }, [supabase, router]);

  const handleCheckout = async (plan: "starter" | "pro") => {
    setCheckoutLoading(plan);
    try {
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await response.json();
      if (data.url) { window.location.href = data.url; }
      else { alert(data.error || "Erreur lors de la création du paiement."); }
    } catch { alert("Erreur de connexion. Réessaie."); }
    finally { setCheckoutLoading(null); }
  };

  const handleManage = async () => {
    setPortalLoading(true);
    try {
      const response = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await response.json();
      if (data.url) { window.location.href = data.url; }
      else { alert(data.error || "Erreur lors de l'ouverture du portail."); }
    } catch { alert("Erreur de connexion. Réessaie."); }
    finally { setPortalLoading(false); }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A96E]"></div>
      </div>
    );
  }

  const currentPlan = subscription?.plan || "none";
  const isActive = subscription?.status === "active";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-white">Mon abonnement</h1>
        <p className="text-gray-500 mt-1">Gère ton plan et ta facturation.</p>
      </div>

      {/* Statut actuel */}
      {subscription && (
        <div className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Plan actuel</p>
              <p className="text-2xl font-bold text-white capitalize">
                {currentPlan === "none" ? "Aucun" : currentPlan}
              </p>
              <p className={`text-sm mt-1 ${isActive ? "text-green-400" : "text-red-400"}`}>
                {isActive ? "✓ Actif" : "✗ Inactif"}
              </p>
              {subscription.current_period_end && (
                <p className="text-sm text-gray-600 mt-1">
                  Prochain renouvellement :{" "}
                  {new Date(subscription.current_period_end).toLocaleDateString("fr-FR", {
                    day: "numeric", month: "long", year: "numeric",
                  })}
                </p>
              )}
            </div>
            {subscription.stripe_subscription_id && (
              <button
                onClick={handleManage}
                disabled={portalLoading}
                className="border border-[#333] text-gray-400 px-4 py-2 rounded hover:border-[#C9A96E] hover:text-[#C9A96E] transition text-sm font-medium disabled:opacity-50"
              >
                {portalLoading ? "Chargement..." : "Gérer sur Stripe"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Plans */}
      <h2 className="text-xl font-bold text-white mb-4">Choisir un plan</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Starter */}
        <div className={`rounded-xl p-6 border-2 transition ${
          currentPlan === "starter" && isActive
            ? "border-[#C9A96E] bg-[#C9A96E]/5"
            : "border-[#2A2A2A] bg-[#1A1A1A]"
        }`}>
          <h3 className="text-xl font-bold text-white">Starter</h3>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-bold text-white">49€</span>
            <span className="text-gray-500">/mois</span>
          </div>
          <ul className="mt-4 space-y-2">
            {["30 générations par mois", "Posts Instagram & Facebook", "Historique 30 jours", "Support par email"].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-gray-400">
                <span className="text-[#C9A96E]">✓</span> {f}
              </li>
            ))}
          </ul>
          {currentPlan === "starter" && isActive ? (
            <div className="mt-6 text-center py-2.5 rounded bg-[#C9A96E]/10 text-[#C9A96E] font-semibold text-sm">
              Plan actuel
            </div>
          ) : (
            <button
              onClick={() => handleCheckout("starter")}
              disabled={checkoutLoading !== null}
              className="mt-6 w-full bg-[#C9A96E] text-black py-2.5 rounded font-semibold hover:bg-[#D4B87A] transition disabled:opacity-50 uppercase tracking-wider text-sm"
            >
              {checkoutLoading === "starter" ? "Redirection..." : "Choisir Starter"}
            </button>
          )}
        </div>

        {/* Pro */}
        <div className={`rounded-xl p-6 border-2 transition relative ${
          currentPlan === "pro" && isActive
            ? "border-[#C9A96E] bg-[#C9A96E]/5"
            : "border-[#2A2A2A] bg-[#1A1A1A]"
        }`}>
          <span className="absolute -top-3 left-4 bg-[#C9A96E] text-black text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
            Recommandé
          </span>
          <h3 className="text-xl font-bold text-white">Pro</h3>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-bold text-white">99€</span>
            <span className="text-gray-500">/mois</span>
          </div>
          <ul className="mt-4 space-y-2">
            {["Générations illimitées", "Tous les réseaux sociaux", "Historique illimité", "Support prioritaire", "Tons personnalisés"].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-gray-400">
                <span className="text-[#C9A96E]">✓</span> {f}
              </li>
            ))}
          </ul>
          {currentPlan === "pro" && isActive ? (
            <div className="mt-6 text-center py-2.5 rounded bg-[#C9A96E]/10 text-[#C9A96E] font-semibold text-sm">
              Plan actuel
            </div>
          ) : (
            <button
              onClick={() => handleCheckout("pro")}
              disabled={checkoutLoading !== null}
              className="mt-6 w-full bg-[#C9A96E] text-black py-2.5 rounded font-semibold hover:bg-[#D4B87A] transition disabled:opacity-50 uppercase tracking-wider text-sm"
            >
              {checkoutLoading === "pro" ? "Redirection..." : "Choisir Pro"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
