import React, { Dispatch, SetStateAction, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { colors, Shape, shapes, WhotCardProps } from "./WhotCard";


const generateDummyHand = () => Array(5).fill(null).map((_, i) => ({id: i, shape: 'circle' as Shape, num: 5 }));

const SwipeCards = () => {
  const [cards, setCards] = useState<any[]>(cardData);

  return (
    <div
      className="grid h-[400px] w-full place-items-center bg-neutral-100"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke-width='2' stroke='%23d4d4d4'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
      }}
    >
      {cards.map((card) => {
        return (
          <Card key={card.id} id={card.id} cards={cards} setCards={setCards} {...card} />
        );
      })}
    </div>
  );
};

const Card = ({
  id,
  shape,
  num,
  setCards,
  cards,
}: {
  id: number;
  shape: Shape,
  num: number;
  setCards: Dispatch<SetStateAction<any[]>>;
  cards: any[];
}) => {
  const x = useMotionValue(0);

  const rotateRaw = useTransform(x, [-150, 150], [-18, 18]);
  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);

  const isFront = id === cards[cards.length - 1].id;

  const rotate = useTransform(() => {
    const offset = isFront ? 0 : id % 2 ? 6 : -6;

    return `${rotateRaw.get() + offset}deg`;
  });

  const handleDragEnd = () => {
    if (Math.abs(x.get()) > 100) {
      setCards((pv) => pv.filter((v) => v.id !== id));
    }
  };

  return (
    <motion.div
      className="h-80 w-60 origin-bottom rounded-lg bg-white object-cover hover:cursor-grab active:cursor-grabbing"
      style={{
        gridRow: 1,
        gridColumn: 1,
        x,
        opacity,
        rotate,
        transition: "0.125s transform",
        boxShadow: isFront
          ? "0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5)"
          : undefined,
      }}
      animate={{
        scale: isFront ? 1 : 0.98,
      }}
      drag={isFront ? "x" : false}
      dragConstraints={{
        left: 0,
        right: 0,
      }}
      onDragEnd={handleDragEnd}
    >
        <WhotCard shape={shape} num={num} height={320} width={240}/>
    </motion.div>
  );
};

export default SwipeCards;

type Card = {
  id: number;
  url: string;
};

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
          <div className={`text-xl font-bold ${shapeColor}`}>{num}</div>
          <div className={`${shape === 'whot' ? 'text-xs' :'text-5xl'} ${shapeColor}`}>{shapeSymbol}</div>
        </div>
  
        {/* Center */}
        <div className="flex-grow flex items-center justify-center">
          <div className={`${shape === 'whot' && 'hidden'} text-9xl ${shapeColor}`}>{shapeSymbol}</div>
        </div>
  
        {/* Bottom right */}
        <div className="absolute bottom-1 right-1 flex flex-col items-center rotate-180">
          <div className={`text-xl font-bold ${shapeColor}`}>{num}</div>
          <div className={`${shape === 'whot' ? 'text-xs' :'text-5xl'} ${shapeColor}`}>{shapeSymbol}</div>
        </div>
      </div>
    );
  };

const cardData = [{'id': 0, 'num': 14, 'shape': 'circle'},
    {'id': 1, 'num': 7, 'shape': 'circle'},
    {'id': 2, 'num': 4, 'shape': 'triangle'},
    {'id': 3, 'num': 2, 'shape': 'triangle'},
    {'id': 4, 'num': 10, 'shape': 'cross'},
    {'id': 5, 'num': 3, 'shape': 'square'},
    {'id': 6, 'num': 5, 'shape': 'triangle'},
    {'id': 7, 'num': 12, 'shape': 'triangle'},
    {'id': 8, 'num': 8, 'shape': 'circle'},
    {'id': 9, 'num': 13, 'shape': 'triangle'},
    {'id': 10, 'num': 1, 'shape': 'square'},
    {'id': 11, 'num': 13, 'shape': 'circle'},
    {'id': 12, 'num': 3, 'shape': 'star'},
    {'id': 13, 'num': 1, 'shape': 'triangle'},
    {'id': 14, 'num': 12, 'shape': 'circle'},
    {'id': 15, 'num': 7, 'shape': 'cross'},
    {'id': 16, 'num': 1, 'shape': 'star'},
    {'id': 17, 'num': 11, 'shape': 'square'},
    {'id': 18, 'num': 3, 'shape': 'triangle'},
    {'id': 19, 'num': 7, 'shape': 'triangle'},
    {'id': 20, 'num': 11, 'shape': 'circle'},
    {'id': 21, 'num': 11, 'shape': 'triangle'},
    {'id': 22, 'num': 2, 'shape': 'star'},
    {'id': 23, 'num': 5, 'shape': 'star'},
    {'id': 24, 'num': 8, 'shape': 'star'},
    {'id': 25, 'num': 3, 'shape': 'cross'},
    {'id': 26, 'num': 14, 'shape': 'triangle'},
    {'id': 27, 'num': 10, 'shape': 'triangle'},
    {'id': 28, 'num': 4, 'shape': 'circle'},
    {'id': 29, 'num': 1, 'shape': 'circle'},
    {'id': 30, 'num': 8, 'shape': 'triangle'},
    {'id': 31, 'num': 13, 'shape': 'square'},
    {'id': 32, 'num': 14, 'shape': 'square'},
    {'id': 33, 'num': 5, 'shape': 'square'},
    {'id': 34, 'num': 3, 'shape': 'circle'},
    {'id': 35, 'num': 2, 'shape': 'cross'},
    {'id': 36, 'num': 1, 'shape': 'cross'},
    {'id': 37, 'num': 5, 'shape': 'cross'},
    {'id': 38, 'num': 13, 'shape': 'cross'},
    {'id': 39, 'num': 14, 'shape': 'cross'},
    {'id': 40, 'num': 10, 'shape': 'circle'},
    {'id': 41, 'num': 11, 'shape': 'cross'},
    {'id': 42, 'num': 2, 'shape': 'circle'},
    {'id': 43, 'num': 7, 'shape': 'star'},
    {'id': 44, 'num': 7, 'shape': 'square'},
    {'id': 45, 'num': 2, 'shape': 'square'},
    {'id': 46, 'num': 10, 'shape': 'square'},
    {'id': 47, 'num': 5, 'shape': 'circle'},
    {'id': 48, 'num': 4, 'shape': 'star'}]