import React from 'react';

export default function Offline() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="card max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">You're offline</h1>
        <p className="mb-4">
          It seems you're not connected to the internet. Please check your connection and try again.
        </p>
        <p>
          Don't worry, any unsaved changes have been stored locally and will be available when you reconnect.
        </p>
      </div>
    </div>
  );
} 