import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { CHAIRS_PER_SLOT, clinicNow, isBookableDate, isPastSlot, slotsForDate } from "@/lib/schedule";

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date") ?? "";
  const now = clinicNow();

  if (!isBookableDate(date, now.date)) {
    return Response.json({ date, slots: [] });
  }

  const booked = await db.appointment.groupBy({
    by: ["time"],
    where: { date, status: { not: "CANCELADA" } },
    _count: true,
  });
  const counts = new Map(booked.map((b) => [b.time, b._count]));

  const slots = slotsForDate(date).map((time) => {
    const left = isPastSlot(date, time, now) ? 0 : CHAIRS_PER_SLOT - (counts.get(time) ?? 0);
    return { time, left: Math.max(left, 0) };
  });

  return Response.json({ date, slots }, { headers: { "Cache-Control": "no-store" } });
}
