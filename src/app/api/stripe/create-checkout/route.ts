// API ROUTE : Crée une session de checkout Stripe
// POST /api/stripe/create-checkout
// Redirige l'utilisateur vers la page de paiement Stripe

import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { stripe, PLANS } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase-server";
import type { PlanType } from "@/lib/stripe";

export async function POST(request: Request) {
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

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Tu dois être connecté." },
        { status: 401 }
      );
    }

    // 2. Récupère le plan demandé
    const body = await request.json();
    const plan = body.plan as PlanType;

    if (!plan || !PLANS[plan]) {
      return NextResponse.json(
        { error: "Plan invalide." },
        { status: 400 }
      );
    }

    const priceId = PLANS[plan].priceId;
    if (!priceId) {
      return NextResponse.json(
        {
          error: `Le Price ID Stripe pour le plan ${plan} n'est pas configuré. Ajoute NEXT_PUBLIC_STRIPE_${plan.toUpperCase()}_PRICE_ID dans .env.local`,
        },
        { status: 500 }
      );
    }

    // 3. Vérifie si l'utilisateur a déjà un customer Stripe
    const adminSupabase = createServiceClient();
    const { data: subscription } = await adminSupabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    let customerId = subscription?.stripe_customer_id;

    // Crée un customer Stripe si nécessaire
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { user_id: user.id },
      });
      customerId = customer.id;

      // Sauvegarde le customer ID (sans activer de plan — le webhook Stripe le fera après paiement)
      await adminSupabase.from("subscriptions").upsert(
        {
          user_id: user.id,
          stripe_customer_id: customerId,
          plan: "starter",
          status: "canceled",
        },
        { onConflict: "user_id" }
      );
    }

    // 4. Crée la session Stripe Checkout
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/dashboard?checkout=success`,
      cancel_url: `${appUrl}/subscription?checkout=canceled`,
      metadata: {
        user_id: user.id,
        plan,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Erreur Stripe checkout :", error);
    const errMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `Erreur paiement : ${errMsg}` },
      { status: 500 }
    );
  }
}
