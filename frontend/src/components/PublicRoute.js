import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = () => {
  const { isAuthenticated } = useAuth();

  // If authenticated, redirect away from the public page (like login).
  // Otherwise, render the public page.
  return isAuthenticated ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoute;