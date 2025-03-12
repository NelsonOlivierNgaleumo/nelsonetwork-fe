// src/components/forms/DeviceForm.js
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

'use client';

import { Form, Button } from 'react-bootstrap';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { useAuth } from '@/utils/context/authContext';
import { getUsers } from '@/api/userData';
import { createDevice, updateDevice } from '@/api/deviceData';

const initialState = {
  device_name: '',
  device_image: '',
  age_of_device: '',
  device_ip: '',
  device_type: '',
  device_description: '',
  serial_number: '',
  mac_address: '',
  location: '',
  user_id: '',
  last_software_update: '',
};

export default function DeviceForm({ obj = initialState }) {
  const [formInput, setFormInput] = useState({
    ...initialState,
    ...obj,
  });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('Fetching users...'); // Debug
    getUsers()
      .then((data) => {
        console.log('Users fetched:', data); // Debug
        setUsers(data);
        // Preselect current user if no user_id set and user exists
        if (!formInput.user_id && user && data.length > 0) {
          const currentUser = data.find((u) => u.email === user.email);
          if (currentUser) {
            setFormInput((prev) => ({ ...prev, user_id: currentUser.id }));
          }
        }
      })
      .catch((err) => {
        console.error('Failed to fetch users:', err);
        setError('Could not load users. Please try again.');
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formInput.user_id) {
      setError('Please select a user.');
      return;
    }

    try {
      const payload = {
        ...formInput,
        user_id: Number(formInput.user_id), // Ensure number
      };

      if (obj.device_id) {
        await updateDevice({ ...payload, device_id: obj.device_id });
      } else {
        await createDevice(payload);
      }

      router.push('/devices');
    } catch (err) {
      console.error('Error submitting device:', err);
      setError(err.message || 'Failed to submit device. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      background: {
        default: '#000000',
        paper: '#1a1a1a',
      },
      text: {
        primary: '#ffffff',
      },
    },
  });

  return (
    <div className="flex flex-row justify-center">
      <ThemeProvider theme={darkTheme}>
        <Form className="w-75 mt-3" onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <Form.Group className="mb-3" controlId="formDeviceName">
            <Form.Label>Device Name</Form.Label>
            <Form.Control name="device_name" type="text" maxLength={100} placeholder="Enter device name" value={formInput.device_name || ''} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDeviceImage">
            <Form.Label>Device Image URL</Form.Label>
            <Form.Control name="device_image" type="url" placeholder="Enter image URL" value={formInput.device_image || ''} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formAgeOfDevice">
            <Form.Label>Age of Device</Form.Label>
            <Form.Control name="age_of_device" type="text" maxLength={50} placeholder="e.g., 2 years" value={formInput.age_of_device || ''} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDeviceIp">
            <Form.Label>Device IP Address</Form.Label>
            <Form.Control name="device_ip" type="text" placeholder="e.g., 192.168.1.1" value={formInput.device_ip || ''} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDeviceType">
            <Form.Label>Device Type</Form.Label>
            <Form.Control name="device_type" type="text" maxLength={50} placeholder="e.g., Router" value={formInput.device_type || ''} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDeviceDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control name="device_description" type="text" maxLength={200} placeholder="Enter description" value={formInput.device_description || ''} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formSerialNumber">
            <Form.Label>Serial Number</Form.Label>
            <Form.Control name="serial_number" type="text" maxLength={100} placeholder="Enter serial number" value={formInput.serial_number || ''} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formMacAddress">
            <Form.Label>MAC Address</Form.Label>
            <Form.Control name="mac_address" type="text" maxLength={100} placeholder="e.g., 00:1A:2B:3C:4D:5E" value={formInput.mac_address || ''} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formLocation">
            <Form.Label>Location</Form.Label>
            <Form.Control name="location" type="text" maxLength={100} placeholder="Enter location" value={formInput.location || ''} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formUser">
            <Form.Label>User</Form.Label>
            <Form.Select name="user_id" value={formInput.user_id || ''} onChange={handleChange} required>
              <option value="">Select User...</option>
              {users.map((userOption) => (
                <option key={userOption.id} value={userOption.id}>
                  {userOption.username || userOption.email}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formLastSoftwareUpdate">
            <Form.Label>Last Software Update</Form.Label>
            <Form.Control name="last_software_update" type="text" maxLength={50} placeholder="e.g., 2023-10-15" value={formInput.last_software_update || ''} onChange={handleChange} required />
          </Form.Group>

          <div className="text-center">
            <Button variant="primary" type="submit" className="w-25 mt-2 mb-4">
              {obj.device_id ? 'Update' : 'Create'} Device
            </Button>
            <Button variant="secondary" className="w-25 mt-2 mb-4 ms-3" onClick={() => router.push('/devices')}>
              Cancel
            </Button>
          </div>
        </Form>
      </ThemeProvider>
    </div>
  );
}

DeviceForm.propTypes = {
  obj: PropTypes.shape({
    device_id: PropTypes.number,
    device_name: PropTypes.string,
    device_image: PropTypes.string,
    age_of_device: PropTypes.string,
    device_ip: PropTypes.string,
    device_type: PropTypes.string,
    device_description: PropTypes.string,
    serial_number: PropTypes.string,
    mac_address: PropTypes.string,
    location: PropTypes.string,
    user_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    last_software_update: PropTypes.string,
  }),
};

DeviceForm.defaultProps = {
  obj: initialState,
};
