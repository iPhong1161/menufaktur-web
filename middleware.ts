import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Forward pathname to server components via request headers
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-pathname", request.nextUrl.pathname)

  let supabaseResponse = NextResponse.next({ request: { headers: requestHeaders } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          // Preserve x-pathname when Supabase refreshes the response
          supabaseResponse = NextResponse.next({ request: { headers: requestHeaders } })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session — keep cookies in sync
  const { data: { user } } = await supabase.auth.getUser()

  // Redirect /konto/* to /login if unauthenticated
  if (!user && request.nextUrl.pathname.startsWith("/konto")) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("redirect", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")
  const isAdminLogin = request.nextUrl.pathname === "/admin/login"

  // Unauthenticated → /admin/login
  if (!user && isAdminRoute && !isAdminLogin) {
    const url = request.nextUrl.clone()
    url.pathname = "/admin/login"
    return NextResponse.redirect(url)
  }

  // Authenticated but must verify the user holds an admin_users record
  if (user && isAdminRoute && !isAdminLogin) {
    const serviceClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      // Service role authenticates via the key in the header — no cookie handling needed
      { cookies: { getAll: () => [], setAll: () => {} } }
    )

    const { data: adminRecord } = await serviceClient
      .from("admin_users")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (!adminRecord) {
      const url = request.nextUrl.clone()
      url.pathname = "/admin/login"
      url.searchParams.set("unauthorised", "1")
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|brand|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
