
import React, { useState, useRef, useEffect, useCallback } from 'react';

interface ControlsPanelProps {
  isWebcamActive: boolean;
  onStartWebcam: () => void;
  onThaliUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  thaliImage: string | null;
  onTilakDrop: () => void;
  onSendWishes: () => void;
  isLoadingWish: boolean;
  webcamBounds: DOMRect | undefined;
}

const DraggableItem: React.FC<{
  children: React.ReactNode;
  onDrop?: () => void;
  className?: string;
  boundaryRect?: DOMRect;
  initialPosition?: { top: string, left: string };
}> = ({ children, onDrop, className, boundaryRect, initialPosition }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(initialPosition || { top: '0px', left: '0px' });
  const dragRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);

  useEffect(() => {
    if (initialPosition) {
      setPosition(initialPosition);
    }
  }, [initialPosition]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragRef.current) {
      setIsDragging(true);
      const rect = dragRef.current.getBoundingClientRect();
      offsetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      hasMovedRef.current = false;
      dragRef.current.style.position = 'fixed';
      dragRef.current.style.zIndex = '1000';
      e.preventDefault();
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && dragRef.current) {
      hasMovedRef.current = true;
      let x = e.clientX - offsetRef.current.x;
      let y = e.clientY - offsetRef.current.y;
      
      if (boundaryRect) {
        const itemWidth = dragRef.current.offsetWidth;
        const itemHeight = dragRef.current.offsetHeight;
        x = Math.max(boundaryRect.left, Math.min(x, boundaryRect.right - itemWidth));
        y = Math.max(boundaryRect.top, Math.min(y, boundaryRect.bottom - itemHeight));
      }

      setPosition({ top: `${y}px`, left: `${x}px` });
    }
  }, [isDragging, boundaryRect]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      if (dragRef.current) {
        if (hasMovedRef.current) {
           onDrop?.();
        }
        if (initialPosition) {
            dragRef.current.style.position = 'absolute';
            setPosition(initialPosition);
        }
      }
    }
  }, [isDragging, onDrop, initialPosition]);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);
  
  const style: React.CSSProperties = isDragging || !initialPosition ? { top: position.top, left: position.left, position: 'fixed' } : { ...initialPosition, position: 'absolute' };

  return (
    <div ref={dragRef} onMouseDown={handleMouseDown} className={className} style={style}>
      {children}
    </div>
  );
};

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  isWebcamActive,
  onStartWebcam,
  onThaliUpload,
  thaliImage,
  onTilakDrop,
  onSendWishes,
  isLoadingWish,
  webcamBounds,
}) => {
  return (
    <div className="w-full lg:w-96 flex-shrink-0 flex flex-col items-center gap-6 relative">
      <button
        id="start-button"
        onClick={onStartWebcam}
        disabled={isWebcamActive}
        className="w-full text-xl font-bold text-white py-4 px-8 rounded-full shadow-lg transition-all duration-300 ease-in-out enabled:hover:scale-105 enabled:hover:shadow-2xl disabled:opacity-60 disabled:cursor-not-allowed bg-gradient-to-r from-blue-500 to-purple-600 shadow-purple-500/50"
      >
        <i className="fas fa-camera mr-3"></i>
        {isWebcamActive ? 'Webcam Active!' : 'Start Webcam'}
      </button>

      <div className="w-full">
        <label htmlFor="thali-upload-input" className="w-full block text-center text-lg font-bold text-white py-4 px-8 rounded-full shadow-lg cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl bg-gradient-to-r from-pink-300 to-indigo-300 shadow-indigo-300/50">
          <i className="fas fa-upload mr-3"></i>
          Upload Aarti Thali
        </label>
        <input type="file" id="thali-upload-input" accept="image/*" className="hidden" onChange={onThaliUpload} />
      </div>

      {thaliImage && (
        <DraggableItem
          boundaryRect={webcamBounds}
          className="w-40 h-40 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing bg-radial-gradient-yellow thali-glow transition-transform hover:scale-105"
        >
          <img src={thaliImage} alt="Uploaded Thali" className="w-[85%] h-[85%] object-contain rounded-full" />
        </DraggableItem>
      )}

      <DraggableItem
        onDrop={onTilakDrop}
        initialPosition={{ top: '35%', left: '55%' }}
        className="w-16 h-16 flex items-center justify-center cursor-grab active:cursor-grabbing"
      >
        <div id="tilak" className="text-5xl drop-shadow-lg">🔴</div>
      </DraggableItem>
      
      <button
        id="wishes-button"
        onClick={onSendWishes}
        disabled={isLoadingWish}
        className="w-full text-xl font-bold text-white py-4 px-8 rounded-full shadow-lg transition-all duration-300 ease-in-out enabled:hover:scale-105 enabled:hover:shadow-2xl disabled:opacity-60 disabled:cursor-not-allowed bg-gradient-to-r from-pink-500 to-red-500 shadow-red-500/50"
      >
        {isLoadingWish ? (
          <>
            <i className="fas fa-spinner fa-spin mr-3"></i>
            Generating...
          </>
        ) : (
          <>
            <i className="fas fa-hands-praying mr-3"></i>
            Send AI Well Wishes!
          </>
        )}
      </button>
    </div>
  );
};
