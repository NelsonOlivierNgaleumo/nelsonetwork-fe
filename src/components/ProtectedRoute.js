import React, { useState, useEffect } from 'react';
import UserProfileCheck from '@/utils/hooks/userProfileCheck';
import { useRouter } from 'next/navigation';
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

export default function ProtectedRoute({ children }) {
  const isProfileComplete = UserProfileCheck();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // If user profile is confirmed to be incomplete, show the modal
    if (isProfileComplete === false) {
      setShowModal(true);
    }
  }, [isProfileComplete]);

  const handleRedirect = () => {
    setShowModal(false); // Close the modal
    router.push('/profile/new'); // Redirect to the profile form on Create Profile Page
  };

  // If profile completeness is still being checked, don't render anything yet
  if (isProfileComplete === null) return null;

  if (!isProfileComplete) {
    return (
      //  show and onHide are props that will be passed to the modal component. show prop: controls whether modal is visible or not. onHide prop: defines what happens when the modal is dismissed.
      // showModal will be set to true if the user profile is not complete. the modal will be displayed if the user profile is not complete. the user will be redirected to the profile form page if they click the button in the modal.
      <Modal show={showModal} onHide={handleRedirect} style={{ backgroundColor: '#f8f9fa', color: '#000' }}>
        <Modal.Header closeButton>
          <Modal.Title>Profile Incomplete</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#f8f9fa', color: '#000' }}>Please fill out the profile form first.</Modal.Body>
        <Modal.Footer style={{ backgroundColor: '#f8f9fa', color: '#000' }}>
          <Button variant="primary" onClick={handleRedirect}>
            Go to Profile Form
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
  return <> {children} </>;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
