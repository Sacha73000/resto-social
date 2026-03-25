// ENDPOINT DE DIAGNOSTIC TEMPORAIRE - à supprimer après debug
import { NextResponse } from "next/server";

export async function GET() {
  const checks: Record<string, string> = {};

  // Vérifie chaque variable d'environnement
  checks["NEXT_PUBLIC_SUPABASE_URL"] = process.env.NEXT_PUBLIC_SUPABASE_URL ? "OK" : "MANQUANTE";
  checks["NEXT_PUBLIC_SUPABASE_ANON_KEY"] = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "OK (" + process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 10) + "...)" : "MANQUANTE";
  checks["SUPABASE_SERVICE_ROLE_KEY"] = process.env.SUPABASE_SERVICE_ROLE_KEY ? "OK (" + process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 10) + "...)" : "MANQUANTE";
  checks["STRIPE_SECRET_KEY"] = process.env.STRIPE_SECRET_KEY ? "OK (" + process.env.STRIPE_SECRET_KEY.substring(0, 10) + "...)" : "MANQUANTE";
  checks["STRIPE_WEBHOOK_SECRET"] = process.env.STRIPE_WEBHOOK_SECRET ? "OK" : "MANQUANTE";
  checks["NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID"] = process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID || "MANQUANTE";
  checks["NEXT_PUBLIC_STRIPE_PRO_PRICE_ID"] = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || "MANQUANTE";
  checks["NEXT_PUBLIC_APP_URL"] = process.env.NEXT_PUBLIC_APP_URL || "MANQUANTE";

  // Test connexion Stripe
  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
    const customers = await stripe.customers.list({ email: "gabinlefevre01@gmail.com", limit: 1 });
    checks["STRIPE_CONNECTION"] = "OK - " + customers.data.length + " customer(s)";

    // Cherche les abonnements actifs
    for (const c of customers.data) {
      const subs = await stripe.subscriptions.list({ customer: c.id, status: "active", limit: 1 });
      checks["STRIPE_ACTIVE_SUBS_" + c.id] = subs.data.length + " actif(s)";
    }
  } catch (e) {
    checks["STRIPE_CONNECTION"] = "ERREUR: " + (e instanceof Error ? e.message : String(e));
  }

  // Test connexion Supabase avec service role
  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data, error } = await supabase.from("subscriptions").select("*");
    if (error) {
      checks["SUPABASE_CONNECTION"] = "ERREUR: " + error.message;
    } else {
      checks["SUPABASE_CONNECTION"] = "OK - " + (data?.length || 0) + " subscription(s)";
      checks["SUPABASE_DATA"] = JSON.stringify(data);
    }

    // Test insert
    const { error: testError } = await supabase.from("subscriptions").upsert({
      user_id: "80fa733f-30eb-4e1e-96b7-2acd8b6452c1",
      stripe_customer_id: "test_debug",
      plan: "starter",
      status: "canceled",
    }, { onConflict: "user_id" });
    checks["SUPABASE_INSERT_TEST"] = testError ? "ERREUR: " + testError.message : "OK";

    // Nettoie le test
    if (!testError) {
      await supabase.from("subscriptions").delete().eq("stripe_customer_id", "test_debug");
      checks["SUPABASE_CLEANUP"] = "OK";
    }
  } catch (e) {
    checks["SUPABASE_CONNECTION"] = "ERREUR: " + (e instanceof Error ? e.message : String(e));
  }

  return NextResponse.json(checks, { status: 200 });
}
