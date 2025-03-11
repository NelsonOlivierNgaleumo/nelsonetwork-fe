'use client';

import ProfileForm from '@/components/forms/ProfileForm';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/utils/context/authContext';
import { getSingleUser } from '@/api/userData';

export default function CreateProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [showProfileForm, setShowProfileForm] = useState(false);

  useEffect(() => {
    if (user) {
      getSingleUser(user.user_id).then((data) => {
        // if user has a profile, redirect to networks page
        if (data && data[0] && data[0].username && data[0].role) {
          router.push('/networks');
        } else {
          // if user does not have a profile, show the profile form
          setShowProfileForm(true);
        }
      });
    }
  }, [user, router]);

  return (
    <div>
      {/* Show the profile form if showProfileForm is true */}
      {showProfileForm && <ProfileForm />}
    </div>
  );
}
