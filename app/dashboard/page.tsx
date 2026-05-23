import { getDashboardData } from "@/lib/dashboard";
import { DashboardClient } from "./DashboardClient";

export default async function DashboardPage() {
  const providers = await getDashboardData();

  const totalUsed = providers.reduce((sum, p) => sum + p.usedQuota, 0);
  const totalCapacity = providers.reduce((sum, p) => sum + p.monthlyQuota, 0);
  const totalLeads = providers.reduce((sum, p) => sum + p.leadsReceivedCount, 0);
  const activeProviders = providers.filter((p) => p.usedQuota > 0).length;

  return (
    <section>
      {/* Page header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-100">
            Provider Dashboard
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Real-time quota and lead assignment across all providers.
          </p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total leads" value={String(totalLeads)} />
        <StatCard label="Slots used" value={`${totalUsed} / ${totalCapacity}`} />
        <StatCard label="Active providers" value={`${activeProviders} / ${providers.length}`} />
        <StatCard
          label="Avg. utilisation"
          value={`${totalCapacity > 0 ? Math.round((totalUsed / totalCapacity) * 100) : 0}%`}
        />
      </div>

      <DashboardClient initialProviders={providers} />
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card px-4 py-3">
      <div className="text-xs text-zinc-500">{label}</div>
      <div className="mt-1 text-lg font-semibold tabular-nums text-zinc-100">
        {value}
      </div>
    </div>
  );
}
