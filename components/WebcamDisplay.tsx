
import React, { useRef, useEffect, forwardRef } from 'react';

interface WebcamDisplayProps {
  stream: MediaStream | null;
  isActive: boolean;
}

export const WebcamDisplay = forwardRef<HTMLDivElement, WebcamDisplayProps>(
  ({ stream, isActive }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
      if (videoRef.current && stream) {
        videoRef.current.srcObject = stream;
      }
    }, [stream]);

    return (
      <div ref={ref} className="flex-1 webcam-container bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 p-6 min-h-[400px] md:min-h-[500px] relative rounded-2xl overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover rounded-2xl border-4 border-yellow-300 transform scaleX(-1) relative z-10 transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}
        />
        {!isActive && (
          <div id="webcam-placeholder" className="absolute inset-0 flex flex-col items-center justify-center text-yellow-200 z-20">
            <div className="text-7xl mb-6 animate-pulse">📸</div>
            <p className="text-2xl font-bold text-center px-4">Click "Start Webcam" to begin<br/>your celebration! 🎊</p>
          </div>
        )}
      </div>
    );
  }
);

WebcamDisplay.displayName = 'WebcamDisplay';
