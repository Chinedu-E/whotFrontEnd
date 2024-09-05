import React, { useState, useEffect } from 'react';

interface GameStartCountdownProps {
  isStarting: boolean;
  onCountdownComplete: () => void;
}

const GameStartCountdown: React.FC<GameStartCountdownProps> = ({ isStarting, onCountdownComplete }) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (isStarting && count > 0) {
      const timer = setTimeout(() => {
        setCount(count - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (count === 0) {
      onCountdownComplete();
    }
  }, [isStarting, count, onCountdownComplete]);

  useEffect(() => {
    if (isStarting) {
      setCount(3);
    }
  }, [isStarting]);

  if (!isStarting || count === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/45 bg-opacity-70 z-50">
      <div className="text-white text-9xl font-bold animate-pulse">
        {count}
      </div>
    </div>
  );
};

export default GameStartCountdown;