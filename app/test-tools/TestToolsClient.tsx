"use client";

import { useState } from "react";

type Action = {
  id: string;
  label: string;
  description: string;
  variant: "primary" | "secondary";
  run: () => Promise<unknown>;
};

export function TestToolsClient() {
  const [output, setOutput] = useState<string | null>(null);
  const [running, setRunning] = useState<string | null>(null);

  async function execute(action: Action) {
    setRunning(action.id);
    setOutput(null);
    try {
      const result = await action.run();
      setOutput(JSON.stringify(result, null, 2));
    } catch (e) {
      setOutput(`Error: ${String(e)}`);
    }
    setRunning(null);
  }

  function makeEventId() {
    return `evt_${Date.now()}`;
  }

  const actions: Action[] = [
    {
      id: "reset-quota",
      label: "Reset provider quotas",
      description:
        "Sends a signed webhook event to reset all provider monthly quotas back to 10.",
      variant: "primary",
      run: async () => {
        const res = await fetch("/api/webhook/reset-quota", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventId: makeEventId(),
            type: "provider.quota.reset",
          }),
        });
        return res.json();
      },
    },
    {
      id: "idempotency",
      label: "Webhook idempotency test",
      description:
        "Fires the same event ID three times concurrently. Only the first call should succeed.",
      variant: "secondary",
      run: async () => {
        const eventId = makeEventId();
        const responses = await Promise.all(
          Array.from({ length: 3 }, () =>
            fetch("/api/webhook/reset-quota", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                eventId,
                type: "provider.quota.reset",
              }),
            }).then((r) => r.json())
          )
        );
        return { eventId, responses };
      },
    },
    {
      id: "concurrent-leads",
      label: "Generate 10 concurrent leads",
      description:
        "Creates 10 leads simultaneously to stress-test transaction isolation and allocation consistency.",
      variant: "secondary",
      run: async () => {
        const res = await fetch("/api/test/generate-leads", { method: "POST" });
        return res.json();
      },
    },
  ];

  return (
    <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
      {/* Action list */}
      <div className="space-y-3">
        {actions.map((action) => (
          <div key={action.id} className="card p-4 space-y-3">
            <div>
              <div className="text-sm font-medium text-zinc-200">
                {action.label}
              </div>
              <div className="mt-1 text-xs leading-relaxed text-zinc-500">
                {action.description}
              </div>
            </div>
            <button
              className={
                action.variant === "primary" ? "button w-full" : "button-secondary w-full"
              }
              disabled={running !== null}
              onClick={() => execute(action)}
            >
              {running === action.id ? (
                <>
                  <svg
                    className="h-3.5 w-3.5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Running…
                </>
              ) : (
                "Run"
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Output pane */}
      <div className="flex flex-col overflow-hidden rounded-lg border border-zinc-800/60 bg-zinc-950">
        <div className="flex items-center gap-2 border-b border-zinc-800/60 px-4 py-2.5">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-zinc-800" />
            <div className="h-2.5 w-2.5 rounded-full bg-zinc-800" />
            <div className="h-2.5 w-2.5 rounded-full bg-zinc-800" />
          </div>
          <span className="text-[11px] text-zinc-600 font-mono">output.json</span>
        </div>
        <pre className="flex-1 min-h-[400px] max-h-[600px] overflow-auto p-4 font-mono text-xs leading-relaxed text-zinc-300">
          {output ?? (
            <span className="text-zinc-700">
              {"// Run an action to see the response here."}
            </span>
          )}
        </pre>
      </div>
    </div>
  );
}
