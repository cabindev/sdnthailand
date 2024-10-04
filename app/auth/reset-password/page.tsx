'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get('token');
    setToken(urlToken);
  }, []);

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    if (!validatePassword(password)) {
      setMessage('รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessage('รหัสผ่านไม่ตรงกัน');
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post('/api/auth/reset-password', { token, password });
      setMessage(res.data.message);
      if (res.data.message === 'รีเซ็ตรหัสผ่านสำเร็จ') {
        setTimeout(() => router.push('/auth/signin'), 2000);
      }
    } catch (error) {
      console.error('Error occurred:', error);
      setMessage('เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน โปรดลองอีกครั้งในภายหลัง');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="max-w-md w-full space-y-8 p-10 bg-[var(--primary-foreground)] rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--foreground)]">
            รีเซ็ตรหัสผ่าน
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="password" className="sr-only">รหัสผ่านใหม่</label>
              <input
                id="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[var(--muted)] placeholder-[var(--muted-foreground)] text-[var(--foreground)] rounded-t-md focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)] focus:z-10 sm:text-sm"
                placeholder="รหัสผ่านใหม่"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">ยืนยันรหัสผ่านใหม่</label>
              <input
                id="confirmPassword"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[var(--muted)] placeholder-[var(--muted-foreground)] text-[var(--foreground)] rounded-b-md focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)] focus:z-10 sm:text-sm"
                placeholder="ยืนยันรหัสผ่านใหม่"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-[var(--primary-foreground)] bg-[var(--primary)] hover:bg-[var(--primary-foreground)] hover:text-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]"
              disabled={isLoading}
            >
              {isLoading ? 'กำลังดำเนินการ...' : 'รีเซ็ตรหัสผ่าน'}
            </button>
          </div>
        </form>

        {message && (
          <div className={`mt-2 text-center text-sm ${message.includes('สำเร็จ') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </div>
        )}

        <div className="text-center mt-4">
          <Link href="/auth/signin" className="font-medium text-[var(--primary)] hover:text-[var(--primary-foreground)]">
            กลับไปหน้าเข้าสู่ระบบ
          </Link>
        </div>
      </div>
    </div>
  );
}