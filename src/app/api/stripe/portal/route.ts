// API ROUTE : Ouvre le portail client Stripe
// POST /api/stripe/portal
// Permet à l'utilisateur de gérer son abonnement (annuler, changer de carte, etc.)

import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { stripe } from "@/lib/stripe";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Tu dois être connecté." },
        { status: 401 }
      );
    }

    // Récupère le Stripe customer ID
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .single();

    if (!subscription?.stripe_customer_id) {
      return NextResponse.json(
        { error: "Aucun abonnement trouvé. Choisis d'abord un plan." },
        { status: 404 }
      );
    }

    // Crée une session portail Stripe
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${appUrl}/subscription`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Erreur Stripe portal :", error);
    return NextResponse.json(
      { error: "Erreur lors de l'ouverture du portail Stripe." },
      { status: 500 }
    );
  }
}
