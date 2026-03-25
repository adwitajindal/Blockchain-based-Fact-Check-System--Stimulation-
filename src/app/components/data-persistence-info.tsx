import { Alert, AlertDescription } from "./ui/alert";
import { Database, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
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
} from "./ui/alert-dialog";
import { toast } from "sonner";

export function DataPersistenceInfo() {
  const [open, setOpen] = useState(false);

  const handleClearData = () => {
    // Clear all localStorage data
    const keys = Object.keys(localStorage);
    const potKeys = keys.filter(key => key.startsWith("pot_"));
    
    potKeys.forEach(key => {
      localStorage.removeItem(key);
    });

    toast.success("All data cleared! Refresh the page to start fresh.");
    setOpen(false);
    
    // Reload page after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  return (
    <Alert className="mb-6 border-blue-200 bg-blue-50">
      <Database className="size-4 text-blue-600" />
      <AlertDescription className="flex items-center justify-between">
        <span className="text-blue-800">
          <strong>Data is saved locally!</strong> Your balance, reputation, and all claims persist across page reloads.
        </span>
        
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-blue-700 hover:text-blue-900 hover:bg-blue-100">
              <Trash2 className="size-3 mr-1" />
              Clear All Data
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear All Data?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete:
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>All user balances and reputation</li>
                  <li>All claims and votes</li>
                  <li>All saved data</li>
                </ul>
                <p className="mt-3 font-semibold">This action cannot be undone!</p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleClearData} className="bg-red-600 hover:bg-red-700">
                Yes, Clear Everything
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </AlertDescription>
    </Alert>
  );
}
