'use client'
import { useState } from "react";
import JoinGameComponent from "@/components/JoinGame";
import LandingPage from "@/components/Landing";
import CreateGameComponent from "@/components/CreateGame";

export default function Home() {
  const [currentView, setCurrentView] = useState('landing');
  return (
    <>
    {currentView === 'landing' && (
      <LandingPage 
        onJoinGame={() => setCurrentView('join')}
        onCreateGame={() => setCurrentView('create')}
      />
    )}
    {currentView === 'join' && (
      <JoinGameComponent onBack={() => setCurrentView('landing')} />
    )}
    {currentView === 'create' && (
      <CreateGameComponent onBack={() => setCurrentView('landing')} />
    )}
    </>
  )

};
