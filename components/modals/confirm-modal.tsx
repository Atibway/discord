"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  

  interface ConfirmModalProps {
    children: React.ReactNode;
    onConfirm: ()=> void;
  };

  export const ConfirmModal = ({
onConfirm,
children
  }: ConfirmModalProps)=> {

    return(
        <AlertDialog>
        <AlertDialogTrigger asChild>
         {children}
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-white dark:bg-white/70">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you  sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
               data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction  onClick={onConfirm}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }