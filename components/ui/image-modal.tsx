'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Download, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface ImageModalProps {
  image: string;
  alt?: string;
  title?: string;
  description?: string;
  onClose: () => void;
  downloadFileName?: string;
}

export function ImageModal({
  image,
  alt = 'Image preview',
  title,
  description,
  onClose,
  downloadFileName = 'base-box-image.jpg',
}: ImageModalProps) {
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image;
    link.download = downloadFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
    >
      {/* Container */}
      <div
        className={`relative w-full flex flex-col ${
          isFullscreen ? 'h-screen max-w-none' : 'max-w-6xl max-h-[95vh]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex-1">
            {title && <h3 className="text-white font-semibold text-lg">{title}</h3>}
            {description && <p className="text-sm text-slate-400 mt-1">{description}</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-slate-800/80 backdrop-blur-sm rounded-lg p-1">
              <button
                onClick={handleZoomOut}
                disabled={zoom <= 0.5}
                className="p-2 hover:bg-slate-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Zoom out"
              >
                <ZoomOut className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={handleResetZoom}
                className="px-3 py-2 hover:bg-slate-700 rounded-md transition-colors text-white text-sm font-medium"
                title="Reset zoom"
              >
                {Math.round(zoom * 100)}%
              </button>
              <button
                onClick={handleZoomIn}
                disabled={zoom >= 3}
                className="p-2 hover:bg-slate-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Zoom in"
              >
                <ZoomIn className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 bg-slate-800/80 hover:bg-slate-700 backdrop-blur-sm rounded-lg transition-colors"
              title="Toggle fullscreen"
            >
              <Maximize2 className="w-4 h-4 text-white" />
            </button>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              title="Download image"
            >
              <Download className="w-4 h-4 text-white" />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 bg-slate-800/80 hover:bg-slate-700 backdrop-blur-sm rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Image Container */}
        <div className="relative flex-1 rounded-2xl overflow-hidden bg-slate-900 border border-slate-700">
          <div
            className="relative w-full h-full overflow-auto flex items-center justify-center p-4"
            style={{ cursor: zoom > 1 ? 'grab' : 'default' }}
          >
            <div
              style={{
                transform: `scale(${zoom})`,
                transition: 'transform 0.2s ease-out',
              }}
              className="relative"
            >
              <Image
                src={image}
                alt={alt}
                width={1920}
                height={1080}
                className="max-w-full h-auto object-contain select-none"
                priority
                draggable={false}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-4 mt-4 px-2">
          <div className="text-xs text-slate-500">
            Click and drag to pan • Scroll to zoom • ESC to close
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <Download className="w-3.5 h-3.5" />
              Download Image
            </button>
          </div>
        </div>
      </div>

      {/* Keyboard hints overlay */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-slate-800/90 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-700">
        <div className="flex items-center gap-4 text-xs text-slate-300">
          <span>
            <kbd className="px-2 py-1 bg-slate-700 rounded text-white">ESC</kbd> Close
          </span>
          <span>
            <kbd className="px-2 py-1 bg-slate-700 rounded text-white">+/-</kbd> Zoom
          </span>
          <span>
            <kbd className="px-2 py-1 bg-slate-700 rounded text-white">0</kbd> Reset
          </span>
        </div>
      </div>
    </div>
  );
}

// Keyboard event listener hook
export function useImageModalKeyboard(
  isOpen: boolean,
  onClose: () => void,
  onZoomIn?: () => void,
  onZoomOut?: () => void,
  onResetZoom?: () => void
) {
  if (typeof window === 'undefined') return;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case '+':
      case '=':
        e.preventDefault();
        onZoomIn?.();
        break;
      case '-':
        e.preventDefault();
        onZoomOut?.();
        break;
      case '0':
        e.preventDefault();
        onResetZoom?.();
        break;
    }
  };

  if (isOpen) {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }
}

export default ImageModal;