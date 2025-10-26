
import React, { useState, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { WebcamDisplay } from './components/WebcamDisplay';
import { ControlsPanel } from './components/ControlsPanel';
import { CelebrationOverlay } from './components/CelebrationOverlay';
import { generateBhaiDoojWish } from './services/geminiService';

const App: React.FC = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [thaliImage, setThaliImage] = useState<string | null>(null);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');
  const [isLoadingWish, setIsLoadingWish] = useState(false);

  const webcamContainerRef = useRef<HTMLDivElement>(null);

  const handleStartWebcam = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setIsWebcamActive(true);
    } catch (err) {
      console.error(err);
      alert('Camera access was denied. Please allow camera access in your browser settings to use this feature.');
    }
  }, []);

  const handleThaliUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setThaliImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerCelebration = useCallback((message: string) => {
    setCelebrationMessage(message);
    setIsCelebrating(true);
  }, []);
  
  const handleTilakDrop = useCallback(() => {
    if (isWebcamActive) {
      triggerCelebration("Happy Bhai Dooj! 🎊✨");
    }
  }, [isWebcamActive, triggerCelebration]);

  const handleSendWishes = useCallback(async () => {
    setIsLoadingWish(true);
    try {
      const wish = await generateBhaiDoojWish();
      triggerCelebration(wish);
    } catch (error) {
      console.error("Failed to generate wish:", error);
      triggerCelebration("Wishing you a very Happy Bhai Dooj! May your bond be blessed with happiness and love.");
    } finally {
      setIsLoadingWish(false);
    }
  }, [triggerCelebration]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
      <div className="bg-white/95 festive-card max-w-6xl w-full mx-auto p-6 md:p-10 z-10 rounded-[3rem] shadow-2xl shadow-pink-500/30">
        <Header />
        <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-stretch mt-8">
          <WebcamDisplay
            ref={webcamContainerRef}
            stream={stream}
            isActive={isWebcamActive}
          />
          <ControlsPanel
            isWebcamActive={isWebcamActive}
            onStartWebcam={handleStartWebcam}
            onThaliUpload={handleThaliUpload}
            thaliImage={thaliImage}
            onTilakDrop={handleTilakDrop}
            onSendWishes={handleSendWishes}
            isLoadingWish={isLoadingWish}
            webcamBounds={webcamContainerRef.current?.getBoundingClientRect()}
          />
        </div>
      </div>
      <CelebrationOverlay
        isActive={isCelebrating}
        message={celebrationMessage}
        onComplete={() => setIsCelebrating(false)}
      />
    </div>
  );
};

export default App;
