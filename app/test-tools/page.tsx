import { TestToolsClient } from "./TestToolsClient";

export default function TestToolsPage() {
  return (
    <section>
      <div className="mb-8">
        <div className="flex items-center gap-2.5 mb-1">
          <span className="inline-flex items-center rounded-full border border-amber-800/40 bg-amber-950/40 px-2 py-0.5 text-[11px] font-medium text-amber-500">
            Internal
          </span>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-100">
            Test Tools
          </h1>
        </div>
        <p className="text-sm text-zinc-500">
          Utilities for validating quota reset, webhook idempotency, and
          concurrency behaviour under load.
        </p>
      </div>
      <TestToolsClient />
    </section>
  );
}
