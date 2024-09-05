import React from 'react';

export type Shape = 'circle' | 'triangle' | 'cross' | 'square' | 'star' | 'whot';

export const shapes: Record<Shape, string> = {
  circle: '●',
  triangle: '▲',
  cross: '✚',
  square: '■',
  star: '★',
  whot: 'WHOT',
};

export const colors: Record<Shape, string> = {
  circle: 'text-yellow-800',
  triangle: 'text-yellow-800',
  cross: 'text-yellow-800',
  square: 'text-yellow-800',
  star: 'text-yellow-800',
  whot: 'text-black',
};

export interface WhotCardProps {
  shape?: Shape;
  num?: string | number;
  faceDown?: boolean;
  height?: number;
  width?: number;
}

const WhotCard: React.FC<WhotCardProps> = ({ 
  shape = 'whot', 
  num = '', 
  faceDown = false, 
  height = 100, 
  width = 70 
}) => {
  const cardStyle = {
    height: `${height}px`,
    width: `${width}px`,
  };

  const shapeSymbol = shapes[shape];
  const shapeColor = colors[shape];

  if (faceDown) {
    return (
      <div 
        style={cardStyle}
        className="relative bg-gradient-to-br from-yellow-800 to-yellow-600 rounded-lg shadow-md flex items-center justify-center border border-gray-300"
      >
        <div className="text-white font-bold text-lg rotate-45">WHOT</div>
      </div>
    );
  }

  return (
    <div 
      style={cardStyle}
      className="relative bg-white rounded-lg shadow-md border border-gray-300 flex flex-col"
    >
      {/* Top left */}
      <div className="absolute top-1 left-1 flex flex-col space-y-0">
        <div className={`text-sm font-bold ${shapeColor}`}>{num}</div>
        <div className={`${shape === 'whot' ? 'text-xs' :'text-lg'} ${shapeColor}`}>{shapeSymbol}</div>
      </div>

      {/* Center */}
      <div className="flex-grow flex items-center justify-center">
        <div className={`${shape === 'whot' && 'hidden'} text-4xl ${shapeColor}`}>{shapeSymbol}</div>
      </div>

      {/* Bottom right */}
      <div className="absolute bottom-1 right-1 flex flex-col items-center rotate-180">
        <div className={`text-sm font-bold ${shapeColor}`}>{num}</div>
        <div className={`${shape === 'whot' ? 'text-xs' :'text-lg'} ${shapeColor}`}>{shapeSymbol}</div>
      </div>
    </div>
  );
};

export default WhotCard;