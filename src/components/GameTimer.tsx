import React, { useState, useEffect } from 'react';

interface OverallGameTimerProps {
  gameStatus: string;
}

const OverallGameTimer: React.FC<OverallGameTimerProps> = ({ gameStatus }) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (gameStatus === 'in-progress') {
      interval = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      if (interval) {
        clearInterval(interval);
      }
      if (gameStatus === 'waiting') {
        setElapsedTime(0);
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [gameStatus]);

  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [minutes, seconds]
      .map(v => v.toString().padStart(2, '0'))
      .join(':');
  };

  return (
      <div className="">{formatTime(elapsedTime)}</div>
  );
};

export default OverallGameTimer;