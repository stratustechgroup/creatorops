import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.90.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const PTERODACTYL_URL = Deno.env.get("PTERODACTYL_URL");
const PTERODACTYL_APP_API_KEY = Deno.env.get("PTERODACTYL_API_KEY"); // Application API key
const PTERODACTYL_CLIENT_API_KEY = Deno.env.get("PTERODACTYL_CLIENT_API_KEY"); // Client API key (service account)

interface ProxyRequest {
  action: "list_servers" | "server_details" | "server_resources" | "server_backups";
  serverId?: string; // Server identifier for Client API or numeric ID for Application API
}

// Helper to call Pterodactyl API
async function callPterodactyl(path: string, apiKey: string): Promise<Response> {
  return fetch(`${PTERODACTYL_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check environment variables
    if (!PTERODACTYL_URL || !PTERODACTYL_APP_API_KEY) {
      console.error("Missing env vars - URL:", !!PTERODACTYL_URL, "APP_KEY:", !!PTERODACTYL_APP_API_KEY);
      throw new Error("Pterodactyl configuration missing");
    }

    // Verify user is authenticated
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: req.headers.get("Authorization")! },
      },
    });

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("Auth error:", authError);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Authenticated user:", user.id);

    // Get user's Pterodactyl user ID from database
    const { data: userMapping, error: dbError } = await supabase
      .from("client_pterodactyl_users")
      .select("pterodactyl_user_id")
      .eq("supabase_user_id", user.id)
      .single();

    if (dbError || !userMapping) {
      console.error("Database error or no mapping found:", dbError);
      return new Response(
        JSON.stringify({ error: "User not linked to Pterodactyl account" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const pterodactylUserId = userMapping.pterodactyl_user_id;
    console.log("Pterodactyl user ID:", pterodactylUserId);

    // Parse request body
    const { action, serverId }: ProxyRequest = await req.json();

    console.log(`User ${user.id} (ptero: ${pterodactylUserId}) requesting ${action}${serverId ? ` for server ${serverId}` : ""}`);

    // For server-specific actions, verify the user owns this server
    if (serverId && ["server_details", "server_resources", "server_backups"].includes(action)) {
      // Get all servers to verify ownership
      const verifyResponse = await callPterodactyl(
        `/api/application/servers`,
        PTERODACTYL_APP_API_KEY
      );

      if (!verifyResponse.ok) {
        throw new Error("Failed to verify server ownership");
      }

      const allServers = await verifyResponse.json();
      // Filter to find servers owned by this user
      const userServerIdentifiers = new Set(
        allServers.data
          ?.filter((s: { attributes: { user: number } }) => s.attributes.user === pterodactylUserId)
          .map((s: { attributes: { identifier: string } }) => s.attributes.identifier) ?? []
      );

      if (!userServerIdentifiers.has(serverId)) {
        return new Response(
          JSON.stringify({ error: "Access denied to this server" }),
          {
            status: 403,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    let pterodactylPath: string;
    let apiKey: string;

    switch (action) {
      case "list_servers":
        // Use Application API to list all servers, then filter by user
        pterodactylPath = `/api/application/servers`;
        apiKey = PTERODACTYL_APP_API_KEY;
        break;

      case "server_details":
        // Use Application API for server details
        pterodactylPath = `/api/application/servers`;
        apiKey = PTERODACTYL_APP_API_KEY;
        break;

      case "server_resources":
        // Use Client API for real-time resources (requires service account key)
        if (!PTERODACTYL_CLIENT_API_KEY) {
          throw new Error("Client API key not configured for real-time data");
        }
        if (!serverId) throw new Error("Server ID required");
        pterodactylPath = `/api/client/servers/${serverId}/resources`;
        apiKey = PTERODACTYL_CLIENT_API_KEY;
        break;

      case "server_backups":
        // Use Client API for backups (requires service account key)
        if (!PTERODACTYL_CLIENT_API_KEY) {
          throw new Error("Client API key not configured for backups");
        }
        if (!serverId) throw new Error("Server ID required");
        pterodactylPath = `/api/client/servers/${serverId}/backups`;
        apiKey = PTERODACTYL_CLIENT_API_KEY;
        break;

      default:
        throw new Error("Invalid action");
    }

    console.log("Calling Pterodactyl:", `${PTERODACTYL_URL}${pterodactylPath}`);

    const pterodactylResponse = await callPterodactyl(pterodactylPath, apiKey);

    console.log("Pterodactyl response status:", pterodactylResponse.status);

    if (!pterodactylResponse.ok) {
      const errorText = await pterodactylResponse.text();
      console.error(`Pterodactyl API error: ${pterodactylResponse.status}`, errorText);
      throw new Error(`Pterodactyl API error: ${pterodactylResponse.status}`);
    }

    let data = await pterodactylResponse.json();

    // For list_servers, filter to only this user's servers
    if (action === "list_servers" && data.data) {
      data.data = data.data.filter(
        (s: { attributes: { user: number } }) => s.attributes.user === pterodactylUserId
      );
    }

    // For server_details, find the specific server from the list
    if (action === "server_details" && serverId && data.data) {
      const server = data.data.find(
        (s: { attributes: { identifier: string; user: number } }) =>
          s.attributes.identifier === serverId && s.attributes.user === pterodactylUserId
      );
      if (server) {
        data = server;
      } else {
        return new Response(
          JSON.stringify({ error: "Server not found" }),
          {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Proxy error:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
