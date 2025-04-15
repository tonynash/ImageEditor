'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
      const basePath = process.env.NODE_ENV === 'production' ? '/ImageEditor' : '';
      const swPath = `${basePath}/sw.js`;
      
      navigator.serviceWorker
        .register(swPath)
        .then((registration) => {
          console.log('Service Worker registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('Service Worker registration failed: ', registrationError);
        });
    }
  }, []);

  return null;
} 