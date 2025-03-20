'use client';

import { Form, Button } from 'react-bootstrap';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
// import { useAuth } from '@/utils/context/authContext';
import { getUsers } from '@/api/userData';
import { getDevices } from '@/api/deviceData';
import { createNetwork, updateNetwork } from '@/api/networkData';

const initialState = {
  network_name: '',
  network_type: '',
  number_of_staff: '',
  setup_recommendation: '',
  network_ip_address: '',
  user_id: '',
  location: '',
  device_id: '',
  network_id: null, // Ensure this property exists, even if null
};

export default function NetworkForm({ obj = initialState, onNetworkCreated }) {
  const [formInput, setFormInput] = useState({
    ...initialState,
    ...obj,
  });
  const [users, setUsers] = useState([]);
  const [devices, setDevices] = useState([]);
  const [error, setError] = useState(''); // State variable for error message
  // const { user } = useAuth();
  const router = useRouter();

  // Fetch users and devices on mount
  useEffect(() => {
    getUsers()
      .then((data) => setUsers(data))
      .catch((err) => console.error('Failed to fetch users:', err));

    getDevices()
      .then((data) => setDevices(data))
      .catch((err) => console.error('Failed to fetch devices:', err));
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      const payload = {
        ...formInput,
        number_of_staff: Number(formInput.number_of_staff),
        user_id: Number(formInput.user_id),
        device_id: Number(formInput.device_id),
      };

      // Ensure network_id exists when updating, else it's a new creation
      if (formInput?.network_id) {
        // Update existing network
        await updateNetwork({
          ...payload,
          network_id: formInput.network_id, // Using formInput directly here
        });
      } else {
        // Create new network
        await createNetwork(payload);
      }

      // Call the onNetworkCreated prop to refresh the network list after successful submission
      if (onNetworkCreated) {
        onNetworkCreated();
      }

      // Navigate back to the networks list page after creation or update
      router.push('/networks');
    } catch (err) {
      console.error('Error submitting network:', err);
      setError(err.message || 'Failed to submit network. Please try again.');
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      background: {
        default: '#000000',
        paper: '#1a1a1a',
      },
      text: {
        primary: '#ffffff',
      },
    },
  });

  return (
    <div className="flex flex-row justify-center">
      <ThemeProvider theme={darkTheme}>
        <Form className="w-75 mt-3" onSubmit={handleSubmit}>
          {/* ERROR MESSAGE */}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {/* NETWORK NAME INPUT */}
          <Form.Group className="mb-3" controlId="formNetworkName">
            <Form.Label>Network Name</Form.Label>
            <Form.Control name="network_name" type="text" maxLength={100} placeholder="Enter network name" value={formInput.network_name || ''} onChange={handleChange} required />
          </Form.Group>

          {/* NETWORK TYPE INPUT */}
          <Form.Group className="mb-3" controlId="formNetworkType">
            <Form.Label>Network Type</Form.Label>
            <Form.Control name="network_type" type="text" maxLength={50} placeholder="Enter network type" value={formInput.network_type || ''} onChange={handleChange} required />
          </Form.Group>

          {/* NUMBER OF STAFF INPUT */}
          <Form.Group className="mb-3" controlId="formNumberOfStaff">
            <Form.Label>Number of Staff</Form.Label>
            <Form.Control name="number_of_staff" type="number" min="0" placeholder="Enter number of staff" value={formInput.number_of_staff || ''} onChange={handleChange} required />
          </Form.Group>

          {/* SETUP RECOMMENDATION INPUT */}
          <Form.Group className="mb-3" controlId="formSetupRecommendation">
            <Form.Label>Setup Recommendation</Form.Label>
            <Form.Control name="setup_recommendation" type="text" maxLength={200} placeholder="Enter setup recommendation" value={formInput.setup_recommendation || ''} onChange={handleChange} required />
          </Form.Group>

          {/* NETWORK IP ADDRESS INPUT */}
          <Form.Group className="mb-3" controlId="formNetworkIpAddress">
            <Form.Label>Network IP Address</Form.Label>
            <Form.Control name="network_ip_address" type="text" placeholder="Enter IP address (e.g., 192.168.1.1)" value={formInput.network_ip_address || ''} onChange={handleChange} required />
          </Form.Group>

          {/* USER SELECTOR */}
          <Form.Group className="mb-3" controlId="formUser">
            <Form.Label>User</Form.Label>
            <Form.Select name="user_id" value={formInput.user_id || ''} onChange={handleChange} required>
              <option value="">Select User...</option>
              {users.map((userOption) => (
                <option key={userOption.id} value={userOption.id}>
                  {userOption.username || userOption.email}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* LOCATION INPUT */}
          <Form.Group className="mb-3" controlId="formLocation">
            <Form.Label>Location</Form.Label>
            <Form.Control name="location" type="text" maxLength={100} placeholder="Enter location" value={formInput.location || ''} onChange={handleChange} required />
          </Form.Group>

          {/* DEVICE SELECTOR */}
          <Form.Group className="mb-3" controlId="formDeviceId">
            <Form.Label>Device</Form.Label>
            <Form.Select name="device_id" value={formInput.device_id || ''} onChange={handleChange} required>
              <option value="">Select Device...</option>
              {devices.map((device) => (
                <option key={device.device_id} value={device.device_id}>
                  {device.device_name || device.device_id}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* SUBMIT BUTTON */}
          <div className="text-center">
            <Button variant="primary" type="submit" className="w-25 mt-2 mb-4">
              {formInput?.network_id ? 'Update' : 'Create'} Network
            </Button>
          </div>
        </Form>
      </ThemeProvider>
    </div>
  );
}

NetworkForm.propTypes = {
  obj: PropTypes.shape({
    network_id: PropTypes.number,
    network_name: PropTypes.string,
    network_type: PropTypes.string,
    number_of_staff: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    setup_recommendation: PropTypes.string,
    network_ip_address: PropTypes.string,
    user_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    location: PropTypes.string,
    device_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  onNetworkCreated: PropTypes.func, // Prop for refreshing the network list
};

NetworkForm.defaultProps = {
  obj: initialState,
};
