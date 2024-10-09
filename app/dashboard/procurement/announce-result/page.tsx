'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFilePdf, FaSpinner } from 'react-icons/fa';

interface AnnounceResult {
  id: string;
  procurementId: string;
  pdfFile: string | null;
  announcedDate: string;
  procurement: {
    projectCode: string;
    title: string;
    status: 'DRAFT' | 'OPEN' | 'CLOSED' | 'CANCELLED';
  };
}

export default function AnnounceResultList() {
  const [announceResults, setAnnounceResults] = useState<AnnounceResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnnounceResults();
  }, []);

  const fetchAnnounceResults = async () => {
    try {
      setLoading(true);
      const response = await axios.get<{ announcements: AnnounceResult[] }>('/api/announce-result');
      setAnnounceResults(response.data.announcements);
      setError(null);
    } catch (error) {
      console.error('Error fetching announce results:', error);
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const openPdf = (pdfUrl: string | null) => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><FaSpinner className="animate-spin text-4xl" /></div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">รายการประกาศผลการจัดซื้อจัดจ้าง</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-4 py-2">รหัสโครงการ</th>
            <th className="px-4 py-2">ชื่อโครงการ</th>
            <th className="px-4 py-2">วันที่ประกาศผล</th>
            <th className="px-4 py-2">สถานะ</th>
            <th className="px-4 py-2">ไฟล์ PDF ผลประกาศ</th>
          </tr>
        </thead>
        <tbody>
          {announceResults.map((result) => (
            <tr key={result.id} className="border-b">
              <td className="px-4 py-2">{result.procurement.projectCode}</td>
              <td className="px-4 py-2">{result.procurement.title}</td>
              <td className="px-4 py-2">{new Date(result.announcedDate).toLocaleDateString()}</td>
              <td className="px-4 py-2">{result.procurement.status}</td>
              <td className="px-4 py-2">
                {result.pdfFile ? (
                  <button onClick={() => openPdf(result.pdfFile)} className="bg-blue-500 text-white px-3 py-1 rounded">
                    <FaFilePdf className="inline mr-2" />
                    เปิด PDF
                  </button>
                ) : (
                  'ไม่มีไฟล์ PDF'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}