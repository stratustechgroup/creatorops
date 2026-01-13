import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.90.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const PTERODACTYL_URL = Deno.env.get("PTERODACTYL_URL");
const PTERODACTYL_API_KEY = Deno.env.get("PTERODACTYL_API_KEY");

interface ProxyRequest {
  action: "list_servers" | "server_details" | "server_resources" | "server_backups";
  serverId?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check environment variables
    if (!PTERODACTYL_URL || !PTERODACTYL_API_KEY) {
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
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get user's allowed server IDs from database
    const { data: allowedServers, error: dbError } = await supabase
      .from("client_servers")
      .select("pterodactyl_identifier")
      .eq("client_id", user.id);

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error("Failed to fetch user servers");
    }

    const allowedIds = new Set(
      allowedServers?.map((s: { pterodactyl_identifier: string }) => s.pterodactyl_identifier) ?? []
    );

    // Parse request body
    const { action, serverId }: ProxyRequest = await req.json();

    console.log(`User ${user.id} requesting ${action}${serverId ? ` for server ${serverId}` : ""}`);

    // Validate server access for server-specific endpoints
    if (serverId && !allowedIds.has(serverId)) {
      return new Response(
        JSON.stringify({ error: "Access denied to this server" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Determine Pterodactyl API path
    let pterodactylPath: string;
    switch (action) {
      case "list_servers":
        pterodactylPath = "/api/client";
        break;
      case "server_details":
        if (!serverId) throw new Error("Server ID required");
        pterodactylPath = `/api/client/servers/${serverId}`;
        break;
      case "server_resources":
        if (!serverId) throw new Error("Server ID required");
        pterodactylPath = `/api/client/servers/${serverId}/resources`;
        break;
      case "server_backups":
        if (!serverId) throw new Error("Server ID required");
        pterodactylPath = `/api/client/servers/${serverId}/backups`;
        break;
      default:
        throw new Error("Invalid action");
    }

    // Call Pterodactyl API
    const pterodactylResponse = await fetch(
      `${PTERODACTYL_URL}${pterodactylPath}`,
      {
        headers: {
          Authorization: `Bearer ${PTERODACTYL_API_KEY}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    if (!pterodactylResponse.ok) {
      const errorText = await pterodactylResponse.text();
      console.error(`Pterodactyl API error: ${pterodactylResponse.status}`, errorText);
      throw new Error(`Pterodactyl API error: ${pterodactylResponse.status}`);
    }

    let data = await pterodactylResponse.json();

    // For list_servers, filter to only user's allowed servers
    if (action === "list_servers" && data.data) {
      data.data = data.data.filter(
        (server: { attributes: { identifier: string } }) =>
          allowedIds.has(server.attributes.identifier)
      );
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
