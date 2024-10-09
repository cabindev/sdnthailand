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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProcurements();
  }, []);

  const fetchProcurements = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/procurement');
      setProcurements(response.data.procurements);
      setError(null);
    } catch (error) {
      console.error('Error fetching procurements:', error);
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await fetch(`/api/procurement/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchProcurements(); // Refresh the list
        } else {
          throw new Error('Failed to delete gallery item');
        }
      } catch (error) {
        console.error('Error deleting gallery item:', error);
        alert('Failed to delete gallery item. Please try again.');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">กำลังโหลดข้อมูล...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">จัดการประกาศจัดซื้อจัดจ้าง</h1>
      <Link href="/dashboard/procurement/create" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4 inline-block">
        สร้างประกาศใหม่
      </Link>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
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
              <tr key={procurement.id} className="border-b hover:bg-gray-50">
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
    </div>
  );
}