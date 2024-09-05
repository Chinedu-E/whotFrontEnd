import React from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';

const JoinServerRejectedDialog = ({ reason }: {reason: string}) => {
    const router = useRouter()
    const open = reason === 'full' || reason === 'started' || reason === 'finished'
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-h-[80vh] overflow-y-auto rounded-lg shadow-lg">
        <AlertDialogHeader className="bg-red-500 text-white px-6 py-4 rounded-t-lg">
          <div className="flex items-center justify-center text-center">
            <AlertDialogTitle className="text-2xl font-bold">Unable to Join Game</AlertDialogTitle>
          </div>
        </AlertDialogHeader>
        <AlertDialogDescription className="space-y-4 p-6">
          {reason === 'full' && (
            <>
              <p className="text-gray-700 text-xl font-medium">
                The game session is full.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Unfortunately, the game session you tried to join is currently at maximum capacity. Please try again later or join a different game.
              </p>
            </>
          )}
          {reason === 'started' && (
            <>
              <p className="text-gray-700 text-xl font-medium">
                The game has already started.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The game you tried to join has already begun, and new players can no longer be added. Please try again with a different game.
              </p>
            </>
          )}
          {reason === 'finished' && (
            <>
              <p className="text-gray-700 text-xl font-medium">
                The game has finished.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The game you tried to join has already finished. Please try again with a different game or create one.
              </p>
            </>
          )}
        </AlertDialogDescription>
        <AlertDialogFooter className="bg-gray-100 px-6 py-4 rounded-b-lg flex items-center justify-center">
          <AlertDialogCancel onClick={() => router.push('/')} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded">
            Home
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default JoinServerRejectedDialog;