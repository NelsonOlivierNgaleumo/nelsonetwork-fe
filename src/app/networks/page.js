'use client';

import { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
// import { useRouter } from 'next/navigation';
import { getNetworks, deleteNetwork } from '@/api/networkData';
import NetworkForm from '@/components/forms/NetworkForm'; // Ensure you import the NetworkForm component

export default function NetworksPage() {
  const [networks, setNetworks] = useState([]);
  const [showForm, setShowForm] = useState(false); // Controls visibility of the NetworkForm
  const [selectedNetwork, setSelectedNetwork] = useState(null); // Holds the network to be edited
  // const router = useRouter();

  // Fetch all networks
  const fetchNetworks = async () => {
    try {
      const data = await getNetworks();
      setNetworks(data);
    } catch (error) {
      console.error('Error fetching networks:', error);
    }
  };

  // Trigger fetchNetworks when the page loads
  useEffect(() => {
    fetchNetworks();
  }, []);

  // Show form for creating a new network
  const handleCreateNewNetwork = () => {
    setSelectedNetwork(null); // Clear the selected network (for new network)
    setShowForm(true);
  };

  // Show form for editing an existing network
  const handleEditNetwork = (network) => {
    setSelectedNetwork(network); // Set the network to edit
    setShowForm(true); // Show the form
  };

  // Handle network creation or update
  const handleNetworkCreated = () => {
    fetchNetworks(); // Refresh the network list
    setShowForm(false); // Hide the form after creation or update
  };

  // Handle network deletion
  const handleDeleteNetwork = async (networkId) => {
    try {
      await deleteNetwork(networkId); // Call delete network API
      fetchNetworks(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting network:', error);
    }
  };

  return (
    <div className="container">
      <h1 className="text-center my-4">Networks</h1>

      {/* Show the NetworkForm if showForm is true */}
      {showForm && <NetworkForm obj={selectedNetwork} onNetworkCreated={handleNetworkCreated} />}

      {/* Display network list */}
      {!showForm && (
        <div>
          <Button variant="primary" className="mb-3" onClick={handleCreateNewNetwork}>
            Create New Network
          </Button>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Network Name</th>
                <th>Network Type</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {networks.map((network) => (
                <tr key={network.network_id}>
                  <td>{network.network_name}</td>
                  <td>{network.network_type}</td>
                  <td>{network.location}</td>
                  <td>
                    <Button variant="warning" size="sm" onClick={() => handleEditNetwork(network)}>
                      Edit
                    </Button>{' '}
                    <Button variant="danger" size="sm" onClick={() => handleDeleteNetwork(network.network_id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
}
