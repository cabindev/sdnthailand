'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Procurement, AnnounceResult } from '@/app/types/procurement';

export default function EditAnnounceResult({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [procurements, setProcurements] = useState<Procurement[]>([]);
  const [selectedProcurement, setSelectedProcurement] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [currentPdfFile, setCurrentPdfFile] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [announcement, setAnnouncement] = useState<AnnounceResult | null>(null);

  useEffect(() => {
    fetchAnnouncement();
    fetchProcurements();
  }, [params.id]);

  const fetchAnnouncement = async () => {
    try {
      const response = await axios.get<AnnounceResult>(`/api/announce-result/${params.id}`);
      setAnnouncement(response.data);
      setSelectedProcurement(response.data.procurementId);
      setCurrentPdfFile(response.data.pdfFile);
    } catch (error) {
      console.error('Error fetching announcement:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProcurements = async () => {
    try {
      const response = await axios.get<{ procurements: Procurement[] }>('/api/procurement');
      setProcurements(response.data.procurements);
    } catch (error) {
      console.error('Error fetching procurements:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProcurement) {
      alert('กรุณาเลือกโครงการ');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('procurementId', selectedProcurement);
    if (pdfFile) {
      formData.append('pdfFile', pdfFile);
    }

    try {
      await axios.put(`/api/announce-result/${params.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('แก้ไขประกาศผลสำเร็จ');
      router.push('/dashboard/procurement/announce-result');
    } catch (error) {
      console.error('Error updating announcement:', error);
      alert('เกิดข้อผิดพลาดในการแก้ไขประกาศผล');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">แก้ไขประกาศผลการจัดซื้อจัดจ้าง</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="procurement" className="block mb-2">เลือกโครงการ:</label>
          <select
            id="procurement"
            value={selectedProcurement}
            onChange={(e) => setSelectedProcurement(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">เลือกโครงการ</option>
            {procurements.map((proc) => (
              <option key={proc.id} value={proc.id}>{proc.title}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="currentPdf" className="block mb-2">ไฟล์ PDF ปัจจุบัน:</label>
          {currentPdfFile ? (
            <a href={currentPdfFile} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              ดูไฟล์ PDF ปัจจุบัน
            </a>
          ) : (
            <span>ไม่มีไฟล์ PDF</span>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="pdfFile" className="block mb-2">อัปโหลดไฟล์ PDF ประกาศผลใหม่ (ถ้าต้องการเปลี่ยน):</label>
          <input
            type="file"
            id="pdfFile"
            accept=".pdf"
            onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" disabled={loading}>
          {loading ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
        </button>
      </form>
    </div>
  );
}