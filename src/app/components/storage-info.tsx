import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Database, HardDrive } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

export function StorageInfo() {
  const [showInfo, setShowInfo] = useState(true);

  const clearAllData = () => {
    if (confirm("Are you sure? This will reset all your data (POT, REP, claims, votes) to defaults.")) {
      // Clear all localStorage data
      localStorage.clear();
      window.location.reload();
    }
  };

  if (!showInfo) return null;

  return (
    <Alert className="mb-6 border-blue-200 bg-blue-50">
      <Database className="size-4 text-blue-600" />
      <AlertTitle className="text-blue-900 font-semibold">Data Persistence Enabled</AlertTitle>
      <AlertDescription className="text-blue-800 space-y-2">
        <p>
          Your POT balance, reputation, claims, and votes are automatically saved in your browser.
          <strong className="ml-1">Everything persists after page reload!</strong>
        </p>
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center gap-1 text-xs">
            <HardDrive className="size-3" />
            <span>Stored locally in browser</span>
          </div>
          <span className="text-xs">•</span>
          <span className="text-xs">Separate data per wallet</span>
          <span className="text-xs">•</span>
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 text-xs text-blue-700 hover:text-blue-900"
            onClick={clearAllData}
          >
            Reset All Data
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 text-xs ml-auto"
            onClick={() => setShowInfo(false)}
          >
            Dismiss
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
