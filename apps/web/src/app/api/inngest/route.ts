import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { sendScheduledEmail } from "../../../inngest/functions";

// Register all Inngest background functions here
const functions = [sendScheduledEmail];

// Create an API that serves the functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions,
});
