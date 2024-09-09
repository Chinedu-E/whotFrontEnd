import React from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Copy, CopyCheck, X } from 'lucide-react';
import { Input } from './ui/input';


const AccessCodeDialog = ({ settings, session_id }: { settings: string, session_id: string }) => {
    const [copied, setCopied] = React.useState(false)

    const handleCopy = () => {
        // Copy session_id to the clipboard
        navigator.clipboard.writeText(session_id).then(() => {
            setCopied(true);
            // Reset the copied state back to false after 2 seconds
            setTimeout(() => setCopied(false), 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    };

    return (
        <AlertDialog open={Boolean(settings)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className='text-center text-xl font-medium text-black/85'>Lobby Code</AlertDialogTitle>
                    <AlertDialogDescription className='sr-only'>Copy and share this code with others.</AlertDialogDescription>
                </AlertDialogHeader>
                <div className="items-center text-center w-full flex space-x-4 justify-center h-10">
                    <Input readOnly defaultValue={session_id} className="h-full text-lg" />
                    <div role="button" onClick={() => handleCopy()}>
                        {!copied ? <Copy size={32} className="hover:bg-gray-100" /> : <CopyCheck size={32} className="hover:bg-gray-100" />}
                    </div>

                </div>
            </AlertDialogContent>
        </AlertDialog>
    )

}

export default AccessCodeDialog