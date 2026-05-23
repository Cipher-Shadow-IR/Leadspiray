import { NextResponse } from "next/server";
import { getDashboardData } from "@/lib/dashboard";

export async function GET() {
  const providers = await getDashboardData();
  return NextResponse.json({ providers });
}
