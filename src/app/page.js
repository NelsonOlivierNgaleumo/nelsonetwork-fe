// src/app/page.js

'use client';

import { Button, Image } from 'react-bootstrap';
// import { signOut } from '@/utils/auth';
import { useAuth } from '@/utils/context/authContext';
import Link from 'next/link';

function Home() {
  const { user } = useAuth();

  return (
    <div
      className="text-center d-flex flex-column justify-content-between align-items-center"
      style={{
        height: '75vh',
        padding: '40px',
        maxWidth: '600px',
        margin: '0 auto',
        gap: '20px',
      }}
    >
      {/* Welcome Section */}
      <div className="flex-grow-1 d-flex flex-column justify-content-center">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Welcome, {user.displayName}!!!</h1>
        <p style={{ fontSize: '1.5rem', margin: '0' }}>To </p>
      </div>

      {/* Logo Section */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <Image
          src="/images/Logo.jpg"
          alt="Nelsonetwork Logo"
          style={{
            height: '350px',
            display: 'block',
            margin: '0 auto',
          }}
        />
      </div>

      {/* Navigation Section */}
      <div className="w-100">
        <h3 style={{ fontSize: '1.8rem', marginBottom: '15px' }}>SELECT A CATEGORY</h3>
        <Link href="/networks" className="d-block w-100 mb-2 text-decoration-none">
          <Button className="w-100" style={{ padding: '10px' }}>
            NETWORKS
          </Button>
        </Link>
        <Link href="/devices" className="d-block w-100 mb-2 text-decoration-none">
          <Button className="w-100" style={{ padding: '10px' }}>
            DEVICES
          </Button>
        </Link>
        <Link href="/documentations" className="d-block w-100 mb-2 text-decoration-none">
          <Button className="w-100" style={{ padding: '10px' }}>
            DOCUMENTATIONS
          </Button>
        </Link>
      </div>

      {/* Sign Out Section
      <div>
        <p style={{ fontSize: '1.2rem', marginBottom: '15px' }}>
          Click the button below to logout!
        </p>
        <Button
          variant="danger"
          type="button"
          size="lg"
          className="copy-btn"
          onClick={signOut}
          style={{ padding: '10px 20px' }}
        >
          Sign Out
        </Button>
      </div> */}
    </div>
  );
}

export default Home;
