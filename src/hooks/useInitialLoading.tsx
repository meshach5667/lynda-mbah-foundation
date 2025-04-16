
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useInitialLoading = (duration = 2000) => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      navigate('/');
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, navigate]);

  return isLoading;
};
