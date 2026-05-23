"use client";

import { useEffect, useState } from "react";
import type { DashboardData } from "@/lib/dashboard";

type ProviderDashboard = DashboardData[number];

export function DashboardClient({
  initialProviders,
}: {
  initialProviders: ProviderDashboard[];
}) {
  const [providers, setProviders] = useState(initialProviders);
  const [connection, setConnection] = useState<"connecting" | "live" | "reconnecting">("connecting");
  const [mounted, setMounted] = useState(false);

  async function refreshDashboard() {
    const res = await fetch("/api/dashboard", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      setProviders(data.providers);
    }
  }

  useEffect(() => {
    setMounted(true);
    const es = new EventSource("/api/dashboard/stream");

    es.addEventListener("connected", () => setConnection("live"));
    es.addEventListener("dashboard-update", () => {
      setConnection("live");
      void refreshDashboard();
    });
    es.onerror = () => setConnection("reconnecting");

    return () => es.close();
  }, []);

  return (
    <div className="space-y-4">
      {/* Stream status */}
      <div className="flex items-center gap-2">
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            connection === "live"
              ? "bg-emerald-500"
              : connection === "reconnecting"
              ? "bg-amber-500"
              : "bg-zinc-600"
          }`}
        />
        <span className="text-xs text-zinc-500">
          {connection === "live"
            ? "Live"
            : connection === "reconnecting"
            ? "Reconnecting…"
            : "Connecting…"}
        </span>
      </div>

      {/* Provider grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {providers.length === 0 ? (
          <div className="col-span-full rounded-lg border border-dashed border-zinc-800 py-16 text-center">
            <p className="text-sm text-zinc-600">No providers configured.</p>
          </div>
        ) : (
          providers.map((provider) => {
            const pct = Math.min(
              100,
              (provider.usedQuota / provider.monthlyQuota) * 100
            );
            const isFull = provider.usedQuota >= provider.monthlyQuota;
            const isWarn = !isFull && pct >= 70;

            return (
              <article key={provider.id} className="card p-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-semibold text-zinc-100">
                      {provider.name}
                    </h2>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {provider.leadsReceivedCount}{" "}
                      {provider.leadsReceivedCount === 1 ? "lead" : "leads"} assigned
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    {isFull ? (
                      <span className="inline-block rounded-full bg-red-950/50 px-2 py-0.5 text-[11px] font-medium text-red-400 border border-red-900/40">
                        Full
                      </span>
                    ) : (
                      <span className="text-sm font-medium tabular-nums text-zinc-300">
                        {provider.remainingQuota}{" "}
                        <span className="text-xs text-zinc-600 font-normal">remaining</span>
                      </span>
                    )}
                    <div className="mt-0.5 text-xs tabular-nums text-zinc-600">
                      {provider.usedQuota}/{provider.monthlyQuota}
                    </div>
                  </div>
                </div>

                {/* Quota bar */}
                <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-zinc-900">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isFull
                        ? "bg-red-500"
                        : isWarn
                        ? "bg-amber-500"
                        : "bg-indigo-500"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Lead list */}
                <div className="mt-5">
                  <div className="mb-2 text-[11px] font-medium uppercase tracking-widest text-zinc-600">
                    Assigned leads
                  </div>

                  {provider.leads.length === 0 ? (
                    <p className="rounded-md border border-dashed border-zinc-800 py-4 text-center text-xs text-zinc-600">
                      No leads yet
                    </p>
                  ) : (
                    <div className="max-h-80 space-y-2 overflow-y-auto">
                      {provider.leads.map((lead) => (
                        <div
                          key={lead.assignmentId}
                          className="rounded-md border border-zinc-800/60 bg-zinc-900/60 p-3 transition-colors hover:border-zinc-700"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-medium text-zinc-200">
                              {lead.customerName}
                            </span>
                            <span className="shrink-0 rounded bg-indigo-600/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-400">
                              {lead.serviceName}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500">
                            <span>{lead.phone}</span>
                            <span className="text-zinc-700">·</span>
                            <span>{lead.city}</span>
                          </div>
                          {lead.description && (
                            <p className="mt-2 text-xs leading-relaxed text-zinc-500 line-clamp-2">
                              {lead.description}
                            </p>
                          )}
                          {mounted && (
                            <div className="mt-2 text-[10px] text-zinc-700">
                              {new Date(lead.assignedAt).toLocaleString()}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
