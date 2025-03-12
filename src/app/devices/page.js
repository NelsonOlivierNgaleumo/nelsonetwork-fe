'use client';

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import Link from 'next/link';
import { getDevices } from '@/api/deviceData'; // Client-side API for fetching devices
import DeviceCard from '@/components/DeviceCard'; // Import DeviceCard from its own file
import { useAuth } from '../../utils/context/authContext';

export default function DevicesPage() {
  // Set a state variable for devices
  const [devices, setDevices] = useState([]);
  // Get User ID using useAuth Hook
  const { user } = useAuth([]);

  // Fetch all networks on mount, this function makes the API call to get all the Devices
  const fetchDevices = () => {
    getDevices(user.user_id).then(setDevices);
  };

  // Make the call to the API to get all the devices on component render

  useEffect(() => {
    fetchDevices();
  }, []);

  // Handler to update the device list after deletion
  const handleUpdate = () => {
    fetchDevices(); // Refresh the list
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
