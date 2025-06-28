'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import imageCompression from 'browser-image-compression';

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
 const [isCompressing, setIsCompressing] = useState(false);

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

 const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
   const file = e.target.files?.[0];
   if (!file) return;

   try {
     setIsCompressing(true);

     // บีบอัดรูปภาพ
     const options = {
       maxSizeMB: 0.5,
       maxWidthOrHeight: 800,
       useWebWorker: true,
       fileType: 'image/jpeg'
     };

     const compressedFile = await imageCompression(file, options);
     
     // สร้างไฟล์ใหม่
     const newFileName = `profile_${Date.now()}.jpg`;
     const finalImage = new File([compressedFile], newFileName, {
       type: 'image/jpeg'
     });

     // Preview
     const reader = new FileReader();
     reader.onloadend = () => {
       setImagePreview(reader.result as string);
     };
     reader.readAsDataURL(finalImage);

     setImage(finalImage);

   } catch (error) {
     console.error('Error:', error);
   } finally {
     setIsCompressing(false); 
   }
 };

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();

   try {
     const formData = new FormData();
     formData.append('firstName', firstName);
     formData.append('lastName', lastName);
     formData.append('email', email);
     if (image) {
       formData.append('image', image);
     }

     await axios.put(`/api/users/${id}`, formData, {
       headers: {
         'Content-Type': 'multipart/form-data'
       }
     });

     router.push('/dashboard/profile');
   } catch (error) {
     console.error('Error:', error);
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
         <label className="block text-sm font-medium text-gray-700 mb-2">
           รูปโปรไฟล์
           {isCompressing && <span className="text-blue-500 ml-2">กำลังบีบอัดรูปภาพ...</span>}
         </label>
         
         <input
           type="file"
           onChange={handleImageChange}
           accept="image/*"
           className="block w-full text-sm text-gray-500
             file:mr-4 file:py-2 file:px-4
             file:rounded-md file:border-0
             file:text-sm file:font-semibold
             file:bg-blue-50 file:text-blue-700
             hover:file:bg-blue-100"
           disabled={isCompressing}
         />

         {imagePreview && (
           <div className="mt-4 flex justify-center">
             <img
               src={imagePreview}
               alt="Preview"
               className="h-32 w-32 object-cover rounded-full border-2 border-gray-200"
             />
           </div>
         )}
       </div>

       <div className="flex justify-end">
         <button
           type="submit"
           disabled={isCompressing}
           className={`px-4 py-2 rounded-md text-white font-medium
             ${isCompressing ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}
             transition-colors duration-200`}
         >
           {isCompressing ? 'กำลังประมวลผล...' : 'บันทึกการเปลี่ยนแปลง'}
         </button>
       </div>
     </form>
   </div>
 );
}