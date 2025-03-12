'use client';

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import Link from 'next/link';
import { getDocumentations } from '@/api/documentationData'; // Client-side API for fetching documentations
import DocumentationCard from '@/components/DocumentationCard'; // Import DocumentationCard from its own file
import { useAuth } from '../../utils/context/authContext';

export default function DocumentationsPage() {
  // Set a state variable for Documentations
  const [documentations, setDocumentations] = useState([]);
  // Get User ID using useAuth Hook
  const { user } = useAuth([]);

  // Fetch all networks on mount, this function makes the API call to get all the Documentations
  const fetchDocumentations = () => {
    getDocumentations(user.user_id).then(setDocumentations);
  };

  // Make the call to the API to get all the Documentations on component render

  useEffect(() => {
    fetchDocumentations();
  }, []);

  // Handler to update the Documentations list after deletion
  const handleUpdate = () => {
    fetchDocumentations(); // Refresh the list
  };

  return (
    <div className="container mx-auto p-4">
      <Link href="/documentations/new" passHref>
        <Button>Add Documentation</Button>
      </Link>
      <h1 className="text-3xl font-bold mb-4">Documentations</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{documentations.length > 0 ? documentations.map((documentation) => <DocumentationCard key={documentation.documentation_id} documentationObj={documentation} onUpdate={handleUpdate} />) : <p>No Documentations available.</p>}</div>
    </div>
  );
}
