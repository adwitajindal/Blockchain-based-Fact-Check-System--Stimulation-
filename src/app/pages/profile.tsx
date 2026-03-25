import { useNavigate } from "react-router";
import { useWallet } from "../context/wallet-context";
import { useClaims } from "../context/claims-context";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import {
  Wallet,
  Trophy,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  Award,
} from "lucide-react";

export function Profile() {
  const navigate = useNavigate();
  const { isConnected, address, balance, reputation, disconnect } = useWallet();
  const { claims } = useClaims();

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <p className="text-slate-600 mb-4">Please connect your wallet to view your profile</p>
        <Button onClick={() => navigate("/")}>Go Home</Button>
      </div>
    );
  }

  // Get user's votes
  const myVotes = claims.flatMap(claim =>
    claim.votes
      .filter(vote => vote.voter === address)
      .map(vote => ({ ...vote, claim }))
  );

  // Get user's submitted claims
  const mySubmissions = claims.filter(claim => claim.submitter === address);

  // Calculate stats
  const totalVotes = myVotes.length;
  const resolvedVotes = myVotes.filter(v => v.claim.status === "resolved");
  const correctVotes = resolvedVotes.filter(v => v.vote === v.claim.resolution);
  const winRate = resolvedVotes.length > 0 ? (correctVotes.length / resolvedVotes.length) * 100 : 0;

  const trueVotes = myVotes.filter(v => v.vote === "true").length;
  const falseVotes = myVotes.filter(v => v.vote === "false").length;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
        <p className="text-slate-600">Track your voting history and reputation</p>
      </div>

      {/* Account Overview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Account Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2 text-slate-600 mb-2">
                <Wallet className="size-4" />
                <span className="text-sm">Wallet Address</span>
              </div>
              <p className="font-mono text-sm">
                {address?.slice(0, 12)}...{address?.slice(-10)}
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <Wallet className="size-4" />
                <span className="text-sm">Balance</span>
              </div>
              <p className="text-2xl font-bold text-blue-700">{balance} POT</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 text-purple-600 mb-2">
                <Trophy className="size-4" />
                <span className="text-sm">Reputation</span>
              </div>
              <p className="text-2xl font-bold text-purple-700">{reputation} REP</p>
            </div>
          </div>

          <Separator />

          <div className="flex justify-end">
            <Button variant="outline" onClick={disconnect}>
              Disconnect Wallet
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Voting Stats */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="size-5" />
            Voting Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <p className="text-2xl font-bold text-slate-900">{totalVotes}</p>
              <p className="text-sm text-slate-600 mt-1">Total Votes</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-700">{correctVotes.length}</p>
              <p className="text-sm text-green-600 mt-1">Correct Votes</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-700">{winRate.toFixed(0)}%</p>
              <p className="text-sm text-blue-600 mt-1">Win Rate</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-700">{mySubmissions.length}</p>
              <p className="text-sm text-purple-600 mt-1">Submitted Claims</p>
            </div>
          </div>

          {totalVotes > 0 && (
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="text-center p-3 border border-slate-200 rounded-lg">
                <div className="flex items-center justify-center gap-2 text-green-600 mb-1">
                  <TrendingUp className="size-4" />
                  <span className="font-medium">True Votes</span>
                </div>
                <p className="text-xl font-bold">{trueVotes}</p>
              </div>
              <div className="text-center p-3 border border-slate-200 rounded-lg">
                <div className="flex items-center justify-center gap-2 text-red-600 mb-1">
                  <TrendingDown className="size-4" />
                  <span className="font-medium">False Votes</span>
                </div>
                <p className="text-xl font-bold">{falseVotes}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Votes */}
      {myVotes.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your Recent Votes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myVotes.slice(0, 5).map(({ vote, stake, claim }) => (
                <div
                  key={vote}
                  className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  onClick={() => navigate(`/claim/${claim.id}`)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-medium mb-1">{claim.title}</p>
                      <div className="flex items-center gap-3 text-sm">
                        <Badge variant={vote === "true" ? "default" : "destructive"}>
                          Voted: {vote === "true" ? "True" : "False"}
                        </Badge>
                        <span className="text-slate-600">Stake: {stake} POT</span>
                        {claim.status === "resolved" && (
                          <div className="flex items-center gap-1">
                            {vote === claim.resolution ? (
                              <>
                                <CheckCircle className="size-4 text-green-600" />
                                <span className="text-green-600 font-medium">Won</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="size-4 text-red-600" />
                                <span className="text-red-600 font-medium">Lost</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submitted Claims */}
      {mySubmissions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Submitted Claims</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mySubmissions.map(claim => (
                <div
                  key={claim.id}
                  className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  onClick={() => navigate(`/claim/${claim.id}`)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-medium mb-1">{claim.title}</p>
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <span>Stake: {claim.stake} POT</span>
                        <span>•</span>
                        <span>{claim.votes.length} votes</span>
                        <span>•</span>
                        <Badge variant={claim.status === "active" ? "default" : "outline"}>
                          {claim.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {myVotes.length === 0 && mySubmissions.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-slate-600 mb-4">You haven't participated in any claims yet</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => navigate("/")}>Browse Claims</Button>
              <Button variant="outline" onClick={() => navigate("/submit")}>
                Submit a Claim
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
