// userProfileCheck.js
import { useAuth } from '@/utils/context/authContext';
import { useState, useEffect } from 'react';
import { getSingleUser } from '@/api/userData';

export default function UserProfileCheck() {
  const { user } = useAuth();
  const [isProfileComplete, setIsProfileComplete] = useState(null); // Null until checked

  useEffect(() => {
    if (user) {
      const idToCheck = localStorage.getItem('djangoUserId') || user.user_id; // Try stored ID first
      console.log('Checking profile for ID:', idToCheck); // Debug
      getSingleUser(idToCheck)
        .then((data) => {
          if (data && data.username && data.role) {
            // Check object directly, not array
            setIsProfileComplete(true);
          } else {
            setIsProfileComplete(false);
          }
        })
        .catch((error) => {
          console.error('Error checking profile:', error.message);
          setIsProfileComplete(false); // Treat 404 as incomplete profile
        });
    }
  }, [user]);

  return isProfileComplete;
}
