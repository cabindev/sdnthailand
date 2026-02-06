// สีสำหรับ category (เหมือน sdnmapportal)
const COLOR_PALETTE = [
  '#FF4444', // Bright Red - แดงสด
  '#FF8800', // Vivid Orange - ส้มสด
  '#FFDD00', // Bright Yellow - เหลืองสด
  '#44BB44', // Bright Green - เขียวสด
  '#00DDDD', // Bright Cyan - ฟ้าเขียวสด
  '#4488FF', // Bright Blue - น้ำเงินสด
  '#AA44FF', // Bright Purple - ม่วงสด
  '#FF44AA', // Bright Pink - ชมพูสด
  '#FF7722', // Bright Orange-Red - ส้มแดงสด
  '#66DD66', // Light Green - เขียวอ่อนสด
  '#FF6699', // Light Pink - ชมพูอ่อนสด
  '#6666FF', // Light Blue - น้ำเงินอ่อนสด
  '#FFAA00', // Bright Amber - เหลืองทองสด
  '#22DDAA', // Turquoise - เขียวฟ้าสด
  '#BB44BB', // Magenta - ม่วงแดงสด
  '#DDAA44', // Golden - ทองคำสด
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
