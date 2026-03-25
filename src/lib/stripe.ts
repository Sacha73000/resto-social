// Configuration Stripe côté serveur
// Gère les paiements et abonnements

import Stripe from "stripe";

// Client Stripe (initialisé à la demande pour éviter de crasher au build sans clé)
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error(
        "STRIPE_SECRET_KEY manquante ! Configure-la dans ton .env.local pour activer les paiements."
      );
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-02-25.clover",
      typescript: true,
    });
  }
  return _stripe;
}

// Alias pour compatibilité — proxy paresseux qui initialise Stripe au premier appel
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (getStripe() as any)[prop];
  },
});

// Les deux plans d'abonnement
export const PLANS = {
  starter: {
    name: "Starter",
    price: 49,
    generations: 30,
    priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID || "",
    features: [
      "30 générations par mois",
      "Posts Instagram & Facebook",
      "Historique 30 jours",
      "Support par email",
    ],
  },
  pro: {
    name: "Pro",
    price: 99,
    generations: Infinity,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || "",
    features: [
      "Générations illimitées",
      "Tous les réseaux sociaux",
      "Historique illimité",
      "Support prioritaire",
      "Tons personnalisés",
    ],
  },
} as const;

export type PlanType = keyof typeof PLANS;
