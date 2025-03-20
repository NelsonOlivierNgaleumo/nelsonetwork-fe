// API CALLS FOR DEVICES

// Base endpoint for the API (adjust to match your Django backend URL)
const endpoint = 'http://localhost:8000/devices';

// Helper function to get authentication headers (assuming token-based auth, e.g., JWT)
const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token'); // Adjust based on your auth setup
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// GET ALL DEVICES
const getDevices = () =>
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
      .then((data) => resolve(data)) // Returns array of devices
      .catch(reject);
  });

// GET SINGLE DEVICE
const getSingleDevice = (deviceId) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}${deviceId}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Device not found');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => resolve(data))
      .catch(reject);
  });

// CREATE DEVICE
const createDevice = (payload) =>
  new Promise((resolve, reject) => {
    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        device_name: payload.device_name,
        device_image: payload.device_image,
        age_of_device: payload.age_of_device,
        device_ip: payload.device_ip,
        device_type: payload.device_type,
        device_description: payload.device_description,
        serial_number: payload.serial_number,
        mac_address: payload.mac_address,
        location: payload.location,
        user_id: payload.user_id, // Matches backend expectation
        last_software_update: payload.last_software_update,
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

// UPDATE DEVICE
const updateDevice = (payload) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}${payload.device_id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        device_name: payload.device_name,
        device_image: payload.device_image,
        age_of_device: payload.age_of_device,
        device_ip: payload.device_ip,
        device_type: payload.device_type,
        device_description: payload.device_description,
        serial_number: payload.serial_number,
        mac_address: payload.mac_address,
        location: payload.location,
        user_id: payload.user_id, // Optional, only sent if provided
        last_software_update: payload.last_software_update,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Device not found');
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

// DELETE DEVICE
const deleteDevice = (deviceId) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}${deviceId}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Device not found');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        resolve(); // No content expected (204)
      })
      .catch(reject);
  });

export { getDevices, getSingleDevice, createDevice, updateDevice, deleteDevice };
