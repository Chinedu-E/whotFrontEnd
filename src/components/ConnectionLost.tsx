import React from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ConnectionLostDialog = ({ open }: {open: boolean}) => {
    const router = useRouter()
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-h-[80vh] w-screen sm:w-auto overflow-y-auto rounded-lg shadow-lg">
        <AlertDialogHeader className="bg-red-500 text-white px-6 py-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <AlertDialogTitle className="text-2xl font-bold">Connection Lost</AlertDialogTitle>
          </div>
        </AlertDialogHeader>
        <AlertDialogDescription className="space-y-4 p-6">
          <p className="text-gray-700 text-xl font-medium">
            Sorry, you&apos;ve lost connection to the server.
          </p>
          <p className="text-gray-700 leading-relaxed">
            This means you won&apos;t be able to continue your current game session. Please check your internet connection and try to reconnect.
          </p>
        </AlertDialogDescription>
        <AlertDialogFooter className="bg-gray-100 px-6 py-4 rounded-b-lg flex items-center justify-center">
          <AlertDialogAction onClick={() => router.push('/')} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
            Go to Home
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConnectionLostDialog;