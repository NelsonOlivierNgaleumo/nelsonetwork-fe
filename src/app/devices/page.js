'use client';

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import Link from 'next/link';
import DeviceCard from '@/components/DeviceCard';
import { useAuth } from '../../utils/context/authContext';

export default function DevicesPage() {
  const [devices, setDevices] = useState([]);
  const { user } = useAuth([]);
  const endpoint = 'http://localhost:8000/devices';

  const getAuthHeaders = () => {
    const token = localStorage.getItem('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const getDevices = (userId) =>
    new Promise((resolve, reject) => {
      fetch(`${endpoint}?user_id=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      })
        .then((response) => {
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          return response.json();
        })
        .then((data) => resolve(data))
        .catch(reject);
    });

  const fetchDevices = () => {
    getDevices(user.user_id)
      .then(setDevices)
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleUpdate = () => {
    fetchDevices();
  };

  return (
    <div className="container mx-auto p-4">
      <Link href="/device/new" passHref>
        <Button>Add A Device</Button>
      </Link>
      <h1 className="text-3xl font-bold mb-4">Devices</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{devices.length > 0 ? devices.map((device) => <DeviceCard key={device.device_id} deviceObj={device} onUpdate={handleUpdate} />) : <p>No devices available.</p>}</div>
    </div>
  );
}
