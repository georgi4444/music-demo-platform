export default function RootLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        {/* Animated music bars */}
        <div className="flex items-end gap-1.5 h-16">
          <div
            className="w-2 bg-purple-500 rounded-full animate-[pulse_0.6s_ease-in-out_infinite]"
            style={{ animationDelay: "0s", height: "30%" }}
          />
          <div
            className="w-2 bg-purple-500 rounded-full animate-[pulse_0.6s_ease-in-out_infinite]"
            style={{ animationDelay: "0.1s", height: "60%" }}
          />
          <div
            className="w-2 bg-purple-500 rounded-full animate-[pulse_0.6s_ease-in-out_infinite]"
            style={{ animationDelay: "0.2s", height: "100%" }}
          />
          <div
            className="w-2 bg-purple-500 rounded-full animate-[pulse_0.6s_ease-in-out_infinite]"
            style={{ animationDelay: "0.3s", height: "70%" }}
          />
          <div
            className="w-2 bg-purple-500 rounded-full animate-[pulse_0.6s_ease-in-out_infinite]"
            style={{ animationDelay: "0.4s", height: "40%" }}
          />
        </div>

        {/* Loading text */}
        <p className="text-sm text-muted-foreground animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}
