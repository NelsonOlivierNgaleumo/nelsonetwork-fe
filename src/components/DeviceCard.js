/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { deleteDevice } from '@/api/deviceData';

function DeviceCard({ deviceObj, onUpdate }) {
  const deleteThisDevice = () => {
    if (window.confirm(`Delete ${deviceObj.device_name}?`)) {
      deleteDevice(deviceObj.device_id).then(() => onUpdate());
    }
  };

  return (
    <div className="w-80 m-3">
      <Card className="text-center border-none rounded-xl bg-white shadow-lg">
        <Card.Header className="font-semibold">{deviceObj.device_name}</Card.Header>
        <Card.Body>
          {deviceObj.location && (
            <Card.Text className="text-left">
              <FontAwesomeIcon icon={faLocationDot} /> {deviceObj.location}
            </Card.Text>
          )}
          <Card.Text className="text-left">Type: {deviceObj.device_type}</Card.Text>
          <Card.Text className="text-left">IP: {deviceObj.device_ip}</Card.Text>
          <Card.Text className="text-left">Serial: {deviceObj.serial_number}</Card.Text>
          <Card.Text className="text-left">Last Update: {deviceObj.last_software_update}</Card.Text>
        </Card.Body>
        <Card.Footer className="text-muted">
          <div className="flex flex-row gap-4">
            <Button className="w-1/2" style={{ backgroundColor: 'var(--secondary-color)', color: '#FFFFFF' }} variant="contained">
              <Link href={`/device/${deviceObj.device_id}`} passHref>
                View Device Details
              </Link>
            </Button>
          </div>
          <div className="flex flex-row justify-end">
            <OverlayTrigger placement="bottom" overlay={<Tooltip>Edit</Tooltip>}>
              <Link href={`/device/edit/${deviceObj.device_id}`} passHref>
                <button type="button" aria-label="Edit device">
                  <FontAwesomeIcon className="m-2 fa-2x" icon={faPenToSquare} />
                </button>
              </Link>
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>Delete</Tooltip>}>
              <button type="button" aria-label="Delete device" onClick={deleteThisDevice}>
                <FontAwesomeIcon className="m-2 fa-2x" icon={faTrashCan} />
              </button>
            </OverlayTrigger>
          </div>
        </Card.Footer>
      </Card>
    </div>
  );
}

DeviceCard.propTypes = {
  deviceObj: PropTypes.shape({
    device_id: PropTypes.number.isRequired,
    device_name: PropTypes.string,
    device_image: PropTypes.string,
    age_of_device: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    device_ip: PropTypes.string,
    device_type: PropTypes.string,
    device_description: PropTypes.string,
    serial_number: PropTypes.string,
    mac_address: PropTypes.string,
    location: PropTypes.string,
    last_software_update: PropTypes.string,
    user: PropTypes.oneOfType([
      PropTypes.shape({
        id: PropTypes.number,
        username: PropTypes.string,
      }),
      PropTypes.number,
    ]),
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default DeviceCard;
