import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-blue-600">Image Editor</span>
            </Link>
            <nav className="flex items-center space-x-4">
              <Link href="/editor" className="text-gray-600 hover:text-gray-900">
                Editor
              </Link>
              <Link href="/gallery" className="text-gray-600 hover:text-gray-900">
                Gallery
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow p-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">About Image Editor</h1>
          
          <div className="card">
            <p className="mb-4">
              Image Editor PWA is a modern, responsive web application for editing images. It's built with Next.js, 
              Fabric.js, and Tailwind CSS.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Features</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Draw and annotate images</li>
              <li>Add text and shapes</li>
              <li>Remove backgrounds from images</li>
              <li>Export your creations</li>
              <li>Works offline as a Progressive Web App</li>
              <li>Responsive design for all device sizes</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Technology</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Next.js</strong> - React framework</li>
              <li><strong>Fabric.js</strong> - HTML5 canvas library</li>
              <li><strong>Tailwind CSS</strong> - Utility-first CSS framework</li>
              <li><strong>TypeScript</strong> - For type safety</li>
            </ul>
            
            <div className="mt-8 text-center">
              <Link href="/editor" className="btn btn-primary">
                Try the Editor
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Image Editor PWA. All rights reserved.
        </div>
      </footer>
    </div>
  );
} 