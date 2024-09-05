import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  initialTime: number; // in seconds
  onTimeUp: () => void;
  turn: string;
  lastActionTimestamp: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialTime,
  onTimeUp,
  turn,
  lastActionTimestamp,
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    // Reset timer when turn changes or a new action is received
      setTimeLeft(initialTime);

      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            onTimeUp();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    

  }, [lastActionTimestamp, initialTime, onTimeUp]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div >{formatTime(timeLeft)}</div>
  );
};

export default CountdownTimer;