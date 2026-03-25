import { Outlet, Link, useLocation } from "react-router";
import { useWallet } from "../context/wallet-context";
import { Button } from "./ui/button";
import { Shield, Wallet, User, Trophy, PlusCircle } from "lucide-react";
import { Badge } from "./ui/badge";
import { NetworkBadge } from "./network-badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export function Layout() {
  const { isConnected, address, balance, reputation, connect, disconnect } = useWallet();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Shield className="size-8 text-blue-600" />
              <div>
                <h1 className="font-bold text-xl text-slate-900">Proof of Truth</h1>
                <p className="text-xs text-slate-600">Decentralized Fact Verification</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className={`text-sm ${
                  isActive("/") && !isActive("/claim")
                    ? "text-blue-600 font-medium"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Claims
              </Link>
              <Link
                to="/submit"
                className={`text-sm ${
                  isActive("/submit") ? "text-blue-600 font-medium" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Submit Claim
              </Link>
              <Link
                to="/leaderboard"
                className={`text-sm ${
                  isActive("/leaderboard") ? "text-blue-600 font-medium" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Leaderboard
              </Link>
              {isConnected && (
                <Link
                  to="/profile"
                  className={`text-sm ${
                    isActive("/profile") ? "text-blue-600 font-medium" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Profile
                </Link>
              )}
            </nav>

            <div className="flex items-center gap-3">
              {isConnected ? (
                <>
                  <div className="hidden sm:flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-lg">
                    <Wallet className="size-4 text-slate-600" />
                    <span className="text-sm font-medium">{balance} POT</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
                    <Trophy className="size-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">{reputation} REP</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={disconnect}
                    className="hidden md:flex"
                  >
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </Button>
                  <Link to="/profile" className="md:hidden">
                    <Button variant="outline" size="icon">
                      <User className="size-4" />
                    </Button>
                  </Link>
                </>
              ) : (
                <Button onClick={connect} className="bg-blue-600 hover:bg-blue-700">
                  <Wallet className="size-4 mr-2" />
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav className="md:hidden flex items-center gap-4 mt-4 overflow-x-auto pb-2">
            <Link to="/">
              <Badge variant={isActive("/") && !isActive("/claim") ? "default" : "outline"}>
                Claims
              </Badge>
            </Link>
            <Link to="/submit">
              <Badge variant={isActive("/submit") ? "default" : "outline"}>
                <PlusCircle className="size-3 mr-1" />
                Submit
              </Badge>
            </Link>
            <Link to="/leaderboard">
              <Badge variant={isActive("/leaderboard") ? "default" : "outline"}>
                <Trophy className="size-3 mr-1" />
                Leaderboard
              </Badge>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-slate-600">
          <p>
            Proof of Truth - A decentralized platform for community-driven fact verification
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Demo Mode - Transactions are simulated
          </p>
        </div>
      </footer>
    </div>
  );
}