import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router';
import useAuth from '../hooks/useAuth';
import Loadable from '../ui-component/Loadable';
// import Loader from 'pages/widget/loader';
const ProtectedRoute = ({ roles, children }) => {
  const { user } = useAuth();
  const [isChecked, setIsChecked] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const serviceToken = window.localStorage.getItem('serviceToken');

      if (serviceToken) {
        setIsLogged(true);
        if (roles && roles.length > 0 && roles.includes(user?.user_role)) {
          setIsAuthorized(true);
        }
      }
      setIsChecked(true);
    };
    // Call checkAuth immediately
    checkAuth();
    // Check auth status every second
    const intervalId = setInterval(checkAuth, 9000);
    return () => clearInterval(intervalId);
  }, [roles]);

  if (!isChecked) {
    return <Loadable />;
  }

  if (!isLogged) {
    // If not logged in or not authorized, redirect to login page
    return <Navigate to="/pages/login" />;
  } else if (isLogged && !isAuthorized) {
    return <Navigate to="/pages/403" />;
  }

  return children;
};

export default ProtectedRoute;
