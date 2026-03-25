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
      return NextResponse.json({ error: "Non connecté" }, { status: 401 });
    }

    // 2. Cherche TOUS les customers Stripe avec cet email (ne dépend pas de la base)
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 10,
    });

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

      if (subscriptions.data.length > 0) {
        const stripeSub = subscriptions.data[0];
        const priceId = stripeSub.items.data[0]?.price?.id;
        const starterPriceId = process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID;
        const proPriceId = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID;

        let plan = "starter";
        if (priceId === proPriceId) plan = "pro";
        else if (priceId === starterPriceId) plan = "starter";

        // current_period_end est dans les items (nouvelle API Stripe)
        const item = stripeSub.items.data[0] as unknown as { current_period_end: number };
        const periodEnd = item?.current_period_end || Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;

        // 4. Met à jour la base de données avec upsert
        const adminSupabase = createServiceClient();
        const { error } = await adminSupabase
          .from("subscriptions")
          .upsert(
            {
              user_id: user.id,
              stripe_customer_id: customer.id,
              stripe_subscription_id: stripeSub.id,
              plan,
              status: "active",
              current_period_end: new Date(periodEnd * 1000).toISOString(),
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" }
          );

        if (error) {
          console.error("Erreur upsert subscription:", error);
          // Si l'upsert échoue, essayons un delete + insert
          await adminSupabase.from("subscriptions").delete().eq("user_id", user.id);
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
            console.error("Erreur insert subscription:", insertError);
            return NextResponse.json({ error: insertError.message }, { status: 500 });
          }
        }

        return NextResponse.json({ status: "active", plan });
      }
    }

    return NextResponse.json({ status: "no_active_subscription" });
  } catch (error) {
    console.error("Erreur vérification Stripe :", error);
    const errMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
