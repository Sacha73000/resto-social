// API ROUTE : Vérifie et synchronise l'abonnement Stripe avec la base de données
// POST /api/stripe/verify
// Appelée après le paiement pour s'assurer que l'abonnement est bien activé

import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { stripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase-server";

export async function POST() {
  try {
    // 1. Vérifie l'auth
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

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non connecté" }, { status: 401 });
    }

    // 2. Récupère le customer Stripe depuis la base
    const adminSupabase = createServiceClient();
    const { data: sub } = await adminSupabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    if (!sub?.stripe_customer_id) {
      return NextResponse.json({ status: "no_customer" });
    }

    // 3. Vérifie les abonnements actifs sur Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: sub.stripe_customer_id,
      status: "active",
      limit: 1,
    });

    if (subscriptions.data.length > 0) {
      const stripeSub = subscriptions.data[0];
      // Détermine le plan à partir du price ID
      const priceId = stripeSub.items.data[0]?.price?.id;
      const starterPriceId = process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID;
      const proPriceId = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID;

      let plan = "starter";
      if (priceId === proPriceId) plan = "pro";
      else if (priceId === starterPriceId) plan = "starter";

      // 4. Met à jour la base de données
      await adminSupabase
        .from("subscriptions")
        .upsert(
          {
            user_id: user.id,
            stripe_customer_id: sub.stripe_customer_id,
            stripe_subscription_id: stripeSub.id,
            plan,
            status: "active",
            current_period_end: new Date((stripeSub as unknown as { current_period_end: number }).current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );

      return NextResponse.json({ status: "active", plan });
    }

    return NextResponse.json({ status: "no_active_subscription" });
  } catch (error) {
    console.error("Erreur vérification Stripe :", error);
    const errMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
