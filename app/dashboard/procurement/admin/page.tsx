'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';

interface Procurement {
  id: string;
  projectCode: string;
  title: string;
  description: string;
  coverImage: string | null;
  pdfFile: string | null;
  startDate: string;
  endDate: string;
  status: 'DRAFT' | 'OPEN' | 'CLOSED' | 'CANCELLED';
}

export default function AdminProcurementList() {
  const router = useRouter();
  const [procurements, setProcurements] = useState<Procurement[]>([]);

  useEffect(() => {
    fetchProcurements();
  }, []);

  const fetchProcurements = async () => {
    try {
      const response = await axios.get('/api/procurement');
      setProcurements(response.data.procurements);
    } catch (error) {
      console.error('Error fetching procurements:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('คุณแน่ใจหรือไม่ที่จะลบประกาศนี้?')) {
      try {
        await axios.delete(`/api/procurement/${id}`);
        fetchProcurements(); // Refresh the list after deletion
      } catch (error) {
        console.error('Error deleting procurement:', error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">จัดการประกาศจัดซื้อจัดจ้าง</h1>
      <Link href="/dashboard/procurement/create" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4 inline-block">
        สร้างประกาศใหม่
      </Link>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-4 py-2">รูปภาพ</th>
            <th className="px-4 py-2">รหัสโครงการ</th>
            <th className="px-4 py-2">ชื่อโครงการ</th>
            <th className="px-4 py-2">วันที่เริ่ม</th>
            <th className="px-4 py-2">วันที่สิ้นสุด</th>
            <th className="px-4 py-2">สถานะ</th>
            <th className="px-4 py-2">การดำเนินการ</th>
          </tr>
        </thead>
        <tbody>
          {procurements.map((procurement) => (
            <tr key={procurement.id} className="border-b">
              <td className="px-4 py-2">
                {procurement.coverImage ? (
                  <Image
                    src={procurement.coverImage}
                    alt={procurement.title}
                    width={50}
                    height={50}
                    className="object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">No Image</div>
                )}
              </td>
              <td className="px-4 py-2">{procurement.projectCode}</td>
              <td className="px-4 py-2">{procurement.title}</td>
              <td className="px-4 py-2">{new Date(procurement.startDate).toLocaleDateString()}</td>
              <td className="px-4 py-2">{new Date(procurement.endDate).toLocaleDateString()}</td>
              <td className="px-4 py-2">{procurement.status}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => router.push(`/dashboard/procurement/admin/${procurement.id}`)}
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600"
                >
                  แก้ไข
                </button>
                <button
                  onClick={() => handleDelete(procurement.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  ลบ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
