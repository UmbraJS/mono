import { convex, createApi } from "convue";
import { betterAuth } from "better-auth";
import schema from "./schema";

// Create a static auth config for schema generation
const authConfig = () => betterAuth({
  database: {} as never, // Will be replaced at runtime
  emailAndPassword: {
    enabled: true,
  },
  plugins: [convex()],
});

export const {
  create,
  findOne,
  findMany,
  updateOne,
  updateMany,
  deleteOne,
  deleteMany,
  migrationRemoveUserId,
} = createApi(schema, authConfig);

