import { getDashboardRevision } from "@/lib/dashboard";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const encoder = new TextEncoder();
  let closed = false;
  let lastRevision = await getDashboardRevision();

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(
        encoder.encode(`event: connected\ndata: ${JSON.stringify({ revision: lastRevision })}\n\n`)
      );

      const interval = setInterval(async () => {
        if (closed) {
          clearInterval(interval);
          return;
        }

        try {
          const revision = await getDashboardRevision();

          if (revision !== lastRevision) {
            lastRevision = revision;
            controller.enqueue(
              encoder.encode(`event: dashboard-update\ndata: ${JSON.stringify({ revision })}\n\n`)
            );
          } else {
            controller.enqueue(encoder.encode(`event: ping\ndata: {}\n\n`));
          }
        } catch (error) {
          controller.error(error);
          clearInterval(interval);
        }
      }, 2000);
    },
    cancel() {
      closed = true;
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive"
    }
  });
}
