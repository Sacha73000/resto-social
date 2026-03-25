// API ROUTE : Génération de contenu via Claude
// POST /api/generate
// Vérifie l'auth, les limites, puis appelle l'IA

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { generateSocialPost } from "@/lib/claude";

export async function POST(request: NextRequest) {
  try {
    // 1. Vérifie que l'utilisateur est connecté
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
        { error: "Tu dois être connecté pour générer du contenu." },
        { status: 401 }
      );
    }

    // 2. Vérifie l'abonnement et les limites
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("plan, status")
      .eq("user_id", user.id)
      .single();

    const plan = subscription?.status === "active" ? (subscription?.plan || "starter") : "free";

    // Vérifie la limite mensuelle selon le plan
    if (plan === "free" || plan === "starter") {
      const limit = plan === "free" ? 5 : 30;
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count } = await supabase
        .from("generations")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", startOfMonth.toISOString());

      if ((count || 0) >= limit) {
        const msg = plan === "free"
          ? "Tu as utilisé tes 5 générations gratuites ce mois-ci. Abonne-toi pour continuer !"
          : "Tu as atteint ta limite de 30 générations ce mois-ci. Passe au plan Pro pour des générations illimitées !";
        return NextResponse.json({ error: msg }, { status: 429 });
      }
    }

    // 3. Récupère les données du formulaire
    const body = await request.json();
    const { restaurantName, cuisineType, postType, platform, tone, details } =
      body;

    if (!restaurantName || !cuisineType || !postType || !platform || !tone) {
      return NextResponse.json(
        { error: "Remplis tous les champs obligatoires du formulaire." },
        { status: 400 }
      );
    }

    // 4. Génère le contenu avec Claude
    const content = await generateSocialPost({
      restaurantName,
      cuisineType,
      postType,
      platform,
      tone,
      details,
    });

    // 5. Sauvegarde la génération dans la base de données
    await supabase.from("generations").insert({
      user_id: user.id,
      restaurant_name: restaurantName,
      cuisine_type: cuisineType,
      post_type: postType,
      platform,
      tone,
      details: details || null,
      generated_content: content,
    });

    return NextResponse.json({ content });
  } catch (error: unknown) {
    console.error("Erreur de generation :", error);

    // Erreurs Anthropic avec messages clairs en francais
    const errMsg = error instanceof Error ? error.message : String(error);

    if (errMsg.includes("credit balance") || errMsg.includes("billing")) {
      return NextResponse.json(
        { error: "Le compte Anthropic n'a plus de credits. Va sur console.anthropic.com > Plans & Billing pour en ajouter." },
        { status: 402 }
      );
    }

    if (errMsg.includes("API") || errMsg.includes("Cle API")) {
      return NextResponse.json(
        { error: "Cle API Anthropic manquante ou invalide. Verifie ton fichier .env.local." },
        { status: 500 }
      );
    }

    if (errMsg.includes("authentication") || errMsg.includes("401")) {
      return NextResponse.json(
        { error: "Cle API Anthropic invalide. Verifie que ta cle est correcte dans .env.local." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Erreur lors de la generation. Reessaie dans quelques instants." },
      { status: 500 }
    );
  }
}
