'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Procurement } from '@/app/types/procurement';

export default function CreateAnnounceResult() {
  const router = useRouter();
  const [procurements, setProcurements] = useState<Procurement[]>([]);
  const [selectedProcurement, setSelectedProcurement] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProcurements();
  }, []);

  const fetchProcurements = async () => {
    try {
      const response = await axios.get('/api/procurement?status=OPEN');
      setProcurements(response.data.procurements);
    } catch (error) {
      console.error('Error fetching procurements:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProcurement || !pdfFile) {
      alert('กรุณาเลือกโครงการและอัปโหลดไฟล์ PDF');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('procurementId', selectedProcurement);
    formData.append('pdfFile', pdfFile);

    try {
      await axios.post('/api/announce-result', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('สร้างประกาศผลสำเร็จ');
      router.push('/dashboard/procurement/announce-result');
    } catch (error) {
      console.error('Error creating announcement:', error);
      alert('เกิดข้อผิดพลาดในการสร้างประกาศผล');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">สร้างประกาศผลการจัดซื้อจัดจ้าง</h1>
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
            {procurements.map((proc: any) => (
              <option key={proc.id} value={proc.id}>{proc.title}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="pdfFile" className="block mb-2">อัปโหลดไฟล์ PDF ประกาศผล:</label>
          <input
            type="file"
            id="pdfFile"
            accept=".pdf"
            onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          สร้างประกาศผล
        </button>
      </form>
    </div>
  );
}