import React from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { X } from 'lucide-react';

const WhotGameInfo = ({ open, onClose }: {open: boolean, onClose: () => void}) => {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-h-[80vh] overflow-y-auto">
        <AlertDialogHeader>
          <div className="flex items-center justify-between">
            <AlertDialogTitle>Whot is Whot?</AlertDialogTitle>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
        </AlertDialogHeader>
        <AlertDialogDescription className="space-y-4">
          <p>
            Whot is a classic card game that involves strategy, skill, and a bit of luck. The objective of the game is to be the first player to get rid of all the cards in your hand.
          </p>
          <p>
            The game is played with a standard deck of 52 cards, with each player receiving an equal number of cards at the start of the game. The remaining cards are placed face down in the center of the table, forming the draw pile.
          </p>
          <p>
            On their turn, a player must play a card that matches the suit or rank of the last card played. If they don&apos;t have a matching card, they can draw from the draw pile until they find a playable card.
          </p>
          <p>
            The game features special cards that can change the direction of play, skip a player, or make the next player draw additional cards. These cards add an extra layer of strategy and excitement to the game.
          </p>
          <p>
            Whot is a great game for players of all ages, and it can be enjoyed by two to six players. It&apos;s a classic that has been around for decades, but it still remains a popular choice for casual gameplay and social gatherings.
          </p>
        </AlertDialogDescription>
        <AlertDialogFooter className='flex items-center justify-center'>
          <AlertDialogCancel onClick={onClose}>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default WhotGameInfo;