import { prisma } from "@/lib/prisma";
import { RequestServiceForm } from "./RequestServiceForm";

export default async function RequestServicePage() {
  const services = await prisma.service.findMany({
    orderBy: { id: "asc" },
    select: { id: true, name: true },
  });

  return (
    <section className="mx-auto max-w-5xl">
      {/* Page header */}
      <div className="mb-10">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-100">
          New Service Request
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Fill in the form below. The system will automatically assign your
          request to qualified providers.
        </p>
      </div>

      {/* Two-column layout: form + info sidebar */}
      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        <RequestServiceForm services={services} />

        {/* Info sidebar */}
        <aside className="space-y-4 text-sm">
          <div className="card p-5 space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
              How it works
            </h2>
            <ol className="space-y-3">
              {[
                "Submit your service enquiry with contact details.",
                "Leadspire matches your request to available providers.",
                "Three providers are assigned instantly based on service type.",
                "Providers are notified and will follow up directly.",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600/10 text-[11px] font-semibold text-indigo-400">
                    {i + 1}
                  </span>
                  <span className="text-zinc-400 leading-snug">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="card p-5 space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Assignment rules
            </h2>
            <ul className="space-y-1.5 text-zinc-400">
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-zinc-600" />
                Exactly 3 providers per lead
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-zinc-600" />
                Fair rotation across the provider pool
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-zinc-600" />
                Monthly quota enforced per provider
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
