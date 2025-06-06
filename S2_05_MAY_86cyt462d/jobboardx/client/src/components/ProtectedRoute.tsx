import { Navigate } from 'react-router-dom';
import  { JSX } from 'react';
interface ProtectedRouteProps {
  role: string;         
  userRole: string | null; 
  element: JSX.Element;
}

export const ProtectedRoute = ({ role, userRole, element }: ProtectedRouteProps) => {
  if (!userRole) return <Navigate to="/login" />;
  if (userRole !== role) return <Navigate to="/unauthorized" />;
  return element;
};
