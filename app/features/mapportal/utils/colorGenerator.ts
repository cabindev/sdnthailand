// สีสำหรับ category (Tailwind CSS color palette)
const COLOR_PALETTE = [
  '#EF4444', // red-500 - แดง
  '#06B6D4', // cyan-500 - ฟ้าเขียว
  '#22C55E', // green-500 - เขียว
  '#A855F8', // purple-500 - ม่วง
  '#F97316', // orange-500 - ส้ม
  '#3B82F6', // blue-500 - น้ำเงิน
  '#FACC15', // yellow-400 - เหลือง
  '#EC4899', // pink-500 - ชมพู
  '#84CC16', // lime-500 - มะนาว
  '#6366F1', // indigo-500 - คราม
  '#14B8A6', // teal-500 - เขียวอมฟ้า
  '#D946EF', // fuchsia-500 - ฟิวเชีย
  '#F59E0B', // amber-500 - อำพัน
  '#0EA5E9', // sky-500 - ฟ้าอ่อน
  '#8B5CF6', // violet-500 - ไวโอเล็ต
  '#F43F5E', // rose-500 - กุหลาบ
];

/**
 * สร้างสีสำหรับหมวดหมู่โดยอัตโนมัติจาก ID
 */
export function getCategoryColor(id: number): string {
  const colorIndex = (id - 1) % COLOR_PALETTE.length;
  return COLOR_PALETTE[colorIndex];
}

/**
 * สร้างสีสำหรับหมวดหมู่โดยอัตโนมัติจากชื่อ
 */
export function generateColorByName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % COLOR_PALETTE.length;
  return COLOR_PALETTE[colorIndex];
}
