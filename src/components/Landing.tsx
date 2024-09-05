'use client'
import { Button } from "@/components/ui/button";
import { Diamond } from 'lucide-react';
import SwipeCards from "./HomeCards";

export default function LandingPage({onJoinGame, onCreateGame}: {onJoinGame: () => void, onCreateGame: () => void}) {

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-center mb-6">
            <Diamond className="w-12 h-12 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800 ml-3">Whot!</h1>
          </div>
          <p className="text-gray-600 text-center mb-8">
            Challenge players worldwide or test your skills against our AI!
          </p>
          <SwipeCards />
          <div className="space-y-4 mt-4">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" onClick={onJoinGame}>
              Join Game
            </Button>
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white" onClick={onCreateGame}>
              Create Game
            </Button>
          </div>
        </div>
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-600 text-center">
            Play against AI or challenge real players. Enjoy the game!
          </p>
        </div>
      </div>
    </div>
  );
};