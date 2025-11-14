"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="mt-4 text-gray-600">Coming soon...</p>
        <Button onClick={() => signOut()} variant="outline" className="mt-6">
          Logout
        </Button>
      </div>
    </div>
  );
}
