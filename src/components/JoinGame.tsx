import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Diamond, ArrowLeft, Users, Activity, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useWebSocket } from '@/hooks/websocket';

const backend = process.env.NEXT_PUBLIC_BACKEND || 'ws://localhost:8000'

const JoinGameComponent = ({ onBack }: { onBack: () => void }) => {
  const [lobbyCode, setLobbyCode] = useState('');
  const router = useRouter()
  const { games } = useWebSocket(`${backend}/ws/games/`)


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-8">
          <Button
            variant="ghost"
            className="mb-6 text-gray-600 hover:text-gray-800"
            onClick={onBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="flex items-center justify-center mb-6">
            <Diamond className="w-12 h-12 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800 ml-3">Join Game</h1>
          </div>
          <div className="flex space-x-4 mb-8">
            <div className="flex-grow">
              <Input
                type="text"
                placeholder="Enter Lobby Code"
                value={lobbyCode}
                onChange={(e) => setLobbyCode(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => router.push(`/game/${lobbyCode}`)}
            >
              Join
            </Button>
          </div>
          <div className="space-y-4 p-4 bg-gray-100 rounded-lg shadow">
            <div className="flex justify-between items-center text-sm font-semibold text-gray-500 px-4 py-2 bg-gray-200 rounded-t-lg">
              <div className="flex items-center space-x-12">
                <p className="flex items-center"><Users className="mr-2" size={16} /> Players</p>
                <p className="hidden sm:flex items-center"><Activity className="mr-2" size={16} /> Lobby Status</p>
              </div>
              <p>Action</p>
            </div>
            {games && games.length > 0 ? (
              games.map((game: any, index: number) => (
                <div key={index} className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center space-x-12">
                    <p className="text-gray-700">{game.num_players}/{game.max_players} players</p>
                    <p className={`hidden sm:flex font-medium ${game.status === 'waiting' ? 'text-green-600' : 'text-red-600'}`}>
                      {game.status}
                    </p>
                  </div>
                  <Button
                  disabled={game.status !== 'waiting'}
                    onClick={() => router.push(`/game/${game.id}`)}
                    className="bg-gradient-to-br from-green-600 to-green-400 hover:from-green-700 hover:to-green-500 text-white font-medium py-2 px-4 rounded-full transition-colors duration-200"
                  >
                    Join Game
                  </Button>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center space-y-4 p-8 bg-white rounded-lg text-center">
                <PlusCircle className="text-gray-400" size={48} />
                <p className="text-xl font-semibold text-gray-700">There are no public games available</p>
                <Button
                  onClick={onBack}
                  className="bg-gradient-to-br from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-medium py-2 px-4 rounded-full transition-colors duration-200"
                >
                  Create a Game
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-600 text-center">
            Enter a valid lobby code to join an existing game session.
          </p>
        </div>
      </div>
    </div>
  );
};

export default JoinGameComponent;