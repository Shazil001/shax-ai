import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
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
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // cookie set from server component, safe to ignore
            }
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Handle Vercel deployment (x-forwarded-host differs from origin)
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        // In dev, use origin directly
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        // In production (Vercel), use the forwarded host
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }

    console.error("Auth callback error:", error.message);
  }

  // Return user to login page with error indication
  const redirectUrl = new URL("/login", request.url);
  redirectUrl.searchParams.set("error", "auth_callback_failed");
  
  // Handle production hostname for error redirect too
  const forwardedHost = request.headers.get("x-forwarded-host");
  if (forwardedHost && process.env.NODE_ENV !== "development") {
    return NextResponse.redirect(`https://${forwardedHost}${redirectUrl.pathname}${redirectUrl.search}`);
  }

  return NextResponse.redirect(redirectUrl.toString());
}
