'use client';

import { useState, FormEvent } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/forgot-password', { email });
      setMessage(res.data.message);
      setIsSuccess(true);
    } catch (error: any) {
      console.error('Error occurred:', error);
      setMessage(error.response?.data?.error || 'เกิดข้อผิดพลาดในการส่งอีเมล โปรดลองอีกครั้งในภายหลัง');
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="max-w-md w-full space-y-8 p-10 bg-[var(--primary-foreground)] rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--foreground)]">
            ลืมรหัสผ่าน
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                อีเมล
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-[var(--muted)] placeholder-[var(--muted-foreground)] text-[var(--foreground)] focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)] focus:z-10 sm:text-sm"
                placeholder="กรอกอีเมลของคุณ"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-[var(--primary-foreground)] bg-[var(--primary)] hover:bg-[var(--primary-foreground)] hover:text-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                'ส่งลิงก์รีเซ็ตรหัสผ่าน'
              )}
            </button>
          </div>
        </form>

        {message && (
          <div role="alert" className={`alert mt-4 ${isSuccess ? 'alert-success' : 'alert-error'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isSuccess ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" : "M6 18L18 6M6 6l12 12"} />
            </svg>
            <span>{message}</span>
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