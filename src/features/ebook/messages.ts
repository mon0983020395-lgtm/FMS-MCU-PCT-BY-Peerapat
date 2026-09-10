import type { Dictionary } from "@/shared/lib/i18n/translate";

export const MESSAGES: Dictionary = {
  "ebook.nav": { th: "ระบบ E-Book", en: "E-Books" },
  "ebook.title": { th: "จัดการหนังสืออิเล็กทรอนิกส์ (E-Book)", en: "E-Book Management" },
  "ebook.subtitle": { th: "เพิ่ม แก้ไข หรือลบ E-Book ในระบบ", en: "Manage electronic books in the system" },
  "ebook.create": { th: "เพิ่ม E-Book", en: "Add E-Book" },
  "ebook.edit": { th: "แก้ไข E-Book", en: "Edit E-Book" },
  "ebook.delete": { th: "ลบ E-Book", en: "Delete E-Book" },
  "ebook.titleField": { th: "ชื่อหนังสือ", en: "Title" },
  "ebook.authorField": { th: "ผู้แต่ง", en: "Author" },
  "ebook.publisherField": { th: "สำนักพิมพ์", en: "Publisher" },
  "ebook.categoryField": { th: "หมวดหมู่", en: "Category" },
  "ebook.publishDateField": { th: "วันที่ตีพิมพ์", en: "Publish Date" },
  "ebook.statusField": { th: "สถานะ", en: "Status" },
  "ebook.empty": { th: "ยังไม่มี E-Book ในระบบ", en: "No E-Books found" },
  "ebook.createSuccess": { th: "เพิ่ม E-Book สำเร็จ", en: "E-Book created successfully" },
  "ebook.updateSuccess": { th: "อัปเดตข้อมูลสำเร็จ", en: "E-Book updated successfully" },
  "ebook.deleteSuccess": { th: "ลบข้อมูลสำเร็จ", en: "E-Book deleted successfully" },
  "ebook.deleteConfirm": { th: "คุณต้องการลบ E-Book เล่มนี้ใช่หรือไม่?", en: "Are you sure you want to delete this E-Book?" },
  "roles.module.ebook": { th: "ระบบ E-Book", en: "E-Book Module" },
  "perm.ebook:read": { th: "ดูข้อมูล E-Book", en: "View E-Books" },
  "perm.ebook:manage": { th: "จัดการ E-Book", en: "Manage E-Books" },
};
