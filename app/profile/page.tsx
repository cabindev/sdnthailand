'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  image?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user?.id) {
        try {
          const response = await axios.get(`/api/users/${session.user.id}`);
          setProfile(response.data);
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
    };

    fetchProfile();
  }, [session]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen pt-16"> {/* Added pt-16 for navbar space */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="relative h-48 bg-gradient-to-r from-orange-200 to-orange-300">
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-4xl font-bold text-white text-shadow-md">SDN Thailand</h2>
            </div>
            <button 
              onClick={() => router.push(`/profile/edit/${profile.id}`)}
              className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out"
            >
              Edit
            </button>
          </div>
          <div className="relative px-6 py-10">
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
            {profile.image ? (
              <img
                src={profile.image}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 text-xl font-bold border-4 border-white shadow-lg">
                {profile.firstName[0]}{profile.lastName[0]}
              </div>
            )}
          </div>
            <div className="text-center mt-16">
              <h2 className="text-3xl font-semibold text-gray-800">{`${profile.firstName} ${profile.lastName}`}</h2>
              <p className="text-gray-600 mt-2">{profile.role}</p>
            </div>
            <div className="mt-6 border-t border-gray-200 pt-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{profile.email}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Role</dt>
                  <dd className="mt-1 text-sm text-gray-900">{profile.role}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}