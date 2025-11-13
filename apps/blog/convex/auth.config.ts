// Better Auth configuration for Convex
export default {
  providers: [
    {
      domain: `${process.env.CONVEX_SITE_URL}`,
      applicationID: "convex",
    },
  ],
};
