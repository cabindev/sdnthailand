'use client'
import Image from "next/image";
export default function Chart() {
  return (
    <div className="p-8  bg-Amber-100 pt-24"> 
      <div className="flex flex-col items-center justify-center ">
          <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-orange-400">
          โครงสร้างสำนักงานเครือข่ายองค์กรงดเหล้า ปี 2567
        </h1>
        <div className="flex justify-center items-center space-x-2 mt-4">
            <Image
              src="/images/sdn.png"
              alt="Logo"
              width={100}
              height={100}
            />
          </div>
      </div>
        </div>
      {/* แผนกหลัก */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        {/* สมาคมเครือข่ายงดเหล้า... */}
        <div className="card bg-blue-200 shadow-2xl col-span-1 md:col-span-2">
          <div className="card-body text-center">
            <div className="flex justify-center mb-4">
              <img
                src="/images/Teera.png"
                alt="นายธีระ วัชรปราณี"
                className="rounded-full h-28 w-28 object-cover"
              />
            </div>
            <p className="font-semibold">นายกสมาคมฯ: นายธีระ วัชรปราณี</p>
            <h2 className="card-title text-2xl mb-2 justify-center">
              สมาคมเครือข่ายงดเหล้าและงดปัจจัยเสี่ยงต่อสุขภาพ
            </h2>
          </div>
        </div>

        {/* เครือข่ายงดเหล้า (Stop Drink Network) */}
        <div className="card bg-purple-200 shadow-xl col-span-1">
          <div className="card-body text-center">
            <div className="flex justify-center">
              <img
                src="/images/songran.jpg"
                alt="อาสงกรานต์"
                className="rounded-full h-28 w-28 object-cover"
              />
            </div>
            <p className="font-semibold">
              ประธานเครือข่าย: นายสงกรานต์ ภาคโชคดี
            </p>
            <p>สมาชิกอาสาสมัครทั่วประเทศ</p>
            <h2 className="card-title text-xl mb-2 justity-center">
              เครือข่ายงดเหล้า (Stop Drink Network)
            </h2>
          </div>
        </div>
      </div>
      {/* แผนกย่อย */}
      <div className="flex flex-col items-center my-6">
        <div className="text-center mb-4">
          {/* รูปภาพผู้อำนวยการสำนักงานฯ */}
          <h2 className="text-lg font-bold text-gray-800">
            สำนักงานเครือข่ายองค์กรงดเหล้า
          </h2>
          <p className="text-lg text-gray-600">
            ผู้อำนวยการสำนักงานฯ:{" "}
            <span className="font-semibold">นายธีระ วัชรปราณี</span>
          </p>
        </div>

        {/* ลูกศรชี้ไปยังแผนกย่อย */}
        <div className="flex justify-center">
          <div className="flex flex-col items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-blue-500 mb-2 animate-bounce"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m0 0l-8-8m8 8l8-8"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="p-8 bg-gray-50">
        {/* ...ส่วนหัวและโครงสร้างหลัก... */}

        {/* แผนกย่อย */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* ผู้ช่วยผู้อำนวยการสำนักงานฯ */}
          <div className="card bg-teal-200 shadow-xl col-span-1 md:col-span-2">
            <div className="card-body text-center">
              <div className="flex justify-center">
                <img
                  src="/images/chai.jpg"
                  alt="พี่ดำ"
                  className="rounded-full h-24 w-24 object-cover"
                />
              </div>
              <h4>นายชัยณรงค์ คำแดง</h4>
              <h2 className="card-title justify-center">
                ผู้ช่วยผู้อำนวยการสำนักงานฯ
              </h2>
              <h3>กลุ่มงานด้านสำนักงาน จัดซื้อและคลังสื่อ</h3>
            </div>
            
          </div>
          {/* ผู้จัดการโครงการส่วนกลาง */}
          <div className="card bg-lime-200 shadow-xl col-span-1">
            <div className="card-body">
              <h2 className="card-title">
                ผู้จัดการศูนย์ประสานงาน ระดับภูมิภาค 9 แห่ง
              </h2>
              {/* เพิ่มรายชื่อจังหวัดตามที่กำหนด */}
              <p>1. ภาคเหนือตอนบน 8 จังหวัด</p>
              <p>2. ภาคเหนือตอนล่าง 10 จังหวัด</p>
              <p>3. ภาคอีสานตอนบน 11 จังหวัด</p>
              <p>4. ภาคอีสานตอนล่าง 9 จังหวัด</p>
              <p>5. ภาคกลาง กทม. 9 จังหวัด</p>
              <p>6. ภาคตะวันตก 8 จังหวัด</p>
              <p>7. ภาคตะวันออก 8 จังหวัด</p>
              <p>8. ภาคใต้ตอนบน 7 จังหวัด</p>
              <p>9. ภาคใต้ตอนล่าง 7 จังหวัด</p>
            </div>
          </div>

          {/* ผู้จัดการศูนย์ประสานงาน */}
          <div className="card bg-green-200 shadow-xl col-span-1">
            <div className="card-body">
              {/* เพิ่มรายชื่อจังหวัดตามที่กำหนด */}
              <h2 className="card-title">ผู้จัดการโครงการส่วนกลาง</h2>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src="/images/toe.jpg"
                    alt="Avatar"
                  />
                </div>
                <p>นายสุวรรณกิตต์ บุญแท้</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src="/images/noot.jpg"
                    alt="Avatar"
                  />
                </div>
                <p>นส.พิมพ์มณี เมฆพายัพ</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src="/images/titi.jpg"
                    alt="Avatar"
                  />
                </div>
                <p>นายธิติ ภัทรสิทธิกฤต</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src="/images/Kru.jpg"
                    alt="Avatar"
                  />
                </div>
                <p>นส.อภิศา มะหะมาน</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src="/images/Malai.jpg"
                    alt="Avatar"
                  />
                </div>
                <p>นางมาลัย มินศรี</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src="/images/tui.jpg"
                    alt="Avatar"
                  />
                </div>
                <p>นายวิษณุ ศรีทะวงศ์</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src="/images/laor.jpg"
                    alt="Avatar"
                  />
                </div>
                <p>นส.ละออ นาสมบูรณ์</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src="/images/jeab.jpg"
                    alt="Avatar"
                  />
                </div>
                <p>นางปุณนภา เอมวัฒนา</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src="/images/some.jpg"
                    alt="Avatar"
                  />
                </div>
                <p>นส.สมรุจี สุขสม</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src="/images/Dan.jpg"
                    alt="Avatar"
                  />
                </div>
                <p>นายธีร์ธรรม วุฒิวัตรชัยแก้ว</p>
              </div>
            </div>
          </div>

          {/* กลุ่มสื่อสารและประชาสัมพันธ์ */}
          <div className="card bg-orange-50 shadow-xl col-span-1 md:col-span-2">
            <div className="card-body">
              <h2 className="card-title">กลุ่มสื่อสารและประชาสัมพันธ์</h2>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src="/images/Chom.jpg"
                    alt="Avatar"
                  />
                </div>
                <p>นส.กนิษฐา ติ้ววงศ์</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src="/images/yut.jpg"
                    alt="Avatar"
                  />
                </div>
                <p>นายยงยุทธ ยอดจารย์</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
