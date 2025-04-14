import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 lg:p-12">
      <div className="max-w-5xl w-full">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Modern Image Editor
        </h1>
        
        <div className="card mb-8">
          <p className="text-lg text-gray-700 mb-4">
            Edit your images with our powerful, responsive, and intuitive editor.
            Get started by uploading an image or creating a new canvas.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/editor" className="btn btn-primary text-center">
              Start Editing
            </Link>
            <Link href="/gallery" className="btn btn-secondary text-center">
              View Gallery
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard 
            title="Advanced Editing Tools" 
            description="Crop, resize, rotate, and apply filters to your images with ease."
            icon="✏️"
          />
          <FeatureCard 
            title="Layer Support" 
            description="Work with multiple layers to create complex compositions."
            icon="🧩"
          />
          <FeatureCard 
            title="Export Options" 
            description="Export your creations in various formats and resolutions."
            icon="💾"
          />
          <FeatureCard 
            title="Works Offline" 
            description="Continue editing even when you're offline."
            icon="🌐"
          />
          <FeatureCard 
            title="Responsive Design" 
            description="Seamless experience on desktop, tablet, and mobile devices."
            icon="📱"
          />
          <FeatureCard 
            title="Free to Use" 
            description="All core features are available for free, forever."
            icon="🎁"
          />
        </div>
      </div>
    </main>
  );
}

function FeatureCard({ title, description, icon }: { title: string, description: string, icon: string }) {
  return (
    <div className="card hover:shadow-xl transition-shadow">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
} 