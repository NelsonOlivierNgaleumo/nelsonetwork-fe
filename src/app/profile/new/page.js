'use client';

import { useState } from 'react';
import { createUser } from '@/api/userData';
import { useAuth } from '@/utils/context/authContext';
import { useRouter } from 'next/navigation';

export default function NewProfilePage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ username: '', role: '' });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      username: formData.username,
      email: user.email,
      password: 'temp-password', // Replace with secure logic if needed
      role: formData.role,
    };
    try {
      const newUser = await createUser(payload);
      localStorage.setItem('djangoUserId', newUser.id); // Store Django ID
      router.push('/profile');
    } catch (error) {
      console.error('Error creating user:', error.message);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '30px' }}>
      <h1>Create Your Profile</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
        <input type="text" placeholder="E-mail" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
        <input type="text" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
        <input type="text" placeholder="Role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} />
        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
}
