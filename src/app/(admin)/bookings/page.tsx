import { requireSession, hasPermission } from "@/features/identity/server";
import { getBookings, getActiveFacilities, BOOKING_P } from "@/features/booking/server";
import { BookingClient } from "./_components/booking-client";

export default async function BookingPage() {
  const session = await requireSession();
  const initialItems = await getBookings();
  const facilities = await getActiveFacilities();
  const canManage = hasPermission(session, BOOKING_P.manage);
  return (
    <BookingClient
      initialItems={initialItems}
      facilities={facilities}
      canManage={canManage}
    />
  );
}
