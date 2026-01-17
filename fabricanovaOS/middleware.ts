import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    // 1. Create an unmodified response object
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // 2. Initialize Supabase Client
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    // Update the request cookies (so the client acts as if it has them)
                    request.cookies.set({ name, value, ...options })
                    // Update the response cookies (so the browser saves them)
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({ name, value, ...options })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({ name, value: '', ...options })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({ name, value: '', ...options })
                },
            },
        }
    )

    // 3. Get the User (Securely)
    // getUser() validates the JWT token on the server
    const { data: { user } } = await supabase.auth.getUser()


    // --- SECURITY LOGIC ---

    const path = request.nextUrl.pathname;

    // A. ADMIN PROTECTION (Server-Side)
    // This prevents non-admins from even loading the admin page
    if (user && path.startsWith('/admin')) {
        // We can fetch the profile because RLS allows users to read their OWN role
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (profile?.role !== 'super_admin') {
            // If not admin, kick them to the home page
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    // B. STANDARD PROTECTED ROUTES
    // Add any new protected paths to this array
    const protectedRoutes = ['/studio', '/profile', '/admin']
    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))

    if (isProtectedRoute && !user) {
        // Redirect to Auth page if trying to access protected route without login
        const redirectUrl = new URL('/auth', request.url)
        // Optional: Save the page they were trying to visit to redirect back later
        redirectUrl.searchParams.set('next', path)
        return NextResponse.redirect(redirectUrl)
    }

    // C. AUTH PAGE REDIRECT
    // If user is already logged in, don't let them see the login page
    if (path.startsWith('/auth') && user) {
        return NextResponse.redirect(new URL('/studio', request.url))
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for:
         * 1. _next/static (static files)
         * 2. _next/image (image optimization files)
         * 3. favicon.ico (favicon file)
         * 4. extensions (svg, png, jpg, jpeg, gif, webp)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}