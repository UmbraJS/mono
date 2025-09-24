import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

const crons = cronJobs();

// Clean up old emoji events every minute
crons.interval(
  "cleanup old emoji events",
  { minutes: 10 },
  api.chat.cleanupOldEmojiEvents,
);

export default crons;
