"use client";

import useAuth from "./useAuth";

const ProtectedComponent = ({ children }) => {
  const isAuthenticated = useAuth();

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  // Render the protected content
  return <>{children}</>;
};

export default ProtectedComponent;
