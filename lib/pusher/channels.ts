/**
 * Pusher channel names
 */
export const PUSHER_CHANNELS = {
  SUBMISSIONS: "private-submissions",
} as const;

export type PusherChannel =
  (typeof PUSHER_CHANNELS)[keyof typeof PUSHER_CHANNELS];

export function isPusherChannel(value: string): value is PusherChannel {
  return Object.values(PUSHER_CHANNELS).includes(value as PusherChannel);
}
