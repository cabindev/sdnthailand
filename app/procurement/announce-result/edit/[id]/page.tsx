'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';

interface AnnounceResult {
  id: string;
  procurementId: string;
  pdfFile: string | null;
  announcedDate: string;
  procurement: {
    id: string;
    title: string;
    projectCode: string;
    startDate: string;
    endDate: string;
    status: string;
  };
}

export default function EditAnnounceResult({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [announcement, setAnnouncement] = useState<AnnounceResult | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnnouncement();
  }, [params.id]);

  const fetchAnnouncement = async () => {
    try {
      setLoading(true);
      const response = await axios.get<AnnounceResult>(`/api/announce-result/${params.id}`);
      setAnnouncement(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching announcement:', error);
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    if (pdfFile) {
      formData.append('pdfFile', pdfFile);
    }

    try {
      await axios.put(`/api/announce-result/${params.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('อัปเดตประกาศผลสำเร็จ');
      router.push('/dashboard/procurement/announce-result');
    } catch (error) {
      console.error('Error updating announcement:', error);
      alert('เกิดข้อผิดพลาดในการอัปเดตประกาศผล');
    }
  };

  if (loading) return <div>กำลังโหลดข้อมูล...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!announcement) return <div>ไม่พบข้อมูลประกาศผล</div>;

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <h1 className="text-3xl font-bold mb-6">แก้ไขประกาศผลการจัดซื้อจัดจ้าง</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <p><strong>รหัสโครงการ:</strong> {announcement.procurement.projectCode}</p>
        </div>
        <div>
          <p><strong>ชื่อโครงการ:</strong> {announcement.procurement.title}</p>
        </div>
        <div>
          <p><strong>วันที่เริ่มต้น:</strong> {new Date(announcement.procurement.startDate).toLocaleDateString()}</p>
        </div>
        <div>
          <p><strong>วันที่สิ้นสุด:</strong> {new Date(announcement.procurement.endDate).toLocaleDateString()}</p>
        </div>
        <div>
          <p><strong>สถานะ:</strong> {announcement.procurement.status}</p>
        </div>
        <div>
          <p><strong>วันที่ประกาศผล:</strong> {new Date(announcement.announcedDate).toLocaleDateString()}</p>
        </div>
        <div>
          <label htmlFor="pdfFile" className="block mb-2">ไฟล์ PDF ประกาศผลปัจจุบัน:</label>
          {announcement.pdfFile ? (
            <div>
              <a 
                href={announcement.pdfFile} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-500 hover:underline"
              >
                ดูไฟล์ PDF ปัจจุบัน
              </a>
            </div>
          ) : (
            <p>ไม่มีไฟล์ PDF</p>
          )}
        </div>
        <div>
          <label htmlFor="newPdfFile" className="block mb-2">อัปโหลดไฟล์ PDF ประกาศผลใหม่ (ถ้าต้องการเปลี่ยน):</label>
          <input
            type="file"
            id="newPdfFile"
            accept=".pdf"
            onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          อัปเดตประกาศผล
        </button>
      </form>
    </div>
  );
}