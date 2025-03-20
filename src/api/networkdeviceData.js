// API CALLS FOR NETWORK-DEVICE RELATIONSHIPS

// Base endpoint for the API (adjust to match your Django backend URL)
const endpoint = 'http://localhost:8000/networkdevices';

// Helper function to get authentication headers (assuming token-based auth, e.g., JWT)
const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token'); // Adjust based on your auth setup
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// GET ALL NETWORK-DEVICE RELATIONSHIPS
const getNetworkDevices = () =>
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
      .then((data) => resolve(data)) // Returns array of network-device relationships
      .catch(reject);
  });

// GET SINGLE NETWORK-DEVICE RELATIONSHIP
const getSingleNetworkDevice = (networkDeviceId) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}${networkDeviceId}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('NetworkDevice not found');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => resolve(data))
      .catch(reject);
  });

// CREATE NETWORK-DEVICE RELATIONSHIP
const createNetworkDevice = (payload) =>
  new Promise((resolve, reject) => {
    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        network_id: payload.network_id, // Matches backend expectation
        device_id: payload.device_id, // Matches backend expectation
        status: payload.status || 'Pending', // Default to 'Pending' if not provided
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

// UPDATE NETWORK-DEVICE RELATIONSHIP
const updateNetworkDevice = (payload) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}${payload.id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        network_id: payload.network_id, // Optional, only sent if provided
        device_id: payload.device_id, // Optional, only sent if provided
        status: payload.status, // Optional, only sent if provided
      }),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('NetworkDevice not found');
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

// DELETE NETWORK-DEVICE RELATIONSHIP
const deleteNetworkDevice = (networkDeviceId) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}${networkDeviceId}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('NetworkDevice not found');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        resolve(); // No content expected (204)
      })
      .catch(reject);
  });

export { getNetworkDevices, getSingleNetworkDevice, createNetworkDevice, updateNetworkDevice, deleteNetworkDevice };
