import React from 'react';
import Image from 'next/image';
import { Button } from 'react-bootstrap';
import { signIn } from '../utils/auth';
import Logo from '../../public/images/Logo.jpg';

function Signin() {
  return (
    <div
      className="text-center d-flex flex-column justify-content-center align-content-center"
      style={{
        height: '90vh',
        padding: '50px',
        maxWidth: '400px',
        margin: '0 auto',
      }}
    >
      <Image src={Logo} alt="Logo" width={150} height={150} priority />
      <h1>Hi there!</h1>
      <p>Click this button to get started!</p>
      <Button type="button" size="lg" className="copy-btn" onClick={signIn}>
        Sign In
      </Button>
    </div>
  );
}

export default Signin;
