// src/components/DocumentationCard.js

'use client';

import { Card, Button } from 'react-bootstrap';
import Link from 'next/link';
import PropTypes from 'prop-types';

function DocumentationCard({ documentationObj }) {
  return (
    <Card bg="dark" text="white" className="h-full">
      <Card.Body>
        <Card.Title>{documentationObj.device?.device_name || 'Unknown Device'}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{documentationObj.device_type}</Card.Subtitle>
        <Card.Text>{documentationObj.configuration.substring(0, 100)}...</Card.Text>
        <Link href={`/documentations/${documentationObj.id}/edit`} passHref>
          <Button variant="warning" size="sm" className="me-2">
            Edit
          </Button>
        </Link>
        {/* Add delete button if needed */}
      </Card.Body>
    </Card>
  );
}

DocumentationCard.propTypes = {
  documentationObj: PropTypes.shape({
    id: PropTypes.number.isRequired,
    device: PropTypes.shape({
      device_name: PropTypes.string,
      user_id: PropTypes.number,
    }),
    device_type: PropTypes.string,
    configuration: PropTypes.string,
  }).isRequired,
  // onUpdate: PropTypes.func.isRequired,
};

export default DocumentationCard;
