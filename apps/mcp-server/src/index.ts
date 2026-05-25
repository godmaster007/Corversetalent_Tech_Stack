#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { PrismaClient } from "@corversetalent/db";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables (to get DATABASE_URL if needed)
dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });

const prisma = new PrismaClient();

const server = new Server(
  {
    name: "corversetalent-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// ----------------------------------------------------------------------
// Tool Definitions
// ----------------------------------------------------------------------

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_pipeline",
        description: "Retrieve all active deals currently in the Deal Pipeline with their stages and values.",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "search_candidates",
        description: "Search candidates by skill or methodology.",
        inputSchema: {
          type: "object",
          properties: {
            keyword: {
              type: "string",
              description: "The skill or methodology keyword to search for (e.g., MEDDIC, React).",
            },
          },
          required: ["keyword"],
        },
      },
      {
        name: "get_client_stats",
        description: "Retrieve an overview of active job orders for a specific client company.",
        inputSchema: {
          type: "object",
          properties: {
            companyName: {
              type: "string",
              description: "Name of the client company.",
            },
          },
          required: ["companyName"],
        },
      },
    ],
  };
});

// ----------------------------------------------------------------------
// Tool Execution Logic
// ----------------------------------------------------------------------

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "get_pipeline": {
      const deals = await prisma.deal.findMany({
        where: { stage: { not: "closed_won" } },
        include: { company: true },
        orderBy: { estimatedValue: "desc" },
      });

      const responseText = deals
        .map(
          (d: any) =>
            `- [${d.stage.toUpperCase()}] ${d.title} (${d.company?.name}) | Value: $${d.estimatedValue}`
        )
        .join("\n") || "No active deals found.";

      return {
        content: [{ type: "text", text: responseText }],
      };
    }

    case "search_candidates": {
      const { keyword } = request.params.arguments as { keyword: string };

      const candidates = await prisma.candidate.findMany({
        where: {
          OR: [
            { skills: { has: keyword } },
            { gtmMethodology: { has: keyword } },
            { notes: { contains: keyword, mode: "insensitive" } },
          ],
        },
        select: { firstName: true, lastName: true, currentTitle: true, quotaAttainment: true },
        take: 10,
      });

      if (candidates.length === 0) {
        return {
          content: [{ type: "text", text: `No candidates found for keyword: ${keyword}` }],
        };
      }

      const responseText = candidates
        .map(
          (c: any) =>
            `- ${c.firstName} ${c.lastName} (${c.currentTitle}) | Quota: ${JSON.stringify(c.quotaAttainment)}`
        )
        .join("\n");

      return {
        content: [{ type: "text", text: responseText }],
      };
    }

    case "get_client_stats": {
      const { companyName } = request.params.arguments as { companyName: string };

      const company = await prisma.company.findFirst({
        where: { name: { contains: companyName, mode: "insensitive" } },
        include: {
          jobOrders: {
            where: { status: "active" },
            include: { applications: true },
          },
        },
      });

      if (!company) {
        return {
          content: [{ type: "text", text: `Company not found: ${companyName}` }],
        };
      }

      let responseText = `Client: ${company.name}\nActive Job Orders:\n`;
      for (const job of company.jobOrders) {
        responseText += `- ${job.title} (${job.applications.length} candidates in pipeline)\n`;
      }

      if (company.jobOrders.length === 0) {
        responseText += "No active job orders.";
      }

      return {
        content: [{ type: "text", text: responseText }],
      };
    }

    default:
      throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
  }
});

// ----------------------------------------------------------------------
// Server Startup
// ----------------------------------------------------------------------

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Corversetalent MCP server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
