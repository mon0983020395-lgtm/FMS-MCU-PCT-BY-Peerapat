import type { Dictionary } from "@/shared/lib/i18n/translate";

export const MESSAGES: Dictionary = {
  "booking.nav": { th: "จองห้องและยานพาหนะ", en: "Bookings" },
  "booking.title": { th: "จัดการการจอง", en: "Booking Management" },
  "booking.subtitle": { th: "จัดการการจองห้องประชุมและยานพาหนะ", en: "Manage room and vehicle bookings" },
  "booking.create": { th: "สร้างการจอง", en: "New Booking" },
  "booking.edit": { th: "แก้ไขการจอง", en: "Edit Booking" },
  "booking.delete": { th: "ยกเลิกการจอง", en: "Cancel Booking" },
  "booking.facilityField": { th: "สถานที่/ยานพาหนะ", en: "Facility" },
  "booking.purposeField": { th: "จุดประสงค์", en: "Purpose" },
  "booking.startTimeField": { th: "เวลาเริ่มต้น", en: "Start Time" },
  "booking.endTimeField": { th: "เวลาสิ้นสุด", en: "End Time" },
  "booking.statusField": { th: "สถานะ", en: "Status" },
  "booking.empty": { th: "ไม่มีข้อมูลการจอง", en: "No bookings found" },
  "booking.createSuccess": { th: "สร้างการจองแล้ว", en: "Booking created successfully" },
  "booking.updateSuccess": { th: "อัปเดตการจองแล้ว", en: "Booking updated successfully" },
  "booking.deleteSuccess": { th: "ยกเลิกการจองแล้ว", en: "Booking canceled successfully" },
  "booking.deleteConfirm": { th: "คุณต้องการยกเลิกการจองนี้ใช่หรือไม่?", en: "Are you sure you want to cancel this booking?" },
  "roles.module.booking": { th: "ระบบการจอง", en: "Booking Module" },
  "perm.booking:read": { th: "ดูข้อมูลการจอง", en: "View bookings" },
  "perm.booking:manage": { th: "จัดการข้อมูลการจอง", en: "Manage bookings" },
};
