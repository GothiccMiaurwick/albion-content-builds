import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple in-memory cache for rate limiting. 
// Note: This is per-instance and resets on server restart.
const ipCache = new Map<string, { count: number; lastReset: number }>();

export function middleware(request: NextRequest) {
  // Only apply to API routes
  if (!request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || 
             request.headers.get("x-real-ip") || 
             "unknown";
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 100; // Max 100 requests per minute per IP

  const data = ipCache.get(ip) || { count: 0, lastReset: now };

  // Reset window if expired
  if (now - data.lastReset > windowMs) {
    data.count = 1;
    data.lastReset = now;
  } else {
    data.count++;
  }

  ipCache.set(ip, data);

  if (data.count > maxRequests) {
    return new NextResponse(
      JSON.stringify({
        error: "Too many requests. Please try again in a minute.",
      }),
      {
        status: 429,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
