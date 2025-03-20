/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { deleteNetwork } from '@/api/networkData';
import { createNetworkDevice } from '@/api/networkdeviceData';

export default function NetworkCard({ networkObj, onUpdate }) {
  const [successMessage, setSuccessMessage] = useState('');

  const deleteThisNetwork = () => {
    if (window.confirm(`Delete ${networkObj.network_name}?`)) {
      deleteNetwork(networkObj.network_id)
        .then(() => onUpdate())
        .catch((err) => console.error('Error deleting network:', err));
    }
  };

  const linkToDevice = () => {
    const payload = {
      network_id: networkObj.network_id,
      device_id: networkObj.device_id,
      status: 'Active',
    };
    createNetworkDevice(payload)
      .then(() => {
        setSuccessMessage('Network linked to device!');
        setTimeout(() => setSuccessMessage(''), 3000);
      })
      .catch((err) => {
        console.error('Error linking network to device:', err);
        setSuccessMessage('Failed to link network.');
      });
  };

  const getDeviceName = (device, deviceId) => {
    if (device) {
      if (typeof device === 'object') {
        return device.device_name || 'Unnamed Device';
      }
      return device;
    }
    return deviceId || 'Not Linked';
  };

  return (
    <div className="w-80 m-3">
      <Card className="text-center border-none rounded-xl bg-white shadow-lg">
        <Card.Header className="font-semibold">{networkObj.network_name || 'Unnamed Network'}</Card.Header>
        <Card.Body>
          {networkObj.location && (
            <Card.Text className="text-left hover:text-blue-500 transition-colors duration-300">
              <FontAwesomeIcon icon={faLocationDot} /> {networkObj.location}
            </Card.Text>
          )}
          <Card.Text className="text-left">Type: {networkObj.network_type || 'N/A'}</Card.Text>
          <Card.Text className="text-left">Staff: {networkObj.number_of_staff || 'N/A'}</Card.Text>
          <Card.Text className="text-left">IP: {networkObj.network_ip_address || 'N/A'}</Card.Text>
          <Card.Text className="text-left">Device: {getDeviceName(networkObj.device, networkObj.device_id)}</Card.Text>
          {successMessage && <p className={`text-${successMessage.includes('Failed') ? 'red' : 'green'}-500 mt-2`}>{successMessage}</p>}
        </Card.Body>
        <Card.Footer className="text-muted">
          <div className="flex flex-row gap-4">
            <Button className="w-1/2" style={{ backgroundColor: 'var(--secondary-color)', color: '#FFFFFF' }} variant="contained">
              <Link href={`/network/${networkObj.network_id}`} passHref>
                View Network Details
              </Link>
            </Button>
            <Button className="w-1/2" onClick={linkToDevice} style={{ backgroundColor: 'var(--secondary-color)', color: '#FFFFFF' }} variant="contained">
              Link to Device
            </Button>
          </div>
          <div className="flex flex-row justify-end">
            <OverlayTrigger placement="bottom" overlay={<Tooltip>Edit</Tooltip>}>
              <Link href={`/network/edit/${networkObj.network_id}`} passHref>
                <button type="button" aria-label="Edit network">
                  <FontAwesomeIcon className="m-2 fa-2x" icon={faPenToSquare} />
                </button>
              </Link>
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>Delete</Tooltip>}>
              <button type="button" aria-label="Delete network" onClick={deleteThisNetwork}>
                <FontAwesomeIcon className="m-2 fa-2x" icon={faTrashCan} />
              </button>
            </OverlayTrigger>
          </div>
        </Card.Footer>
      </Card>
    </div>
  );
}

NetworkCard.propTypes = {
  networkObj: PropTypes.shape({
    network_id: PropTypes.number.isRequired,
    network_name: PropTypes.string,
    network_type: PropTypes.string,
    number_of_staff: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    setup_recommendation: PropTypes.string,
    network_ip_address: PropTypes.string,
    user: PropTypes.oneOfType([
      PropTypes.shape({
        id: PropTypes.number,
        username: PropTypes.string,
        email: PropTypes.string,
      }),
      PropTypes.number,
    ]),
    location: PropTypes.string,
    device: PropTypes.oneOfType([
      PropTypes.shape({
        device_id: PropTypes.number,
        device_name: PropTypes.string,
      }),
      PropTypes.number,
    ]),
    device_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};
