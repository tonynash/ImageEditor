import React from 'react';
import Link from 'next/link';
import ImageEditor from '../components/ImageEditor';

export default function EditorPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-blue-600">Image Editor</span>
            </Link>
            <nav className="flex items-center space-x-4">
              <Link href="/gallery" className="text-gray-600 hover:text-gray-900">
                Gallery
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900">
                About
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow p-4">
        <div className="max-w-7xl mx-auto">
          <ImageEditor />
        </div>
      </main>

      <footer className="bg-white border-t py-4">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Image Editor PWA. All rights reserved.
        </div>
      </footer>
    </div>
  );
} 