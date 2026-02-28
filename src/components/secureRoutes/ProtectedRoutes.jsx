import React, { useContext } from 'react'
import { AuthContext } from '../../context/UserContext.jsx'
import { Navigate, useNavigate } from 'react-router-dom';

function ProtectedRoutes({ children }) {
  const { user, loading } = useContext(AuthContext);
  // console.log(user);

  if (loading) return null; // or spinner

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoutes
