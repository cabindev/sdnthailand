'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { Procurement } from '@/app/types/procurement';

export default function ProcurementTable() {
  const [procurements, setProcurements] = useState<Procurement[]>([]);

  useEffect(() => {
    const fetchProcurements = async () => {
      try {
        const response = await axios.get('/api/procurement');
        setProcurements(response.data.procurements);
      } catch (error) {
        console.error('Error fetching procurements:', error);
      }
    };

    fetchProcurements();
  }, []);

  const openPdf = (pdfUrl: string | undefined) => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  const getStatusColor = (status: Procurement['status']) => {
    switch (status) {
      case 'OPEN':
        return 'bg-green-100 text-green-800';
      case 'CLOSED':
        return 'bg-red-100 text-red-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">รายการประกาศจัดซื้อจัดจ้าง</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">รูปภาพ</th>
              <th className="px-4 py-2 text-left">รหัสโครงการ</th>
              <th className="px-4 py-2 text-left">ชื่อโครงการ</th>
              <th className="px-4 py-2 text-left">วันที่เริ่ม</th>
              <th className="px-4 py-2 text-left">วันที่สิ้นสุด</th>
              <th className="px-4 py-2 text-left">สถานะ</th>
              <th className="px-4 py-2 text-left">ไฟล์ PDF</th>
            </tr>
          </thead>
          <tbody>
            {procurements.map((procurement) => (
              <tr key={procurement.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">
                  {procurement.coverImage && (
                    <Image
                      src={procurement.coverImage}
                      alt={procurement.title}
                      width={100}
                      height={100}
                      className="object-cover rounded"
                    />
                  )}
                </td>
                <td className="px-4 py-2">{procurement.projectCode}</td>
                <td className="px-4 py-2">{procurement.title}</td>
                <td className="px-4 py-2">{new Date(procurement.startDate).toLocaleDateString()}</td>
                <td className="px-4 py-2">{new Date(procurement.endDate).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(procurement.status)}`}>
                    {procurement.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {procurement.pdfFile && (
                    <button
                      onClick={() => openPdf(procurement.pdfFile)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-300"
                    >
                      เปิดไฟล์ PDF
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}