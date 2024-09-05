import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import WhotCard, { WhotCardProps } from './WhotCard'; // Assuming this is the path to your WhotCard component
import { Users, Clock, MessageCircle, X, Trophy, DoorOpen, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"


import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isMobile } from 'react-device-detect';
import { getStackValue, isValid } from '@/whot/game';
import { useWebSocket } from '@/hooks/websocket';
import { useClientId } from '@/hooks/client_id';
import CountdownTimer from './Countdown';
import OverallGameTimer from './GameTimer';
import GameStartCountdown from './GameStartCountdown';
import { useToast } from '@/hooks/use-toast';
import WhotGameInfo from './GameInfo';
import ConnectionLostDialog from './ConnectionLost';
import LeaveGameDialog from './LeaveGame';
import JoinServerRejectedDialog from './Reject';


const backend = process.env.NEXT_PUBLIC_BACKEND || 'ws://localhost:8000'

const ItemTypes = {
    CARD: 'card',
};

const DraggableCard = ({ card, index }: { card: any, index: number }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.CARD,
        item: { index, card },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),

        }),
    });

    drag(ref)

    return (
        <div
            ref={ref}
            className={`w-6 h-8 sm:w-10 sm:h-14 ${isDragging ? 'opacity-50' : ''}`}
        >
            <WhotCard shape={card.shape} num={card.num} faceDown={false} />
        </div>
    );
};

const DroppableFaceCard = ({ onDrop, faceCard }: { onDrop: (val: any) => void, faceCard: any }) => {
    const [, drop] = useDrop({
        accept: ItemTypes.CARD,
        drop: (item: any) => {
            onDrop(item.card);
        },
    });
    const ref = useRef<HTMLDivElement>(null);
    drop(ref);

    return (
        <div ref={ref} className="w-12 h-16 sm:w-16 sm:h-20">
            <WhotCard shape={faceCard.shape} num={faceCard.num} faceDown={false} />
        </div>
    );
};


const getWsUrl = (displayName: string, settings: string, 
                doneTyping: boolean, session_id: string, 
                client_id: string): string => {
    if (displayName && doneTyping) {
        return `${backend}/ws/join/${session_id}?client_id=${client_id}&display_name=${displayName}`
    }

    if (settings) {
        return `${backend}://localhost:8000/ws/create/${client_id}?id=${session_id}&settings=${settings}`
    }
    return ''
}


const WhotGameUI = ({ }) => {
    const router = useRouter()
    const [infoOpen, setInfoOpen] = useState(false);
    const pathname = usePathname()
    const session_id = pathname.split('/')[pathname.split('/').length - 1]
    if (!session_id) {
        router.push('/')
    }
    const s = useSearchParams()
    const { toast } = useToast()
    const settings = s.get('settings') || ''
    const [dialogOpen, setDialogOpen] = useState(!s.get('displayName') && !settings);
    const [displayName, setDisplayName] = useState(s.get('displayName') || '')
    const [doneTyping, setDoneTyping] = useState(false)
    const client_id =  useClientId()

    const { isConnected, message, players, faceCard, lastActionTimestamp, rankings,
        turn, winner, market, timePerTurn, sendMessage } = useWebSocket(getWsUrl(displayName, settings, doneTyping, session_id, client_id));

    const [tmpShow, setTmpShow] = useState<any>(null)
    const userIndex = players.findIndex(player => player.id === client_id);

    const [tmpPlayers, setTmpPlayers] = useState<any[]>([])
    const [turnStack, setTurnStack] = useState<any>([])

    const [leaveGame, setLeaveGame] = useState(false)


    useEffect(() => {
        if (isConnected) {
            console.log('Connected to game WebSocket');
        }
    }, [isConnected]);

    useEffect(() => {
        const reorder = [
            ...players.slice(userIndex),
            ...players.slice(0, userIndex)
        ]
        setTmpPlayers(reorder)
    }, [players, userIndex])

    useEffect(() => { setTmpShow(faceCard) }, [faceCard])

    const getPlayerPosition = (index: number) => {
        const positions = ['bottom', 'left', 'top', 'right'];
        return positions[index % positions.length];
    };

    const handleCardDrop = (card: any) => {
        const isVal: boolean = isValid(tmpShow ? tmpShow : faceCard, card, turnStack.length > 0);
        if (isVal) {
            setTmpShow(card)
            removeFromHand(card)
            setTurnStack([...turnStack, card])
        }
    };

    const orderBack = () => {
        const data: any = [];
        players.map(p => {
            data.push(
                tmpPlayers.find(player => player.id === p.id)
            )
        })
        return data
    }

    const removeFromHand = (card_: any) => {
        setTmpPlayers(prevPlayers => {
            return prevPlayers.map(player => {
                if (player.id === client_id) {
                    const cardIndex = player.hand.findIndex(
                        (card: any) => card.shape === card_.shape && card.num === card_.num
                    );
                    if (cardIndex !== -1) {
                        const updatedHand = [
                            ...player.hand.slice(0, cardIndex),
                            ...player.hand.slice(cardIndex + 1)
                        ];
                        return { ...player, hand: updatedHand };
                    }
                }
                return player;
            });
        });
    }

    const playTurn = (market_?: number) => {
        if (turnStack.length || (market_ || market)) {
            const d = getStackValue(turnStack, market_ ? market_ : market);
            const turnData = {
                player_cards: orderBack(),
                face_card: tmpShow ? tmpShow : faceCard,
                stack: turnStack,
                turn: turn,
                ...d
            }
            const message = JSON.stringify(turnData)
            sendMessage(message)
            setTurnStack([])
        } else {
            toast({
                'title': 'Invalid move',
                description: 'Drag your cards unto the board and stack them before pressing play, or click on the market to draw a card.'
            })
        }


    }

    function resetTurn() {
        const reorder = [
            ...players.slice(userIndex),
            ...players.slice(0, userIndex)
        ]
        setTmpShow(null);
        setTmpPlayers(reorder);
        setTurnStack([])
    }

    const handleTimeUp = () => {
        setTmpShow(null);
        setTurnStack([])
        if (turn){
            playTurn(1)
        }
    };

    return (
        <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
            <div className="h-screen w-full bg-green-800 flex items-center justify-center p-2 sm:p-4">
                <div className="relative w-full h-full sm:h-auto sm:aspect-video max-w-7xl bg-green-700 rounded-xl sm:rounded-3xl shadow-xl overflow-hidden flex flex-col">
                    <GameStartCountdown
                        isStarting={message === 'starting'}
                        onCountdownComplete={() => { }}
                    />
                    {/* Game info bar */}
                    <div className="bg-black bg-opacity-50 text-white p-1 sm:p-2 flex justify-between items-center text-xs sm:text-sm h-10">
                        <div className="flex items-center">
                            <Users className="mr-1 sm:mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                            <span>{players.length} players</span>
                        </div>
                        <div>
                            {message}
                        </div>
                        {/*<div className="flex items-center">
                            <Clock className="mr-1 sm:mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                        </div>*/}
                        <div className="flex items-center">
                            <OverallGameTimer gameStatus={message} />
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-white p-1 sm:p-2"
                            onClick={() => setInfoOpen(!infoOpen)}
                        >
                            <Info className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="hidden sm:inline ml-2">Info</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 sm:p-2"
                            onClick={() => setLeaveGame(true)}
                        >
                            <DoorOpen className="w-4 h-4 sm:w-5 sm:h-5 text-red-700" />
                            <span className="hidden sm:inline ml-2">Exit</span>
                        </Button>
                    </div>

                    {/* Main game area */}
                    <div className="flex-grow flex items-center justify-center h-full">
                        {/* Circular table */}
                        {/* Main playing area */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-green-500 rounded-full flex items-center justify-center mx-auto my-auto">
                            {tmpShow ? <DroppableFaceCard faceCard={tmpShow} onDrop={handleCardDrop} /> : <DroppableFaceCard faceCard={faceCard} onDrop={handleCardDrop} />}
                        </div>

                        {/* Deck */}
                        <div role='button' onClick={() => {
                            if (turn === client_id) {
                                playTurn(market ? market : 1);
                            }
                        }} className="absolute bottom-52 sm:right-1/4 transform translate-x-1/2 translate-y-[90%]">
                            <div className="relative w-12 h-16 sm:w-16 sm:h-20">
                                {Array(3).fill(null).map((_, i) => (
                                    <div key={i} className="absolute" style={{ top: `${i * 2}px`, left: `${i * 2}px` }}>
                                        <WhotCard faceDown={true} shape={'star'} num={0} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Players */}
                        {tmpPlayers.map((player, index) => {
                            const position = getPlayerPosition(index);
                            const isCurrentPlayer = turn === player.id;
                            const isUserPlayer = player.id === client_id;
                            const hand = isUserPlayer ? player.hand : player.hand.slice(0, 5)
                            return (
                                <div
                                    key={player.id}
                                    className={`absolute ${position === 'bottom' ? 'bottom-16 sm:bottom-10 left-[40%] sm:left-1/2 transform -translate-x-1/2 translate-y-1/2' :
                                        position === 'left' ? 'left-10 top-1/2 transform -translate-y-1/2 -translate-x-1/2' :
                                            position === 'top' ? 'top-20 left-[40%] sm:left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col' :
                                                'right-10 top-1/2 transform -translate-y-1/2 translate-x-1/2'
                                        } flex ${position === 'left' || position === 'right' ? 'flex-col' : ''} items-center`}
                                >
                                    {!isUserPlayer && <div className={`mb-1 sm:mb-2 text-white font-bold text-xs sm:text-sm ${isCurrentPlayer ? 'text-yellow-300' : ''} ${position === 'left' && 'ml-7'} ${position === 'right' && 'mr-6'}`}>
                                        {player.name} ({player.hand.length} cards)
                                    </div>}
                                    <div className={`flex ${position === 'left' || position === 'right' ? 'flex-col' : 'w-full flex-wrap'} gap-3`}>

                                        {hand.map((card: any, cardIndex: number) =>
                                            (isUserPlayer && turn === client_id) ? (
                                                <DraggableCard key={cardIndex} card={card} index={cardIndex} />
                                            ) : (
                                                <div
                                                    key={cardIndex}
                                                    className={`w-6 h-8 sm:w-10 sm:h-14 ${position === 'left' ? 'rotate-90' : position === 'right' ? '-rotate-90' : ''
                                                        }`}
                                                >
                                                    <WhotCard
                                                        faceDown={!(player.id === client_id)}
                                                        shape={card.shape}
                                                        num={card.num}
                                                    />
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        <div className="absolute bottom-4 right-0 flex flex-col justify-center space-y-2">
                            <Button size='sm' onClick={() => resetTurn()} className="py-2 text-sm sm:text-base">
                                Reset
                            </Button>
                            <Button size='sm' onClick={() => playTurn()} className="py-2 text-sm sm:text-base">
                                Play
                            </Button>
                        </div>
                    </div>
                </div>

                <WhotGameInfo open={infoOpen} onClose={() => setInfoOpen(false)} />

                <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Enter your display name</AlertDialogTitle>
                            <AlertDialogDescription>
                            </AlertDialogDescription>
                            <div>
                                <Input
                                    type="text"
                                    name="displayName"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    className="mt-1 block w-full"
                                    placeholder="Enter your display name"
                                    required
                                />
                            </div>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex justify-center items-center">
                            <Button className="m-2" onClick={() => router.push('/')}>Cancel</Button>
                            <Button className="m-2" onClick={() => {
                                setDoneTyping(true);
                                setDialogOpen(false);
                            }}>Continue</Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <AlertDialog open={Boolean(winner)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Game Over</AlertDialogTitle>
                            <AlertDialogDescription className='sr-only'>Winner and runner ups</AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="items-center text-center w-full flex flex-col justify-center">
                            <Trophy className='h-32 w-24 from-indigo-500 to-purple-600' />
                            <p className="text-4xl capitalize">{winner} Wins!</p>
                            <div className='w-full'>
                                <div className="flex justify-between">
                                    <p className="font-medium text-lg">Name</p>
                                    <p className="font-medium text-lg">Score</p>
                                </div>
                                {rankings.map((player: any, index: number) => (
                                    <div key={index} className="flex justify-between">
                                        <p>{player[1]}</p>
                                        <p>{player[0]}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <AlertDialogFooter className="flex justify-center items-center">
                            <Button onClick={() => router.push('/')}>Home</Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {turn && <JoinServerRejectedDialog reason={message}/>}
                
                <LeaveGameDialog open={leaveGame} onClose={() => setLeaveGame(false)} />
                
                <ConnectionLostDialog open={Boolean(turn) && !isConnected && !winner}/>
            </div>
        </DndProvider>
    );
};


export default WhotGameUI;