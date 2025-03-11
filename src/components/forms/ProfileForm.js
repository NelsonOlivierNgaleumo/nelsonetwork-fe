import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUser } from '@/api/userData';
import { Form, Button } from 'react-bootstrap';

export default function UserForm() {
  const [formInput, setFormInput] = useState({
    username: '',
    password: '',
    email: '',
    role: '',
  });
  const router = useRouter();

  const handleChange = (e) => {
    setFormInput((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createUser(formInput).then(() => {
      router.push('/profile/new'); // Redirect after successful submission
    });
  };

  return (
    <div className="flex flex-row justify-center">
      <Form onSubmit={handleSubmit} className="w-75 mt-3">
        {/* Username */}
        <Form.Group className="mb-3" controlId="formUsername">
          <Form.Label>Username:</Form.Label>
          <Form.Control type="text" name="username" value={formInput.username} placeholder="Enter Username" onChange={handleChange} required />
        </Form.Group>

        {/* Email */}
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email:</Form.Label>
          <Form.Control type="email" name="email" value={formInput.email} placeholder="Enter Email" onChange={handleChange} required />
        </Form.Group>

        {/* Password */}
        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Password:</Form.Label>
          <Form.Control type="password" name="password" value={formInput.password} placeholder="Enter Password" onChange={handleChange} required />
        </Form.Group>

        {/* Role */}
        <Form.Group className="mb-3" controlId="formRole">
          <Form.Label>Role:</Form.Label>
          <Form.Control type="text" name="role" value={formInput.role} placeholder="Enter Role" onChange={handleChange} required />
        </Form.Group>

        <Button type="submit">Submit</Button>
      </Form>
    </div>
  );
}
