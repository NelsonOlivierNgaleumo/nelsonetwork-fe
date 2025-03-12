// app/profile/page.js

'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/utils/context/authContext';
import UserProfileCheck from '@/utils/hooks/userProfileCheck'; // Adjust path
import ProtectedRoute from '@/components/ProtectedRoute';
import { Modal, Button } from 'react-bootstrap';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const isProfileComplete = UserProfileCheck(); // Use the component

  useEffect(() => {
    if (isProfileComplete === false) {
      setShowModal(true); // Show modal if profile incomplete
    } else if (isProfileComplete === true) {
      const idToCheck = localStorage.getItem('djangoUserId') || user.user_id;

      // /*fetching orile with id*/

      console.log('Fetching profile with ID:', idToCheck); // Debug
      if (!idToCheck || idToCheck === ':1') {
        // Prevent bad fetch
        setShowModal(true);
        return;
      }

      fetch(`http://localhost:8000/api/users/${idToCheck}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('auth_token') ? { Authorization: `Bearer ${localStorage.getItem('auth_token')}` } : {}),
        },
      })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 404) {
              setShowModal(true); // Handle 404 here too
              return null;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => setUserData(data))
        .catch((error) => {
          console.error('Error fetching user:', error.message);
          setShowModal(true);
        });
    }
  }, [isProfileComplete, user]);

  const handleRedirect = () => {
    setShowModal(false);
    router.push('/profile/new');
  };

  return (
    <ProtectedRoute>
      {showModal ? (
        <Modal show={showModal} onHide={handleRedirect} centered>
          <Modal.Header closeButton style={{ backgroundColor: '#f8f9fa', color: '#000' }}>
            <Modal.Title>Profile Setup Required</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: '#f8f9fa', color: '#000' }}>Please set up your profile to continue.</Modal.Body>
          <Modal.Footer style={{ backgroundColor: '#f8f9fa', color: '#000' }}>
            <Button variant="primary" onClick={handleRedirect}>
              Create Profile
            </Button>
          </Modal.Footer>
        </Modal>
      ) : (
        userData && (
          <div
            className="shadow-lg"
            style={{
              maxWidth: '600px',
              margin: 'auto',
              padding: '30px',
              borderRadius: '15px',
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
              backgroundColor: '#f9fafb',
              textAlign: 'center',
              marginTop: '60px',
            }}
          >
            <div>
              <h2 style={{ marginTop: '15px', color: '#333', fontSize: '24px', fontWeight: '600' }}>
                {userData.username} ({userData.role})
              </h2>
              <p style={{ fontSize: '16px', color: '#777', fontStyle: 'italic', marginTop: '8px' }}>{userData.role}</p>
              <p style={{ fontWeight: '600', color: '#007bff', fontSize: '16px', marginTop: '10px' }}>Email: {user.email}</p>
            </div>
          </div>
        )
      )}
      {userData && (
        <div style={{ padding: '20px', marginTop: '30px', maxWidth: '600px', margin: 'auto', textAlign: 'center' }}>
          <h3
            style={{
              color: '#fff',
              display: 'inline-block',
              paddingBottom: '8px',
              fontSize: '20px',
              fontWeight: '600',
              textDecoration: 'underline',
              marginTop: '50px',
            }}
          >
            Completed Tours
          </h3>
        </div>
      )}
    </ProtectedRoute>
  );
}
