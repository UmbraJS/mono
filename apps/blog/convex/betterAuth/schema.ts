import { defineSchema } from "convex/server";
import { tables } from "./generatedSchema";

// Better Auth schema for Convex
// See: https://convex-better-auth.netlify.app/
const schema = defineSchema({
  ...tables,
});

export default schema;
