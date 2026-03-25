// MIDDLEWARE NEXT.JS
// S'exécute à chaque requête AVANT que la page ne s'affiche
// Rôle : rafraîchir la session Supabase et protéger les pages privées

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  // On stocke les cookies à mettre à jour
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request: { headers: request.headers } });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Rafraîchit la session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Pages protégées : redirige vers login si non connecté
  const protectedPaths = ["/dashboard", "/generate", "/subscription"];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected && !user) {
    const redirectUrl = new URL("/auth/login", request.url);
    const redirectResponse = NextResponse.redirect(redirectUrl);
    // Copie les cookies mis à jour dans la redirection
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    return redirectResponse;
  }

  // Si connecté et sur login/signup, redirige vers dashboard
  const authPaths = ["/auth/login", "/auth/signup"];
  const isAuthPage = authPaths.some((path) => pathname.startsWith(path));

  if (isAuthPage && user) {
    const redirectUrl = new URL("/dashboard", request.url);
    const redirectResponse = NextResponse.redirect(redirectUrl);
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    return redirectResponse;
  }

  return response;
}

// Sur quelles routes le middleware s'exécute
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/generate/:path*",
    "/subscription/:path*",
    "/auth/:path*",
  ],
};
