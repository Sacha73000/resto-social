// Client Supabase côté NAVIGATEUR (composants React côté client)
// Utilise createBrowserClient de @supabase/ssr pour stocker la session dans les COOKIES
// (et non localStorage) — nécessaire pour que le middleware puisse lire la session

import { createBrowserClient } from "@supabase/ssr";

let client: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseBrowser() {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    if (typeof window === "undefined") {
      // Au build, retourne un client factice
      return createBrowserClient("http://localhost:0", "placeholder");
    }
    throw new Error(
      "Variables Supabase manquantes ! Configure NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans ton fichier .env.local"
    );
  }

  client = createBrowserClient(url, key);
  return client;
}
