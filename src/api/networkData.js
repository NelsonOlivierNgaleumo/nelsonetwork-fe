// // API CALLS FOR NETWORKS

// // Base endpoint for the API (adjust to match your Django backend URL)

const endpoint = 'http://localhost:8000/networks';

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token'); // Adjust based on your auth setup
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const getRequestOptions = (method, body) => ({
  method,
  headers: {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
  },
  body: body ? JSON.stringify(body) : undefined,
});

// GET ALL NETWORKS
const getNetworks = (userId) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}?user_id=${userId}`, getRequestOptions('GET'))
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data) => resolve(data))
      .catch(reject);
  });

// GET SINGLE NETWORK
const getSingleNetwork = (networkId) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/${networkId}/`, getRequestOptions('GET'))
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
    fetch(endpoint, getRequestOptions('POST', payload))
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
    fetch(`${endpoint}${payload.network_id}/`, getRequestOptions('PUT', payload))
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
    fetch(`${endpoint}${networkId}/`, getRequestOptions('DELETE'))
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
