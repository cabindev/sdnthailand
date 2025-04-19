export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF5F7]">
      <div className="bg-white rounded-2xl shadow-md p-8 max-w-lg w-full mx-4 text-center">
        <div className="mb-6">
          <span className="text-6xl">🛠️</span>
        </div>
        
        <h2 className="text-3xl font-bold text-pink-600 mb-4">
          ปิดปรับปรุงชั่วคราว
        </h2>
        
        <p className="text-gray-600 text-lg mb-6">
          ขออภัยในความไม่สะดวก เรากำลังปรับปรุงระบบให้ดีขึ้น
          <br />
          กรุณากลับมาใหม่ในภายหลัง
        </p>
        
        <div className="inline-block px-6 py-2 bg-pink-100 rounded-full">
          <span className="text-pink-500 font-medium">
            เร็วๆ นี้
          </span>
        </div>
      </div>
    </div>
  );
}