const fs = require('fs');
const { createCanvas } = require('canvas');

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Fill background
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(0, 0, size, size);

  // Draw text
  ctx.fillStyle = '#ffffff';
  ctx.font = `${size/4}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('IE', size/2, size/2);

  // Save the image
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`public/icons/icon-${size}x${size}.png`, buffer);
}

// Generate icons
generateIcon(192);
generateIcon(512);

// Since we can't run this in Node directly (no document object),
// this is just a placeholder. In a real environment, you would use
// a library like node-canvas to generate the icons.

console.log('This is a placeholder script. Please create the icons manually or use a graphics library.'); 