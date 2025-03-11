// src/components/DocumentationForm.js
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

'use client';

import { Form, Button } from 'react-bootstrap';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { useAuth } from '@/utils/context/authContext';
import { getDevices } from '@/api/deviceData';
import { createDocumentation, updateDocumentation } from '@/api/documentationData';

const initialState = {
  device_id: '',
  device_type: '',
  configuration: '',
};

export default function DocumentationForm({ obj = initialState }) {
  const [formInput, setFormInput] = useState({
    ...initialState,
    ...obj,
  });
  const [devices, setDevices] = useState([]);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  // Fetch devices on mount
  useEffect(() => {
    getDevices()
      .then((data) => setDevices(data))
      .catch((err) => console.error('Failed to fetch devices:', err));
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const payload = {
        ...formInput,
        device_id: Number(formInput.device_id), // Convert to number for API
      };

      if (obj.id) {
        // Update existing documentation
        await updateDocumentation({
          ...payload,
          id: obj.id,
        });
      } else {
        // Create new documentation
        await createDocumentation(payload);
      }

      router.push('/documentations');
    } catch (err) {
      console.error('Error submitting documentation:', err);
      setError(err.message || 'Failed to submit documentation. Please try again.');
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

          {/* DEVICE SELECTOR */}
          <Form.Group className="mb-3" controlId="formDevice">
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

          {/* DEVICE TYPE INPUT */}
          <Form.Group className="mb-3" controlId="formDeviceType">
            <Form.Label>Device Type</Form.Label>
            <Form.Control name="device_type" type="text" maxLength={50} placeholder="Enter device type (e.g., Router)" value={formInput.device_type || ''} onChange={handleChange} required />
          </Form.Group>

          {/* CONFIGURATION INPUT */}
          <Form.Group className="mb-3" controlId="formConfiguration">
            <Form.Label>Configuration</Form.Label>
            <Form.Control as="textarea" rows={5} name="configuration" placeholder="Enter configuration details" value={formInput.configuration || ''} onChange={handleChange} required />
          </Form.Group>

          {/* SUBMIT BUTTON */}
          <div className="text-center">
            <Button variant="primary" type="submit" className="w-25 mt-2 mb-4">
              {obj.id ? 'Update' : 'Create'} Documentation
            </Button>
            <Button variant="secondary" className="w-25 mt-2 mb-4 ms-3" onClick={() => router.push('/documentations')}>
              Cancel
            </Button>
          </div>
        </Form>
      </ThemeProvider>
    </div>
  );
}

DocumentationForm.propTypes = {
  obj: PropTypes.shape({
    id: PropTypes.number,
    device_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    device_type: PropTypes.string,
    configuration: PropTypes.string,
  }),
};

DocumentationForm.defaultProps = {
  obj: initialState,
};
