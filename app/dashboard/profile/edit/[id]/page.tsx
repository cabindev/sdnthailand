'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  image?: string;
}

export default function EditProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`/api/users/${id}`);
        const profileData = response.data;
        setProfile(profileData);
        setFirstName(profileData.firstName);
        setLastName(profileData.lastName);
        setEmail(profileData.email);
        setImagePreview(profileData.image);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setImage(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('email', email);
      if (image) formData.append('image', image);

      await axios.put(`/api/users/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      router.push('/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-slate-100 max-w-4xl mx-auto px-4 py-8 pt-20">
      <h1 className="text-2xl font-semibold mb-6 text-center">แก้ไขโปรไฟล์</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">ชื่อ</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">นามสกุล</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">อีเมล</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">รูปโปรไฟล์</label>
          <input
            type="file"
            id="image"
            onChange={handleImageChange}
            className="mt-1 block w-full"
            accept="image/*"
          />
          {imagePreview && (
            <div className="mt-2">
              <Image
                src={imagePreview}
                alt="Profile Preview"
                width={100}
                height={100}
                className="rounded-full"
              />
            </div>
          )}
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            บันทึกการเปลี่ยนแปลง
          </button>
        </div>
      </form>
    </div>
  );
}