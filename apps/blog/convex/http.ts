import { httpRouter } from "convex/server";
import { authComponent, createAuth } from "./auth";
import { httpAction } from "./_generated/server";

const http = httpRouter();

authComponent.registerRoutes(http, createAuth, { cors: true });

// Add Convex token endpoint for authenticated Convex queries
http.route({
  path: "/api/auth/convex/token",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // Get the session token from cookies
    const cookies = request.headers.get("cookie") || "";
    const sessionToken = cookies
      .split(";")
      .find((c) => c.trim().startsWith("better-auth.session_token="))
      ?.split("=")[1];

    if (!sessionToken) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Return the session token for Convex to validate
    return new Response(
      JSON.stringify({ token: decodeURIComponent(sessionToken) }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }),
});

export default http;
