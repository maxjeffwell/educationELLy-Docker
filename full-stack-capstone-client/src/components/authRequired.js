// Higher Order Component

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import authService from '../utils/auth';

const authRequired = ChildComponent => {
  return props => {
    const navigate = useNavigate();
    const auth = useSelector(state => state.auth.authenticated);

    // Check both Redux state AND authService to handle race conditions
    const isAuthenticated = auth || authService.isAuthenticated();

    useEffect(() => {
      if (!isAuthenticated) {
        navigate('/');
      }
    }, [isAuthenticated, navigate]);

    return isAuthenticated ? <ChildComponent {...props} /> : null;
  };
};

export default authRequired;
