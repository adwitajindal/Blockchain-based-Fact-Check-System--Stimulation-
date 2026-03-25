import { useEffect, useState } from "react";
import { BrowserProvider } from "ethers";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { NetworkBadge } from "./network-badge";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function MetaMaskInfo() {
  const [network, setNetwork] = useState<string>("");
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);

  useEffect(() => {
    checkMetaMask();
  }, []);

  const checkMetaMask = async () => {
    if (window.ethereum) {
      setIsMetaMaskInstalled(true);
      try {
        const provider = new BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        setNetwork(network.name === "unknown" ? `Chain ID: ${network.chainId}` : network.name);
      } catch (error) {
        console.error("Error getting network:", error);
      }
    }
  };

  if (!isMetaMaskInstalled) {
    return (
      <Alert className="mb-6 border-orange-200 bg-orange-50">
        <AlertCircle className="size-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <strong>MetaMask not detected.</strong> Please install MetaMask browser extension to connect your wallet.
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline ml-1 font-medium"
          >
            Download MetaMask
          </a>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="mb-6 border-green-200 bg-green-50">
      <CheckCircle2 className="size-4 text-green-600" />
      <AlertDescription className="flex items-center gap-2 text-green-800">
        <span>MetaMask detected</span>
        {network && (
          <>
            <span>•</span>
            <NetworkBadge />
          </>
        )}
      </AlertDescription>
    </Alert>
  );
}