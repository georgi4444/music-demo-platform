"use client";

/**
 * Pusher Client
 * Client-side Pusher client for subscribing to real-time events
 */

import PusherClient from "pusher-js";
import { pusherClientConfig } from "@/lib/pusher/client-config";

let pusherClientInstance: PusherClient | null = null;

/**
 * Get or create Pusher client instance
 */
export function getPusherClient(): PusherClient {
  if (!pusherClientInstance) {
    pusherClientInstance = new PusherClient(
      pusherClientConfig.key,
      pusherClientConfig.options,
    );
  }
  return pusherClientInstance;
}
