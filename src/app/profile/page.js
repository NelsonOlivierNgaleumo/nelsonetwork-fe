'use client';

import React, { useState, useEffect } from 'react';
import { getSingleUser, deleteUser, createUser } from '@/api/userData';
import UserForm from '@/components/forms/UserForm';
import { useRouter, useParams } from 'next/navigation';

function ProfilePage() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.userId;
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(!userId);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getSingleUser(userId);
        if (!userData) {
          throw new Error('User not found');
        }
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error.message);
      }
    };
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const handleSave = async (updatedUserData) => {
    try {
      if (userId) {
        // If userId exists, we're updating an existing user
        setUser(updatedUserData);
      } else {
        // If no userId, create a new user
        const newUser = await createUser(updatedUserData);
        router.push(`/profile/${newUser.id}`); // Redirect to new user's profile
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving user:', error.message);
      alert(error.message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        router.push('/users');
      } catch (error) {
        console.error('Error deleting user:', error.message);
        alert(error.message);
      }
    }
  };

  if (userId && !user && !isEditing) return <div>Loading...</div>;

  return (
    <div className="profile-page">
      <h1>{userId ? 'User Profile' : 'Network Admin Profile'}</h1>
      {isEditing || !userId ? (
        <UserForm user={user || {}} onSave={handleSave} />
      ) : (
        <>
          <div>
            <strong>Username:</strong> {user?.username}
          </div>
          <div>
            <strong>Email:</strong> {user?.email}
          </div>
          <div>
            <strong>Role:</strong> {user?.role}
          </div>
          <button type="button" onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
          <button type="button" onClick={handleDelete}>
            Delete User
          </button>
        </>
      )}
    </div>
  );
}

export default ProfilePage;
