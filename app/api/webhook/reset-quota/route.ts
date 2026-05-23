import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resetQuotaWebhookSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = resetQuotaWebhookSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid webhook payload.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const result = await prisma.$transaction(
      async (tx) => {
        const event = await tx.webhookEvent.create({
          data: {
            eventId: parsed.data.eventId,
            type: parsed.data.type
          }
        });

        await tx.provider.updateMany({
          data: { usedQuota: 0, monthlyQuota: 10 }
        });

        return { processed: true, event };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable
      }
    );

    return NextResponse.json({
      processed: result.processed,
      eventId: result.event.eventId
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json({
        processed: false,
        duplicate: true,
        eventId: parsed.data.eventId
      });
    }

    console.error(error);
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}
