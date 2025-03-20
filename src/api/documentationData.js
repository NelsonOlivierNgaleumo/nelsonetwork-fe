// src/api/documentationData.js

// Base endpoint for the API (adjust to match your Django backend URL)
const endpoint = 'http://localhost:8000/documentations';

// Helper function to get authentication headers (assuming token-based auth, e.g., JWT)
const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token'); // Adjust based on your auth setup
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// GET ALL DOCUMENTATION ENTRIES
const getDocumentations = () =>
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
      .then((data) => resolve(data)) // Returns array of documentation entries
      .catch(reject);
  });

// GET SINGLE DOCUMENTATION ENTRY
const getSingleDocumentation = (documentationId) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}${documentationId}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Documentation not found');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => resolve(data))
      .catch(reject);
  });

// CREATE DOCUMENTATION ENTRY
const createDocumentation = (payload) =>
  new Promise((resolve, reject) => {
    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        device_id: payload.device_id, // Foreign key to Device
        device_type: payload.device_type,
        configuration: payload.configuration,
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

// UPDATE DOCUMENTATION ENTRY
const updateDocumentation = (payload) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}${payload.id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        device_id: payload.device_id, // Foreign key to Device
        device_type: payload.device_type,
        configuration: payload.configuration,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Documentation not found');
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

// DELETE DOCUMENTATION ENTRY
const deleteDocumentation = (documentationId) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}${documentationId}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Documentation not found');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        resolve(); // No content expected (204)
      })
      .catch(reject);
  });

export { getDocumentations, getSingleDocumentation, createDocumentation, updateDocumentation, deleteDocumentation };
