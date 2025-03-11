import { useAuth } from '@/utils/context/authContext';
import { useState, useEffect } from 'react';
import { getSingleUser } from '@/api/userData';

export default function UserProfileCheck() {
  const { user } = useAuth();
  const [isProfileComplete, setIsProfileComplete] = useState(null); // Initially null to prevent unnecessary modal flash

  useEffect(() => {
    if (user) {
      getSingleUser(user.user_id).then((data) => {
        if (data?.[0]?.username && data?.[0]?.role) {
          setIsProfileComplete(true); // If user data is available, set isProfileComplete to true
        } else {
          setIsProfileComplete(false); // If user data is not available, set isProfileComplete to false
        }
      });
    }
  }, [user]); // Run this effect when user changes

  return isProfileComplete;
}
