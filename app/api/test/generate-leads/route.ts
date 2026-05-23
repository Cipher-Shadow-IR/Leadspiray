import { NextResponse } from "next/server";
import { createLead } from "@/lib/lead-service";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const batchId = String(Date.now()).slice(-10);
  const leadInputs = Array.from({ length: 10 }, (_, index) => ({
    name: `Concurrent Test ${index + 1}`,
    phone: `9${batchId}${String(index).padStart(2, "0")}`,
    city: "Test City",
    serviceId: ((index % 3) + 1) as 1 | 2 | 3,
    description: "Generated from the concurrency test tool."
  }));

  const results = await Promise.allSettled(
    leadInputs.map((input) => createLead(prisma, input))
  );

  return NextResponse.json({
    requested: leadInputs.length,
    created: results.filter((result) => result.status === "fulfilled").length,
    failed: results.filter((result) => result.status === "rejected").length,
    results: results.map((result, index) => {
      if (result.status === "fulfilled") {
        return {
          index,
          ok: true,
          leadId: result.value.id,
          providers: result.value.assignments.map((assignment) => assignment.provider.name)
        };
      }

      return {
        index,
        ok: false,
        error:
          result.reason instanceof Error
            ? result.reason.message
            : "Unknown error"
      };
    })
  });
}
