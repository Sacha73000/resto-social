// API ROUTE : Vérifie et synchronise l'abonnement Stripe avec la base de données
// POST /api/stripe/verify
// Cherche directement dans Stripe par email (ne dépend pas de la base)

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
    if (!user || !user.email) {
      console.error("[verify] Pas d'utilisateur connecté");
      return NextResponse.json({ error: "Non connecté" }, { status: 401 });
    }

    console.log("[verify] User:", user.email, user.id);

    // 2. Cherche TOUS les customers Stripe avec cet email
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 10,
    });

    console.log("[verify] Customers Stripe trouvés:", customers.data.length);

    if (customers.data.length === 0) {
      return NextResponse.json({ status: "no_customer" });
    }

    // 3. Cherche un abonnement actif parmi tous les customers
    for (const customer of customers.data) {
      const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        status: "active",
        limit: 1,
      });

      console.log("[verify] Customer:", customer.id, "- Subs actifs:", subscriptions.data.length);

      if (subscriptions.data.length > 0) {
        const stripeSub = subscriptions.data[0];
        const priceId = stripeSub.items.data[0]?.price?.id;
        const starterPriceId = process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID;
        const proPriceId = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID;

        console.log("[verify] Price ID trouvé:", priceId, "| Starter:", starterPriceId, "| Pro:", proPriceId);

        let plan = "starter";
        if (priceId === proPriceId) plan = "pro";
        else if (priceId === starterPriceId) plan = "starter";

        // current_period_end est dans les items (nouvelle API Stripe 2026)
        const item = stripeSub.items.data[0] as unknown as { current_period_end?: number };
        const periodEnd = item?.current_period_end || Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;

        console.log("[verify] Plan:", plan, "| Period end:", periodEnd);

        // 4. Met à jour la base de données
        const adminSupabase = createServiceClient();

        // D'abord, supprime toute entrée existante pour cet utilisateur
        const { error: deleteError } = await adminSupabase
          .from("subscriptions")
          .delete()
          .eq("user_id", user.id);

        console.log("[verify] Delete existing:", deleteError ? deleteError.message : "OK");

        // Puis insère la nouvelle entrée
        const { error: insertError } = await adminSupabase
          .from("subscriptions")
          .insert({
            user_id: user.id,
            stripe_customer_id: customer.id,
            stripe_subscription_id: stripeSub.id,
            plan,
            status: "active",
            current_period_end: new Date(periodEnd * 1000).toISOString(),
          });

        if (insertError) {
          console.error("[verify] INSERT ERROR:", insertError);
          return NextResponse.json({ error: insertError.message, step: "insert" }, { status: 500 });
        }

        console.log("[verify] SUCCESS! Plan:", plan);
        return NextResponse.json({ status: "active", plan });
      }
    }

    console.log("[verify] Aucun abonnement actif trouvé");
    return NextResponse.json({ status: "no_active_subscription" });
  } catch (error) {
    console.error("[verify] ERREUR:", error);
    const errMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
