'use client'

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { FaCheckCircle, FaPaperPlane } from 'react-icons/fa';

export default function RequestMedia() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error('กรุณาเข้าสู่ระบบก่อนส่งคำขอ');
      return;
    }
    setIsLoading(true);

    const formData = new FormData();
    formData.append('subject', subject);
    formData.append('message', message);
    formData.append('phoneNumber', phoneNumber);
    if (file) formData.append('file', file);

    try {
      const response = await axios.post('/api/support', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 5000);
    } catch (error) {
      setIsLoading(false);
      toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('ไฟล์ขนาดใหญ่เกินไป (ไม่เกิน 5MB)');
        return;
      }
      setFile(selectedFile);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#ffedd5] to-[#fff7ed]">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center">
          <FaCheckCircle className="text-[#f58220] text-6xl mb-4 mx-auto" />
          <h2 className="text-3xl font-bold text-[#f58220] mb-4">คำขอสื่อรณรงค์ถูกส่งเรียบร้อยแล้ว!</h2>
          <p className="text-gray-600 mb-4">ขอบคุณสำหรับความสนใจของคุณ เราจะติดต่อกลับโดยเร็วที่สุด</p>
          <p className="text-sm text-gray-500">กำลังนำคุณกลับสู่หน้าหลัก...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-amber-50 to-amber-100 relative">
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center">
            <FaPaperPlane className="text-[#f58220] text-6xl mb-4 mx-auto animate-bounce" />
            <h2 className="text-2xl font-bold text-[#f58220] mb-4">กำลังส่งคำขอ...</h2>
            <p className="text-gray-600">โปรดรอสักครู่</p>
          </div>
        </div>
      )}
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-2xl">
        <div>
          <Image src="/logo.png" alt="Logo" width={100} height={100} className="mx-auto" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">ขอสื่อรณรงค์</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            ร่วมเป็นส่วนหนึ่งในการสร้างการเปลี่ยนแปลง
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="subject"
                name="subject"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="หัวข้อ"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div>
              <textarea
                id="message"
                name="message"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="ข้อความ"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
            </div>
            <div>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="เบอร์โทรศัพท์"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700">แนบไฟล์ PDF (หนังสือขอสื่อ)</label>
            <input
              id="file"
              name="file"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-amber-50 file:text-amber-700
                hover:file:bg-violet-100
              "
            />
          </div>

          <div>
          <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            >
              ส่งคำขอ
            </button>
          </div>
        </form>
        <Toaster />
      </div>
    </div>
  );
}