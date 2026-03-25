"use client";

// PAGE DE GESTION D'ABONNEMENT
// Affiche le plan actuel et permet de changer ou d'annuler

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
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { data } = await supabase
        .from("subscriptions")
        .select("plan, status, current_period_end, stripe_subscription_id")
        .single();

      setSubscription(data);
      setLoading(false);
    }

    loadSubscription();
  }, [supabase, router]);

  // Lance le checkout Stripe pour s'abonner
  const handleCheckout = async (plan: "starter" | "pro") => {
    setCheckoutLoading(plan);
    try {
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirige vers la page de paiement Stripe
        window.location.href = data.url;
      } else {
        alert(data.error || "Erreur lors de la création du paiement.");
      }
    } catch {
      alert("Erreur de connexion. Réessaie.");
    } finally {
      setCheckoutLoading(null);
    }
  };

  // Ouvre le portail Stripe pour gérer l'abonnement
  const handleManage = async () => {
    setPortalLoading(true);
    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Erreur lors de l'ouverture du portail.");
      }
    } catch {
      alert("Erreur de connexion. Réessaie.");
    } finally {
      setPortalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const currentPlan = subscription?.plan || "none";
  const isActive = subscription?.status === "active";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mon abonnement</h1>
        <p className="text-gray-500 mt-1">Gère ton plan et ta facturation.</p>
      </div>

      {/* Statut actuel */}
      {subscription && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Plan actuel</p>
              <p className="text-2xl font-bold text-gray-900 capitalize">
                {currentPlan === "none" ? "Aucun" : currentPlan}
              </p>
              <p
                className={`text-sm mt-1 ${isActive ? "text-green-600" : "text-red-500"}`}
              >
                {isActive ? "✓ Actif" : "✗ Inactif"}
              </p>
              {subscription.current_period_end && (
                <p className="text-sm text-gray-400 mt-1">
                  Prochain renouvellement :{" "}
                  {new Date(subscription.current_period_end).toLocaleDateString(
                    "fr-FR",
                    { day: "numeric", month: "long", year: "numeric" }
                  )}
                </p>
              )}
            </div>
            {subscription.stripe_subscription_id && (
              <button
                onClick={handleManage}
                disabled={portalLoading}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition text-sm font-medium disabled:opacity-50"
              >
                {portalLoading ? "Chargement..." : "Gérer sur Stripe"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Plans disponibles */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Choisir un plan
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Plan Starter */}
        <div
          className={`rounded-2xl p-6 border-2 transition ${
            currentPlan === "starter" && isActive
              ? "border-orange-500 bg-orange-50"
              : "border-gray-100 bg-white"
          }`}
        >
          <h3 className="text-xl font-bold text-gray-900">Starter</h3>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-bold">49€</span>
            <span className="text-gray-500">/mois</span>
          </div>
          <ul className="mt-4 space-y-2">
            {[
              "30 générations par mois",
              "Posts Instagram & Facebook",
              "Historique 30 jours",
              "Support par email",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-orange-500">✓</span> {f}
              </li>
            ))}
          </ul>
          {currentPlan === "starter" && isActive ? (
            <div className="mt-6 text-center py-2.5 rounded-xl bg-orange-100 text-orange-700 font-semibold text-sm">
              Plan actuel
            </div>
          ) : (
            <button
              onClick={() => handleCheckout("starter")}
              disabled={checkoutLoading !== null}
              className="mt-6 w-full bg-orange-500 text-white py-2.5 rounded-xl font-semibold hover:bg-orange-600 transition disabled:opacity-50"
            >
              {checkoutLoading === "starter"
                ? "Redirection..."
                : "Choisir Starter"}
            </button>
          )}
        </div>

        {/* Plan Pro */}
        <div
          className={`rounded-2xl p-6 border-2 transition relative ${
            currentPlan === "pro" && isActive
              ? "border-orange-500 bg-orange-50"
              : "border-gray-100 bg-white"
          }`}
        >
          <span className="absolute -top-3 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            RECOMMANDÉ
          </span>
          <h3 className="text-xl font-bold text-gray-900">Pro</h3>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-bold">99€</span>
            <span className="text-gray-500">/mois</span>
          </div>
          <ul className="mt-4 space-y-2">
            {[
              "Générations illimitées",
              "Tous les réseaux sociaux",
              "Historique illimité",
              "Support prioritaire",
              "Tons personnalisés",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-orange-500">✓</span> {f}
              </li>
            ))}
          </ul>
          {currentPlan === "pro" && isActive ? (
            <div className="mt-6 text-center py-2.5 rounded-xl bg-orange-100 text-orange-700 font-semibold text-sm">
              Plan actuel
            </div>
          ) : (
            <button
              onClick={() => handleCheckout("pro")}
              disabled={checkoutLoading !== null}
              className="mt-6 w-full bg-orange-500 text-white py-2.5 rounded-xl font-semibold hover:bg-orange-600 transition disabled:opacity-50"
            >
              {checkoutLoading === "pro"
                ? "Redirection..."
                : "Choisir Pro"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
