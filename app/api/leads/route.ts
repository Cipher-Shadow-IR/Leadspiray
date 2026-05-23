import { NextResponse } from "next/server";
import {
  DuplicateLeadError,
  InsufficientQuotaError
} from "@/lib/allocation";
import { createLead } from "@/lib/lead-service";
import { prisma } from "@/lib/prisma";
import { createLeadSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = createLeadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid lead data.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const lead = await createLead(prisma, parsed.data);
    return NextResponse.json({ lead }, { status: 201 });
  } catch (error) {
    if (error instanceof DuplicateLeadError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    if (error instanceof InsufficientQuotaError) {
      return NextResponse.json({ error: error.message }, { status: 422 });
    }

    console.error(error);
    return NextResponse.json({ error: "Failed to create lead." }, { status: 500 });
  }
}
