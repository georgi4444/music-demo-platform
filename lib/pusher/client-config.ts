import type { Options } from "pusher-js";
import { required } from "@/lib/env";

export const pusherClientConfig = {
  key: required("NEXT_PUBLIC_PUSHER_KEY", process.env.NEXT_PUBLIC_PUSHER_KEY),
  options: {
    cluster: required(
      "NEXT_PUBLIC_PUSHER_CLUSTER",
      process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    ),
    authEndpoint: "/api/pusher/auth",
    forceTLS: true,
  } as Options,
};
