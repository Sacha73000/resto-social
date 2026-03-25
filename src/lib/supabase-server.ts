// Client Supabase côté SERVEUR (API routes, Server Components)
// Utilise le service role pour les opérations admin (webhooks Stripe)

import { createClient } from "@supabase/supabase-js";

// Client admin avec le service role (accès complet, à utiliser UNIQUEMENT côté serveur)
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Variables Supabase manquantes ! Configure NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans ton fichier .env.local"
    );
  }

  return createClient(url, key);
}
