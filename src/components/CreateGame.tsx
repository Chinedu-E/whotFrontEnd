import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Users, Clock, Shield } from 'lucide-react';
import Loader from './Loader';
import { useRouter } from 'next/navigation';

const CreateGameComponent = ({ onBack }: { onBack: () => void}) => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
  const [gameSettings, setGameSettings] = useState({
    hostName: '',
    numStartingCards: 4,
    numPlayers: 2,
    numAI: 0,
    timeLimit: 30,
    isPrivate: false,
  });

  useEffect(()=>{
    setGameSettings(prev => ({ ...prev, numAI: Math.max(0, gameSettings.numPlayers - 1) }));
  },[gameSettings.numPlayers])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGameSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSliderChange = (name: string, value: number[]) => {
    setGameSettings(prev => ({ ...prev, [name]: value[0] }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setGameSettings(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true)
    e.preventDefault();
    const url = 'http://localhost:8000/create/'
    const request = new Request(url, {
        method: "POST",
        body: JSON.stringify(gameSettings),
      });
    const response = await fetch(request);
    const code = (await response.json());
    setLoading(false)
    router.push(`/game/${code}?settings=${JSON.stringify(gameSettings)}`)
    
  };

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
            <Users className="w-12 h-12 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800 ml-3">Create Game</h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Lobby Name</label>
              <Input
                type="text"
                name="hostName"
                value={gameSettings.hostName}
                onChange={handleInputChange}
                className="mt-1 block w-full"
                placeholder="Enter your display name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Number of Starting Cards: {gameSettings.numStartingCards}</label>
              <Slider
                name="numPlayers"
                value={[gameSettings.numStartingCards]}
                onValueChange={(value) => handleSliderChange('numStartingCards', value)}
                min={3}
                max={15}
                step={1}
                className="mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Number of Players: {gameSettings.numPlayers}</label>
              <Slider
                name="numPlayers"
                value={[gameSettings.numPlayers]}
                onValueChange={(value) => handleSliderChange('numPlayers', value)}
                min={2}
                max={4}
                step={1}
                className="mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Number of AI: {gameSettings.numAI}</label>
              <Slider
                name="numAI"
                value={[gameSettings.numAI]}
                onValueChange={(value) => handleSliderChange('numAI', value)}
                min={0}
                max={Math.max(0, gameSettings.numPlayers - 1)}
                step={1}
                className="mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Time Limit per Turn (seconds): {gameSettings.timeLimit}</label>
              <Slider
                name="timeLimit"
                value={[gameSettings.timeLimit]}
                onValueChange={(value) => handleSliderChange('timeLimit', value)}
                min={10}
                max={120}
                step={5}
                className="mt-1"
              />
            </div>
            <div className="flex items-center">
              <Switch
                name="isPrivate"
                checked={gameSettings.isPrivate}
                onCheckedChange={(checked) => handleSwitchChange('isPrivate', checked)}
                className="mr-2"
              />
              <label className="text-sm font-medium text-gray-700">Private Lobby</label>
            </div>
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
              {loading ? <Loader /> : <p>Create Game</p>}
            </Button>
          </form>
        </div>
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-600 text-center">
            Customize your game settings and create a new lobby.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateGameComponent;