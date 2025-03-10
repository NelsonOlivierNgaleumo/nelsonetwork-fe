/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Link from 'next/link';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import Image from 'next/image';
import { signOut } from '../utils/auth';

export default function NavBar() {
  return (
    <Navbar className="bg-var(--background-color)" collapseOnSelect expand="lg" variant="dark">
      <Container>
        <Image alt="" src="/images/Logo.jpg" width="30" height="30" className="d-inline-block align-top rounded-xl" />
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            {/* CLOSE NAVBAR ON LINK SELECTION: https://stackoverflow.com/questions/72813635/collapse-on-select-react-bootstrap-navbar-with-nextjs-not-working */}
            <Link className="nav-link" href="/">
              Home/Dashboard
            </Link>
            <Link className="nav-link" href="/networks">
              Networks
            </Link>
            <Link className="nav-link" href="/devices">
              Devices
            </Link>
            <Link className="nav-link" href="/documentations">
              Documentations
            </Link>
            <Link className="nav-link" href="/profile">
              Profile
            </Link>
          </Nav>

          <Button variant="danger" onClick={signOut}>
            Sign Out
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
