import { createFileRoute } from "@tanstack/react-router";
import { SafeGoApp } from "@/components/safego/SafeGoApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PickMe SafeGo — Book a Driver for Your Own Car" },
      { name: "description", content: "Interactive prototype: hire a verified driver to drive you and your own vehicle to your destination." },
      { property: "og:title", content: "PickMe SafeGo — Book a Driver for Your Own Car" },
      { property: "og:description", content: "Your vehicle. Your destination. A driver when you need one." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-stage sm:p-6">
      <div className="h-[100dvh] w-full overflow-hidden bg-background sm:h-[844px] sm:w-[390px] sm:rounded-[44px] sm:border-[10px] sm:border-secondary sm:shadow-2xl">
        <SafeGoApp />
      </div>
    </main>
  );
}
