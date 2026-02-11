import { hasValidSession } from '@repo/auth';
import { auth } from '@repo/auth/auth.config';
import { NextRequest, NextResponse } from 'next/server';

// Public routes that don't require authentication
const publicRoutes = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/api/auth",
];

const allowedOrigins = [
  "http://localhost:3000",
  process.env.NEXT_PUBLIC_CLIENT_URL,
];

const corsOptions = {
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, x-webhook-signature",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

// Admin only routes - using regex patterns
const adminRoutes = ["/user"];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api")) {
    const origin = request.headers.get("origin") ?? "";
    const isAllowedOrigin = allowedOrigins.includes(origin);

    // Handle preflighted requests
    const isPreflight = request.method === "OPTIONS";

    if (isPreflight) {
      const preflightHeaders = {
        ...(isAllowedOrigin && { "Access-Control-Allow-Origin": origin }),
        ...corsOptions,
      };
      return NextResponse.json({}, { headers: preflightHeaders });
    }

    // Continue with other middleware logic, but we'll need to attach CORS headers to the final response
    // We'll do this by modifying the response returned at the end
  }

  // Check if route is public
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Simple session check using cookies
  const hasSession = hasValidSession(request);

  console.log("hasSession",hasSession, "isPublicRoute", pathname,isPublicRoute);
  
  // If not authenticated and trying to access protected route
  if (!hasSession && !isPublicRoute) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // If authenticated and trying to access public auth routes, redirect to home
  if (hasSession && isPublicRoute && pathname !== "/") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  // Check admin role for admin routes
  if (hasSession && isAdminRoute) {
    try {
      // Get session to check user role
      const session = await auth.api.getSession({
        headers: request.headers,
      });

      if (!session?.user) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }

      const userRole = session.user.userRole;

      // Check if user has admin or super_admin role
      if (userRole !== "admin" && userRole !== "super_admin") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    } catch (error) {
      console.error("Error checking admin role:", error);
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
