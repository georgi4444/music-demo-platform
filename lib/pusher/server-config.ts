import type Pusher from "pusher";
import { required } from "@/lib/env";

export const pusherServerConfig: Pusher.Options = {
  appId: required("PUSHER_APP_ID", process.env.PUSHER_APP_ID),
  key: required("NEXT_PUBLIC_PUSHER_KEY", process.env.NEXT_PUBLIC_PUSHER_KEY),
  secret: required("PUSHER_SECRET", process.env.PUSHER_SECRET),
  cluster: required("NEXT_PUBLIC_PUSHER_CLUSTER", process.env.NEXT_PUBLIC_PUSHER_CLUSTER),
  useTLS: true,
};
