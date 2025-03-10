// API CALLS FOR NETWORKS

// Base endpoint for the API (adjust to match your Django backend URL)
const endpoint = 'http://localhost:8000/api/networks/';

// Helper function to get authentication headers (assuming token-based auth, e.g., JWT)
const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token'); // Adjust based on your auth setup
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// GET ALL NETWORKS
const getNetworks = () =>
  new Promise((resolve, reject) => {
    fetch(endpoint, {
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
      .then((data) => resolve(data)) // Returns array of networks
      .catch(reject);
  });

// GET SINGLE NETWORK
const getSingleNetwork = (networkId) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}${networkId}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Network not found');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => resolve(data))
      .catch(reject);
  });

// CREATE NETWORK
const createNetwork = (payload) =>
  new Promise((resolve, reject) => {
    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        network_name: payload.network_name,
        network_type: payload.network_type,
        number_of_staff: payload.number_of_staff,
        setup_recommendation: payload.setup_recommendation,
        network_ip_address: payload.network_ip_address,
        user_id: payload.user_id, // Matches backend expectation
        location: payload.location,
        device_id: payload.device_id, // Matches backend expectation
      }),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 400) {
            return response.json().then((errorData) => {
              throw new Error(errorData.message || 'Invalid data provided');
            });
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => resolve(data))
      .catch(reject);
  });

// UPDATE NETWORK
const updateNetwork = (payload) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}${payload.network_id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        network_name: payload.network_name,
        network_type: payload.network_type,
        number_of_staff: payload.number_of_staff,
        setup_recommendation: payload.setup_recommendation,
        network_ip_address: payload.network_ip_address,
        user_id: payload.user_id, // Optional, only sent if provided
        location: payload.location,
        device_id: payload.device_id, // Optional, only sent if provided
      }),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Network not found');
          } else if (response.status === 400) {
            return response.json().then((errorData) => {
              throw new Error(errorData.message || 'Invalid data provided');
            });
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => resolve(data))
      .catch(reject);
  });

// DELETE NETWORK
const deleteNetwork = (networkId) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}${networkId}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Network not found');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        resolve(); // No content expected (204)
      })
      .catch(reject);
  });

export { getNetworks, getSingleNetwork, createNetwork, updateNetwork, deleteNetwork };
