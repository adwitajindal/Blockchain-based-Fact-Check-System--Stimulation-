import { useWallet } from "../context/wallet-context";
import { Card, CardContent } from "./ui/card";
import { CheckCircle, XCircle, Wallet, Trophy } from "lucide-react";

export function WalletStatus() {
  const { isConnected, address, balance, reputation } = useWallet();

  if (!isConnected) return null;

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 mb-6">
      <CardContent className="py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-500 rounded-full p-2">
              <CheckCircle className="size-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">Wallet Connected</p>
              <p className="text-xs text-slate-600 font-mono">{address}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Wallet className="size-4 text-slate-600" />
              <div>
                <p className="text-xs text-slate-500">Balance</p>
                <p className="font-bold text-slate-900">{balance} POT</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Trophy className="size-4 text-blue-600" />
              <div>
                <p className="text-xs text-slate-500">Reputation</p>
                <p className="font-bold text-blue-700">{reputation} REP</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
