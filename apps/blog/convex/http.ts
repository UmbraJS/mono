import { httpRouter } from "convex/server";
import { authComponent, createAuth } from "./auth";
import { httpAction } from "./_generated/server";

const http = httpRouter();

authComponent.registerRoutes(http, createAuth, { cors: true });

// Convex token endpoint - generates JWT from session cookie
// This JWT is what Convex uses to populate ctx.auth.getUserIdentity()
http.route({
  path: "/api/auth/convex/token",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      // Get the session token from cookies
      const cookies = request.headers.get("cookie") || "";
      const sessionToken = cookies
        .split(";")
        .map(c => c.trim())
        .find((c) => c.startsWith("better-auth.session_token="))
        ?.split("=")[1];

      if (!sessionToken) {
        return new Response(JSON.stringify({ error: "No session token" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Decode the session token to get the session ID
      const decodedToken = decodeURIComponent(sessionToken);

      // Query the session from the Better Auth component using the session token
      const session = await ctx.runQuery(authComponent.component.adapter.findOne, {
        model: "session",
        where: [{ field: "token", value: decodedToken }],
      });

      if (!session || !session.userId) {
        return new Response(JSON.stringify({ error: "Invalid session" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Get the auth instance with headers
      const { auth } = await authComponent.getAuth(createAuth, ctx);

      // Generate JWT token using Better Auth
      const { token } = await auth.api.getToken({
        headers: new Headers({
          cookie: request.headers.get("cookie") || "",
        }),
      });

      console.log("[convex/token] Generated token:", token);
      console.log("[convex/token] Token length:", token?.length);

      if (!token) {
        return new Response(JSON.stringify({ error: "Failed to generate token" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(
        JSON.stringify({ data: { token } }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("[convex/token] Error:", error);
      return new Response(
        JSON.stringify({ error: "Internal server error", details: String(error) }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }),
});

export default http;
