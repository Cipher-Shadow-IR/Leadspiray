"use client";

import { FormEvent, useState } from "react";

type ServiceOption = {
  id: number;
  name: string;
};

export function RequestServiceForm({
  services,
}: {
  services: ServiceOption[];
}) {
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
    providers?: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      city: String(formData.get("city") ?? ""),
      serviceId: Number(formData.get("serviceId")),
      description: String(formData.get("description") ?? ""),
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      setIsSubmitting(false);

      if (!response.ok) {
        setStatus({ type: "error", message: result.error ?? "Submission failed. Please try again." });
        return;
      }

      const providers = result.lead.assignments
        .map((a: { provider: { name: string } }) => a.provider.name)
        .join(", ");

      setStatus({
        type: "success",
        message: "Your request has been submitted.",
        providers,
      });
      form.reset();
    } catch {
      setIsSubmitting(false);
      setStatus({ type: "error", message: "Could not reach the server. Check your connection." });
    }
  }

  return (
    <form onSubmit={onSubmit} className="card p-6 space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="field">
          <span className="label">Full name</span>
          <input
            className="input"
            name="name"
            placeholder="Rahul Sharma"
            required
            maxLength={100}
            autoComplete="name"
          />
        </label>

        <label className="field">
          <span className="label">Phone number</span>
          <input
            className="input"
            name="phone"
            placeholder="+91 98765 43210"
            required
            maxLength={20}
            inputMode="tel"
            autoComplete="tel"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="field">
          <span className="label">City</span>
          <input
            className="input"
            name="city"
            placeholder="Mumbai"
            required
            maxLength={100}
          />
        </label>

        <label className="field">
          <span className="label">Service type</span>
          <select
            className="input"
            name="serviceId"
            required
            defaultValue=""
          >
            <option value="" disabled className="bg-zinc-900 text-zinc-500">
              Select a service
            </option>
            {services.map((service) => (
              <option
                key={service.id}
                value={service.id}
                className="bg-zinc-900 text-zinc-100"
              >
                {service.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="field">
        <span className="label">Details</span>
        <textarea
          className="input min-h-[120px] resize-y"
          name="description"
          placeholder="Describe your requirements — the more detail, the better the match."
          required
          maxLength={1000}
        />
      </label>

      <div className="space-y-3 pt-1">
        <button className="button w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <svg
                className="h-4 w-4 animate-spin"
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
              Submitting…
            </>
          ) : (
            "Submit Request"
          )}
        </button>

        {status?.type === "success" && (
          <div className="rounded-md border border-emerald-800/40 bg-emerald-950/30 px-4 py-3">
            <p className="text-sm font-medium text-emerald-400">
              {status.message}
            </p>
            {status.providers && (
              <p className="mt-1 text-xs text-emerald-600">
                Assigned to: {status.providers}
              </p>
            )}
          </div>
        )}

        {status?.type === "error" && (
          <div className="rounded-md border border-red-800/40 bg-red-950/30 px-4 py-3">
            <p className="text-sm font-medium text-red-400">{status.message}</p>
          </div>
        )}
      </div>
    </form>
  );
}
