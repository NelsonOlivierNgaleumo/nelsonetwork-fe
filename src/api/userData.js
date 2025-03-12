// API CALLS FOR USERS

// Base endpoint for the API (adjust to match your Django backend URL)
const endpoint = 'http://localhost:8000/api/users/';

// Helper function to get authentication headers (assuming token-based auth, e.g., JWT)
const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token'); // Adjust based on your auth setup
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// GET ALL USERS
const getUsers = () =>
  new Promise((resolve) => {
    // No reject, always resolve
    fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    })
      .then((response) => {
        if (!response.ok) {
          console.error(`HTTP error! status: ${response.status}`);
          return []; // Resolve empty array on error
        }
        return response.json();
      })
      .then((data) => resolve(data || [])) // Ensure array
      .catch((error) => {
        console.error('Fetch error:', error.message);
        resolve([]); // Resolve empty array on network error
      });
  });

// Ensure getSingleUser also handles 404 gracefully (for other components)
const getSingleUser = (userId) =>
  new Promise((resolve) => {
    fetch(`${endpoint}${userId}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) return null;
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => resolve(data))
      .catch((error) => {
        console.error('Fetch error:', error.message);
        resolve(null); // Resolve null on error
      });
  });

// Optional softer approach (uncomment to use instead):

// .then((response) => {
//   if (!response.ok) {
//     if (response.status === 404) {
//       return resolve(null); // No rejection, returns null for not found
//     }
//     throw new Error(`HTTP error! status: ${response.status}`);
//   }
//   return response.json();
// })
// .then(resolve)
// .catch((error) => resolve({ error: error.message }));

// CREATE USER
const createUser = (payload) =>
  new Promise((resolve, reject) => {
    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        username: payload.username,
        email: payload.email,
        password: payload.password, // Password will be hashed by backend
        role: payload.role,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 400) {
            return response.json().then((errorData) => {
              throw new Error(errorData.message || JSON.stringify(errorData));
            });
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => resolve(data))
      .catch(reject);
  });

// UPDATE USER
const updateUser = (payload) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}${payload.id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        username: payload.username,
        email: payload.email,
        password: payload.password, // Optional, hashed by backend if provided
        role: payload.role,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('The requested user was not found'); // Matches backend
          } else if (response.status === 400) {
            return response.json().then((errorData) => {
              throw new Error(errorData.message || JSON.stringify(errorData));
            });
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => resolve(data))
      .catch(reject);
  });

// DELETE USER
const deleteUser = (userId) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}${userId}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('The requested user was not found'); // Matches backend
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        resolve(); // No content expected (204), but backend returns a message
      })
      .catch(reject);
  });

export { getUsers, getSingleUser, createUser, updateUser, deleteUser };
