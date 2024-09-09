import React from 'react';
import { useRouter } from 'next/navigation';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { X } from 'lucide-react';

const LeaveGameDialog = ({ open, onClose }: {open: boolean, onClose: () => void}) => {
  const router = useRouter();

  const handleLeaveGame = () => {
    router.push('/');
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-h-[80vh] overflow-y-auto rounded-lg shadow-lg">
        <AlertDialogHeader className="bg-red-600 text-white px-6 py-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <AlertDialogTitle className="text-2xl font-bold">Are you sure?</AlertDialogTitle>
            <button onClick={onClose} className="text-white hover:text-gray-300">
              <X size={24} />
            </button>
          </div>
        </AlertDialogHeader>
        <AlertDialogDescription className="space-y-4 p-6">
          <p className="text-gray-700 text-xl font-medium">
            This action cannot be undone. Are you sure you want to leave the game?
          </p>
          <p className="text-gray-700 leading-relaxed">
            Leaving the game will take you back to the home screen, and you&apos;ll lose any progress you&apos;ve made.
          </p>
        </AlertDialogDescription>
        <AlertDialogFooter className="px-6 py-4 rounded-b-lg flex items-center justify-center">
          <AlertDialogCancel onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleLeaveGame} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
            Leave Game
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LeaveGameDialog;