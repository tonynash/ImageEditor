'use client';

import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';

type Tool = 'select' | 'draw' | 'text' | 'shape' | 'crop' | 'filter';

export default function ImageEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const editorRef = useRef<fabric.Canvas | null>(null);
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toleranceValue, setToleranceValue] = useState(30);

  // Initialize canvas
  useEffect(() => {
    if (canvasRef.current && !editorRef.current) {
      const canvas = new fabric.Canvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: '#ffffff',
        preserveObjectStacking: true,
      });
      
      editorRef.current = canvas;
      
      // Make canvas responsive
      const resizeCanvas = () => {
        const container = canvas.getElement().parentElement;
        if (container) {
          const width = container.clientWidth;
          const height = window.innerHeight * 0.6;
          
          canvas.setDimensions({
            width,
            height,
          });
          canvas.renderAll();
        }
      };
      
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      
      return () => {
        window.removeEventListener('resize', resizeCanvas);
        canvas.dispose();
        editorRef.current = null;
      };
    }
  }, []);

  // Handle tool selection
  useEffect(() => {
    const canvas = editorRef.current;
    if (!canvas) return;
    
    // Disable all modes
    canvas.isDrawingMode = false;
    canvas.selection = true;
    
    // Enable appropriate mode for selected tool
    switch (activeTool) {
      case 'draw':
        canvas.isDrawingMode = true;
        const brush = canvas.freeDrawingBrush;
        brush.color = color;
        brush.width = brushSize;
        break;
      case 'select':
        canvas.selection = true;
        break;
      default:
        break;
    }
  }, [activeTool, color, brushSize]);

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      fabric.Image.fromURL(dataUrl, (img) => {
        const canvas = editorRef.current;
        if (!canvas) return;
        
        // Clear the canvas
        canvas.clear();
        
        // Scale the image to fit the canvas
        const canvasWidth = canvas.getWidth();
        const canvasHeight = canvas.getHeight();
        
        if (img.width && img.height) {
          const scaleFactor = Math.min(
            canvasWidth / img.width,
            canvasHeight / img.height
          ) * 0.9;
          
          img.scale(scaleFactor);
        }
        
        // Center the image
        canvas.centerObject(img);
        canvas.add(img);
        setImageLoaded(true);
        canvas.renderAll();
      });
    };
    reader.readAsDataURL(file);
  };

  // Add text
  const addText = () => {
    const canvas = editorRef.current;
    if (!canvas) return;
    
    const text = new fabric.IText('Double click to edit', {
      left: canvas.getWidth() / 2,
      top: canvas.getHeight() / 2,
      fontFamily: 'Arial',
      fill: color,
      fontSize: 20,
      originX: 'center',
      originY: 'center',
    });
    
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  // Add shape
  const addShape = (shape: 'rect' | 'circle') => {
    const canvas = editorRef.current;
    if (!canvas) return;
    
    let object;
    
    if (shape === 'rect') {
      object = new fabric.Rect({
        left: canvas.getWidth() / 2,
        top: canvas.getHeight() / 2,
        width: 100,
        height: 100,
        fill: color,
        originX: 'center',
        originY: 'center',
      });
    } else {
      object = new fabric.Circle({
        left: canvas.getWidth() / 2,
        top: canvas.getHeight() / 2,
        radius: 50,
        fill: color,
        originX: 'center',
        originY: 'center',
      });
    }
    
    canvas.add(object);
    canvas.setActiveObject(object);
    canvas.renderAll();
  };

  // Delete selected object
  const deleteSelected = () => {
    const canvas = editorRef.current;
    if (!canvas) return;
    
    const objects = canvas.getActiveObjects();
    if (objects.length) {
      objects.forEach(obj => canvas.remove(obj));
      canvas.discardActiveObject();
      canvas.renderAll();
      
      // Check if canvas is empty
      if (canvas.getObjects().length === 0) {
        setImageLoaded(false);
      }
    }
  };

  // Export canvas
  const exportCanvas = () => {
    const canvas = editorRef.current;
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL({
      format: 'png',
      quality: 1,
    });
    
    const link = document.createElement('a');
    link.download = 'image-editor-export.png';
    link.href = dataUrl;
    link.click();
  };

  // Remove Background
  const removeBackground = () => {
    setIsProcessing(true);
    const canvas = editorRef.current;
    if (!canvas) {
      setIsProcessing(false);
      return;
    }

    // Find the image object
    const objects = canvas.getObjects();
    const imageObject = objects.find(obj => obj.type === 'image') as fabric.Image;
    
    if (!imageObject) {
      setIsProcessing(false);
      alert('Please upload an image first.');
      return;
    }

    try {
      // Create a temporary canvas to manipulate the image data
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      
      if (!tempCtx) {
        setIsProcessing(false);
        return;
      }

      // Get image data
      const element = imageObject.getElement() as HTMLImageElement;
      
      // Set the temp canvas dimensions to match the image
      tempCanvas.width = element.width;
      tempCanvas.height = element.height;
      
      // Draw the image on the temp canvas
      tempCtx.drawImage(element, 0, 0);
      
      // Get the image data for processing
      const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
      const data = imageData.data;
      
      // Process the image to remove background
      // This is a simple color-based background removal
      // Get the color of the top-left pixel (assumed to be background)
      const tolerance = toleranceValue;
      const r0 = data[0];
      const g0 = data[1];
      const b0 = data[2];
      
      // Loop through each pixel and make similar colors transparent
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Calculate color distance (Euclidean distance in RGB space)
        const dist = Math.sqrt(
          (r - r0) * (r - r0) +
          (g - g0) * (g - g0) +
          (b - b0) * (b - b0)
        );
        
        // If the color is similar to the background color, make it transparent
        if (dist < tolerance) {
          data[i + 3] = 0; // Alpha channel (0 = transparent)
        }
      }
      
      // Apply the processed image data back to the canvas
      tempCtx.putImageData(imageData, 0, 0);
      
      // Create a new Fabric.js image with the processed data
      fabric.Image.fromURL(tempCanvas.toDataURL(), (newImg) => {
        // Remove the old image
        canvas.remove(imageObject);
        
        // Set the new image to the same position and scale
        if (imageObject.scaleX && imageObject.scaleY) {
          newImg.set({
            left: imageObject.left,
            top: imageObject.top,
            scaleX: imageObject.scaleX,
            scaleY: imageObject.scaleY,
            angle: imageObject.angle,
            originX: imageObject.originX,
            originY: imageObject.originY,
          });
        }
        
        // Add the new image to the canvas
        canvas.add(newImg);
        canvas.renderAll();
        setIsProcessing(false);
      });
    } catch (error) {
      console.error('Error removing background:', error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="card flex-grow order-2 lg:order-1">
        <div className="relative rounded-lg border border-gray-300 overflow-hidden bg-gray-100 mb-4">
          <canvas ref={canvasRef} className="block w-full" />
          
          {!imageLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
              <p className="mb-4">No image loaded</p>
              <label className="btn btn-primary cursor-pointer">
                Upload Image
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap justify-center gap-2">
          {imageLoaded ? (
            <>
              <button 
                className="btn btn-secondary text-sm px-3"
                onClick={() => exportCanvas()}
              >
                Export
              </button>
              <button 
                className="btn btn-secondary text-sm px-3"
                onClick={deleteSelected}
              >
                Delete Selected
              </button>
            </>
          ) : (
            <label className="btn btn-primary text-sm px-3 cursor-pointer">
              Import
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileUpload}
                title="Import image"
                aria-label="Import image"
              />
            </label>
          )}
        </div>
      </div>
      
      <div className="card w-full lg:w-64 shrink-0 order-1 lg:order-2">
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Tools</h3>
          <div className="grid grid-cols-3 gap-2">
            <button 
              className={`btn p-2 ${activeTool === 'select' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTool('select')}
            >
              Select
            </button>
            <button 
              className={`btn p-2 ${activeTool === 'draw' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTool('draw')}
            >
              Draw
            </button>
            <button 
              className={`btn p-2 btn-secondary`}
              onClick={() => addText()}
            >
              Text
            </button>
            <button 
              className={`btn p-2 btn-secondary`}
              onClick={() => addShape('rect')}
            >
              Rectangle
            </button>
            <button 
              className={`btn p-2 btn-secondary`}
              onClick={() => addShape('circle')}
            >
              Circle
            </button>
            <label className="btn p-2 btn-secondary cursor-pointer">
              Image
              <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            </label>
            <button 
              className={`btn p-2 btn-secondary col-span-3 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={removeBackground}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Remove Background'}
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Properties</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm mb-1">Color</label>
              <input 
                type="color" 
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full rounded border border-gray-300 h-8"
                title="Color picker"
                aria-label="Select color"
              />
            </div>
            
            {activeTool === 'draw' && (
              <div>
                <label className="block text-sm mb-1">Brush Size: {brushSize}px</label>
                <input 
                  type="range" 
                  min="1" 
                  max="50"
                  value={brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className="w-full"
                  title="Brush size slider"
                  aria-label="Adjust brush size"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm mb-1">Background Tolerance: {toleranceValue}</label>
              <input 
                type="range" 
                min="5" 
                max="100"
                value={toleranceValue}
                onChange={(e) => setToleranceValue(parseInt(e.target.value))}
                className="w-full"
                title="Background tolerance slider"
                aria-label="Adjust background removal tolerance"
              />
              <p className="text-xs text-gray-500 mt-1">Higher values remove more of the background</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 