CREATE TABLE "Service" (
  "id" INTEGER NOT NULL,
  "name" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Provider" (
  "id" INTEGER NOT NULL,
  "name" TEXT NOT NULL,
  "monthlyQuota" INTEGER NOT NULL DEFAULT 10,
  "usedQuota" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Provider_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Lead" (
  "id" SERIAL NOT NULL,
  "name" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "serviceId" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "LeadAssignment" (
  "id" SERIAL NOT NULL,
  "leadId" INTEGER NOT NULL,
  "providerId" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "LeadAssignment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AllocationState" (
  "id" SERIAL NOT NULL,
  "serviceId" INTEGER NOT NULL,
  "nextIndex" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "AllocationState_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "WebhookEvent" (
  "id" SERIAL NOT NULL,
  "eventId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Service_name_key" ON "Service"("name");
CREATE UNIQUE INDEX "Provider_name_key" ON "Provider"("name");
CREATE INDEX "Provider_usedQuota_idx" ON "Provider"("usedQuota");
CREATE UNIQUE INDEX "Lead_phone_serviceId_key" ON "Lead"("phone", "serviceId");
CREATE INDEX "Lead_serviceId_idx" ON "Lead"("serviceId");
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");
CREATE UNIQUE INDEX "LeadAssignment_leadId_providerId_key" ON "LeadAssignment"("leadId", "providerId");
CREATE INDEX "LeadAssignment_providerId_idx" ON "LeadAssignment"("providerId");
CREATE UNIQUE INDEX "AllocationState_serviceId_key" ON "AllocationState"("serviceId");
CREATE UNIQUE INDEX "WebhookEvent_eventId_key" ON "WebhookEvent"("eventId");

ALTER TABLE "Lead"
  ADD CONSTRAINT "Lead_serviceId_fkey"
  FOREIGN KEY ("serviceId") REFERENCES "Service"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "LeadAssignment"
  ADD CONSTRAINT "LeadAssignment_leadId_fkey"
  FOREIGN KEY ("leadId") REFERENCES "Lead"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "LeadAssignment"
  ADD CONSTRAINT "LeadAssignment_providerId_fkey"
  FOREIGN KEY ("providerId") REFERENCES "Provider"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "AllocationState"
  ADD CONSTRAINT "AllocationState_serviceId_fkey"
  FOREIGN KEY ("serviceId") REFERENCES "Service"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Provider"
  ADD CONSTRAINT "Provider_monthlyQuota_check"
  CHECK ("monthlyQuota" = 10);

ALTER TABLE "Provider"
  ADD CONSTRAINT "Provider_usedQuota_check"
  CHECK ("usedQuota" >= 0 AND "usedQuota" <= "monthlyQuota");
