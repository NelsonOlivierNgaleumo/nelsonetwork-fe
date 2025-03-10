'use client';

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import Link from 'next/link';
import { getNetworks } from '@/api/networkData'; // Client-side API for fetching networks
import NetworkCard from '@/components/NetworkCard'; // Import NetworkCard from its own file
import { useAuth } from '../../utils/context/authContext';

export default function NetworksPage() {
  // Set a state variable for networks
  const [networks, setNetworks] = useState([]);
  // Get User ID using useAuth Hook
  const { user } = useAuth([]);

  // Fetch all networks on mount, this function makes the API call to get all the Networks
  const fetchNetworks = () => {
    getNetworks(user.user_id).then(setNetworks);
  };

  // Make the call to the API to get all the networks on component render

  useEffect(() => {
    fetchNetworks();
  }, []);

  // Handler to update the network list after deletion
  const handleUpdate = () => {
    fetchNetworks(); // Refresh the list
  };

  return (
    <div className="container mx-auto p-4">
      <Link href="/network/new" passHref>
        <Button>Add A Network</Button>
      </Link>
      <h1 className="text-3xl font-bold mb-4">Networks</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{networks.length > 0 ? networks.map((network) => <NetworkCard key={network.network_id} networkObj={network} onUpdate={handleUpdate} />) : <p>No networks available.</p>}</div>
    </div>
  );
}
