import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { BrowserProvider } from "ethers";
import { toast } from "sonner";

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  balance: number;
  reputation: number;
  connect: () => Promise<void>;
  disconnect: () => void;
  updateBalance: (amount: number) => void;
  updateReputation: (amount: number) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Declare ethereum on window object
declare global {
  interface Window {
    ethereum?: any;
  }
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState(1000);
  const [reputation, setReputation] = useState(100);

  // Load wallet data from localStorage when address changes
  useEffect(() => {
    if (address) {
      loadWalletData(address);
    }
  }, [address]);

  // Save wallet data to localStorage whenever balance or reputation changes
  useEffect(() => {
    if (address) {
      saveWalletData(address, balance, reputation);
    }
  }, [address, balance, reputation]);

  const loadWalletData = (walletAddress: string) => {
    try {
      const stored = localStorage.getItem(`wallet_${walletAddress}`);
      if (stored) {
        const data = JSON.parse(stored);
        setBalance(data.balance || 1000);
        setReputation(data.reputation || 100);
      } else {
        // First time connecting this wallet - set defaults
        setBalance(1000);
        setReputation(100);
      }
    } catch (error) {
      console.error("Error loading wallet data:", error);
      setBalance(1000);
      setReputation(100);
    }
  };

  const saveWalletData = (walletAddress: string, balance: number, reputation: number) => {
    try {
      const data = { balance, reputation };
      localStorage.setItem(`wallet_${walletAddress}`, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving wallet data:", error);
    }
  };

  // Check if wallet is already connected on mount
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
          window.ethereum.removeListener("chainChanged", handleChainChanged);
        }
      };
    }
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) return;

      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();

      if (accounts.length > 0) {
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAddress(address);
        setIsConnected(true);
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected their wallet
      disconnect();
      toast.info("Wallet disconnected");
    } else {
      // User switched accounts
      setAddress(accounts[0]);
      setIsConnected(true);
      toast.success("Account switched");
    }
  };

  const handleChainChanged = () => {
    // Reload the page when chain changes
    window.location.reload();
  };

  const connect = async () => {
    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        toast.error("MetaMask is not installed. Please install MetaMask to continue.");
        window.open("https://metamask.io/download/", "_blank");
        return;
      }

      // Request account access
      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      setAddress(userAddress);
      setIsConnected(true);
      toast.success("Wallet connected successfully!");

    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      
      if (error.code === 4001) {
        // User rejected the connection
        toast.error("Connection rejected. Please approve the connection in MetaMask.");
      } else {
        toast.error("Failed to connect wallet. Please try again.");
      }
    }
  };

  const disconnect = () => {
    setAddress(null);
    setIsConnected(false);
    toast.info("Wallet disconnected");
  };

  const updateBalance = (amount: number) => {
    setBalance(prev => prev + amount);
  };

  const updateReputation = (amount: number) => {
    setReputation(prev => Math.max(0, prev + amount));
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address,
        balance,
        reputation,
        connect,
        disconnect,
        updateBalance,
        updateReputation,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}