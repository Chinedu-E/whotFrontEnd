import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface WebSocketMessage {
  status?: string;
  player_cards?: any[];
  face_card?: any;
  turn?: string;
  market: number;
  winner?: string;
  timePerTurn?: number;
  games?: any[];
  rankings?: any[];
}

export const useWebSocket = (url: string, onClose?: () => void) => {
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [players, setPlayers] = useState<any[]>([]);
  const [faceCard, setFaceCard] = useState<any>({shape: 'whot', num: 20});
  const [turn, setTurn] = useState('')
  const [market, setMarket] = useState(0)
  const [timePerTurn, setTimePerTurn] = useState(0)
  const [winner, setWinner] = useState('')
  const [games, setGames] = useState<any>([])
  const [rankings, setRankings] = useState<any>([])
  const [lastActionTimestamp, setLastActionTimestamp] = useState(Date.now());
  const wsRef = useRef<WebSocket | null>(null);
  const router = useRouter();

  const connect = useCallback(() => {
    
    if (wsRef.current?.readyState !== WebSocket.OPEN && url) {
      wsRef.current = new WebSocket(url);

      wsRef.current.onopen = () => {
        setIsConnected(true);
        console.log('WebSocket connected');
      };

      wsRef.current.onmessage = (event: MessageEvent) => {
        const data: WebSocketMessage = JSON.parse(event.data);
        setLastActionTimestamp(Date.now())
        if (data.status) {
          setMessage(data.status);
        }
        if (data.player_cards) {
          setPlayers(data.player_cards);
        }
        if (data.face_card) {
          setFaceCard(data.face_card);
        }
        if (data.turn) {
          setTurn(data.turn);
        }
        if (data.winner){
          setWinner(data.winner);
        }
        if (data.market !== undefined) {
          setMarket(data.market);
        }
        if (data.timePerTurn){
          setTimePerTurn(data.timePerTurn);
        }

        if (data.games){
          setGames(data.games);
        }

        if (data.rankings){
          setRankings(data.rankings);
        }
      };

      wsRef.current.onclose = () => {
        setIsConnected(false);
        console.log('WebSocket disconnected');
        
      };
    }
  }, [url]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }
  }, []);

  const sendMessage = useCallback((message: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(message);
    } else {
      console.error('WebSocket is not connected');
    }
  }, []);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return { isConnected, message, players, faceCard, turn, winner, market, timePerTurn, lastActionTimestamp, games, rankings, sendMessage };
};