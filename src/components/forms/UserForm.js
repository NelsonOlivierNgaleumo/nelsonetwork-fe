import React, { useState } from 'react';
import { createUser, updateUser } from '@/api/userData';

// eslint-disable-next-line react/prop-types
function UserForm({ user = {}, onSave = () => {} }) {
  const [formData, setFormData] = useState({
    username: user.username || '',
    email: user.email || '',
    password: '',
    role: user.role || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (user.id) {
        response = await updateUser({ ...formData, id: user.id });
      } else {
        response = await createUser(formData);
      }
      onSave(response);
    } catch (error) {
      console.error('Error saving user:', error.message);
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <div>
        <label htmlFor="username">Username:</label>
        <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required={!user.id} />
      </div>
      <div>
        <label htmlFor="role">Role:</label>
        <input type="text" id="role" name="role" value={formData.role} onChange={handleChange} required />
      </div>
      <button type="submit">{user.id ? 'Update' : 'Create'} User</button>
    </form>
  );
}

export default UserForm;
