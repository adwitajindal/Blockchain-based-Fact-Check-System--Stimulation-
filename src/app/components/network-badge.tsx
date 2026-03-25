import { useEffect, useState } from "react";
import { BrowserProvider } from "ethers";
import { Badge } from "./ui/badge";
import { Wifi } from "lucide-react";

export function NetworkBadge() {
  const [network, setNetwork] = useState<{ name: string; chainId: bigint } | null>(null);

  useEffect(() => {
    getNetwork();

    if (window.ethereum) {
      window.ethereum.on("chainChanged", () => {
        getNetwork();
      });
    }

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener("chainChanged", getNetwork);
      }
    };
  }, []);

  const getNetwork = async () => {
    if (!window.ethereum) return;

    try {
      const provider = new BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      setNetwork({ name: network.name, chainId: network.chainId });
    } catch (error) {
      console.error("Error getting network:", error);
    }
  };

  const getNetworkDisplay = () => {
    if (!network) return "Not Connected";

    const chainIdNum = Number(network.chainId);
    
    // Common network names
    const networkNames: { [key: number]: string } = {
      1: "Ethereum",
      11155111: "Sepolia",
      137: "Polygon",
      80001: "Mumbai",
      56: "BSC",
      97: "BSC Testnet",
      42161: "Arbitrum",
      421613: "Arbitrum Goerli",
      10: "Optimism",
      420: "Optimism Goerli",
    };

    return networkNames[chainIdNum] || `Chain ${chainIdNum}`;
  };

  const isTestnet = () => {
    if (!network) return false;
    const chainIdNum = Number(network.chainId);
    const testnets = [11155111, 80001, 97, 421613, 420, 5, 4, 3];
    return testnets.includes(chainIdNum);
  };

  if (!network) return null;

  return (
    <Badge 
      variant="outline" 
      className={`flex items-center gap-1 ${
        isTestnet() 
          ? "bg-yellow-50 text-yellow-700 border-yellow-300" 
          : "bg-green-50 text-green-700 border-green-300"
      }`}
    >
      <Wifi className="size-3" />
      {getNetworkDisplay()}
    </Badge>
  );
}
