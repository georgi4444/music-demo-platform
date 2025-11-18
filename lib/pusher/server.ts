/**
 * Pusher Server Client
 * Server-side Pusher client for triggering events
 */

import Pusher from "pusher";
import { PUSHER_CHANNELS } from "@/lib/pusher/channels";
import { PUSHER_EVENTS } from "@/lib/pusher/events";
import { pusherServerConfig } from "@/lib/pusher/server-config";

let pusherServerInstance: Pusher | null = null;

/**
 * Get or create Pusher server instance
 */
export function getPusherServer(): Pusher {
  if (!pusherServerInstance) {
    pusherServerInstance = new Pusher(pusherServerConfig);
  }
  return pusherServerInstance;
}

/**
 * Trigger a new submission event
 */
export async function triggerNewSubmission(submissionId: string) {
  const pusher = getPusherServer();
  await pusher.trigger(
    PUSHER_CHANNELS.SUBMISSIONS,
    PUSHER_EVENTS.NEW_SUBMISSION,
    {
      submissionId,
      timestamp: new Date().toISOString(),
    },
  );
}

/**
 * Trigger a submission updated event
 */
export async function triggerSubmissionUpdated(
  submissionId: string,
  status: string,
) {
  const pusher = getPusherServer();
  await pusher.trigger(
    PUSHER_CHANNELS.SUBMISSIONS,
    PUSHER_EVENTS.SUBMISSION_UPDATED,
    {
      submissionId,
      status,
      timestamp: new Date().toISOString(),
    },
  );
}
