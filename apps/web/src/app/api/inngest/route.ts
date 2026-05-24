import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";

// Inngest functions will go here
const functions: any[] = [];

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions,
});
