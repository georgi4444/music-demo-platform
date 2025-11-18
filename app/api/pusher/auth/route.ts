/**
 * Pusher Authentication Endpoint
 * Authenticates users for private Pusher channels
 */

import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { isPusherChannel } from "@/lib/pusher/channels";
import { getPusherServer } from "@/lib/pusher/server";

export async function POST(request: Request) {
  try {
    // Check if user is authenticated
    await requireAuth();

    const body = await request.text();
    const params = new URLSearchParams(body);
    const socketId = params.get("socket_id");
    const channelName = params.get("channel_name");

    if (!socketId || !channelName) {
      return NextResponse.json(
        { error: "Missing socket_id or channel_name" },
        { status: 400 },
      );
    }

    // Only allow authenticated admin users to access private-submissions channel
    if (!isPusherChannel(channelName)) {
      return NextResponse.json({ error: "Invalid channel" }, { status: 400 });
    }

    const pusher = getPusherServer();
    const authResponse = pusher.authorizeChannel(socketId, channelName);
    return NextResponse.json(authResponse);
  } catch (error) {
    console.error("Pusher auth error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
