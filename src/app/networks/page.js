'use client';

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import Link from 'next/link';
import { getNetworks } from '@/api/networkData';
import NetworkCard from '@/components/NetworkCard';
import { useAuth } from '../../utils/context/authContext';

export default function NetworksPage() {
  const [networks, setNetworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchNetworks = async () => {
    if (!user || !user.user_id) {
      console.warn('User ID is undefined:', user);
      return; // Ensure user is defined before making API call
    }
    try {
      setLoading(true);
      setError(null);
      const data = await getNetworks(user.user_id);
      console.log('Fetched Networks:', data);
      setNetworks(data);
    } catch (err) {
      console.error('Error fetching networks:', err);
      setError('Failed to load networks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchNetworks();
  }, [user]); // Re-run when user changes

  return (
    <div className="container mx-auto p-4">
      <Link href="/network/new" passHref>
        <Button>Add A Network</Button>
      </Link>
      <h1 className="text-3xl font-bold mb-4">Networks</h1>

      {loading && <p>Loading networks...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && networks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {networks.map((network) => (
            <NetworkCard key={network.network_id} networkObj={network} onUpdate={fetchNetworks} />
          ))}
        </div>
      ) : (
        !loading && !error && <p>No networks available.</p>
      )}
    </div>
  );
}
