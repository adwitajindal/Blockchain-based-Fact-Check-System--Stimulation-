import { useParams, useNavigate } from "react-router";
import { useClaims } from "../context/claims-context";
import { useWallet } from "../context/wallet-context";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Separator } from "../components/ui/separator";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Clock,
  ExternalLink,
  Vote,
  Trophy,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ClaimDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getClaim, addVote, resolveClaim } = useClaims();
  const { isConnected, address, balance, reputation, updateBalance, updateReputation } = useWallet();
  const [stakeAmount, setStakeAmount] = useState("100");
  const [selectedVote, setSelectedVote] = useState<"true" | "false" | null>(null);

  const claim = getClaim(id || "");

  if (!claim) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <p className="text-slate-600">Claim not found</p>
        <Button onClick={() => navigate("/")} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  const now = Date.now();
  const timeRemaining = claim.deadline - now;
  const isExpired = timeRemaining <= 0;
  const daysRemaining = Math.max(0, Math.ceil(timeRemaining / (1000 * 60 * 60 * 24)));

  // Calculate reputation-weighted votes
  let trueWeight = 0;
  let falseWeight = 0;

  claim.votes.forEach(vote => {
    const weight = vote.stake * (1 + vote.reputation / 100);
    if (vote.vote === "true") {
      trueWeight += weight;
    } else {
      falseWeight += weight;
    }
  });

  const totalWeight = trueWeight + falseWeight;
  const truePercentage = totalWeight > 0 ? (trueWeight / totalWeight) * 100 : 50;

  const hasVoted = claim.votes.some(vote => vote.voter === address);

  const handleVote = () => {
    if (!isConnected) {
      toast.error("Please connect your wallet to vote");
      return;
    }

    if (!selectedVote) {
      toast.error("Please select True or False");
      return;
    }

    const stake = parseInt(stakeAmount);
    if (isNaN(stake) || stake <= 0) {
      toast.error("Please enter a valid stake amount");
      return;
    }

    if (stake > balance) {
      toast.error("Insufficient balance");
      return;
    }

    if (hasVoted) {
      toast.error("You have already voted on this claim");
      return;
    }

    if (isExpired && claim.status === "active") {
      toast.error("Voting period has ended");
      return;
    }

    // Add vote
    addVote(claim.id, {
      claimId: claim.id,
      voter: address!,
      vote: selectedVote,
      stake,
      reputation,
    });

    // Update balance
    updateBalance(-stake);

    toast.success("Vote submitted successfully!");
    setStakeAmount("100");
    setSelectedVote(null);
  };

  const handleResolve = () => {
    if (claim.status === "resolved") {
      toast.error("Claim already resolved");
      return;
    }

    if (!isExpired) {
      toast.error("Voting period has not ended yet");
      return;
    }

    resolveClaim(claim.id);
    toast.success("Claim resolved!");

    // Distribute rewards (simplified)
    const winningVote = trueWeight > falseWeight ? "true" : "false";
    const myVote = claim.votes.find(v => v.voter === address);

    if (myVote && myVote.vote === winningVote) {
      const reward = Math.floor(myVote.stake * 1.5);
      updateBalance(reward);
      updateReputation(10);
      toast.success(`You earned ${reward} POT and 10 REP!`);
    } else if (myVote) {
      updateReputation(-5);
      toast.info("Your vote was incorrect. -5 REP");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Button
        variant="ghost"
        onClick={() => navigate("/")}
        className="mb-6"
      >
        <ArrowLeft className="size-4 mr-2" />
        Back to Claims
      </Button>

      <div className="grid gap-6">
        {/* Claim Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4 mb-4">
              <CardTitle className="text-2xl">{claim.title}</CardTitle>
              <div className="flex-shrink-0">
                {claim.status === "active" ? (
                  <Badge variant={isExpired ? "destructive" : "default"} className="text-sm">
                    {isExpired ? "Voting Ended" : "Active"}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="flex items-center gap-1 text-sm">
                    {claim.resolution === "true" ? (
                      <>
                        <CheckCircle className="size-4 text-green-600" />
                        <span className="text-green-600">Verified True</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="size-4 text-red-600" />
                        <span className="text-red-600">Marked False</span>
                      </>
                    )}
                  </Badge>
                )}
              </div>
            </div>
            <CardDescription className="text-base">{claim.description}</CardDescription>

            {claim.source && (
              <a
                href={claim.source}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-4"
              >
                View Source <ExternalLink className="size-3" />
              </a>
            )}
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-slate-500 mb-1">Submitter Stake</p>
                <p className="font-medium">{claim.stake} POT</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Total Votes</p>
                <p className="font-medium">{claim.votes.length}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">
                  {claim.status === "active" ? "Time Remaining" : "Resolved On"}
                </p>
                <p className="font-medium flex items-center gap-1">
                  <Clock className="size-4" />
                  {claim.status === "active"
                    ? `${daysRemaining} days`
                    : new Date(claim.timestamp).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Submitted By</p>
                <p className="font-medium text-xs">
                  {claim.submitter.slice(0, 6)}...{claim.submitter.slice(-4)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Voting Results */}
        <Card>
          <CardHeader>
            <CardTitle>Reputation-Weighted Voting Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-green-600">
                  <TrendingUp className="size-5" />
                  <span className="font-medium">True</span>
                  <Badge variant="outline">{truePercentage.toFixed(1)}%</Badge>
                </div>
                <div className="flex items-center gap-2 text-red-600">
                  <span className="font-medium">False</span>
                  <TrendingDown className="size-5" />
                  <Badge variant="outline">{(100 - truePercentage).toFixed(1)}%</Badge>
                </div>
              </div>
              <Progress value={truePercentage} className="h-3" />
              <p className="text-xs text-slate-500 mt-2">
                Votes are weighted by: Stake × (1 + Reputation/100)
              </p>
            </div>

            {claim.votes.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium mb-3">Vote Breakdown</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {claim.votes.map(vote => {
                      const weight = vote.stake * (1 + vote.reputation / 100);
                      return (
                        <div
                          key={vote.id}
                          className="flex items-center justify-between p-3 bg-slate-50 rounded-lg text-sm"
                        >
                          <div className="flex items-center gap-3">
                            <Badge
                              variant={vote.vote === "true" ? "default" : "destructive"}
                              className="min-w-16 justify-center"
                            >
                              {vote.vote === "true" ? "True" : "False"}
                            </Badge>
                            <span className="text-xs text-slate-600">
                              {vote.voter.slice(0, 6)}...{vote.voter.slice(-4)}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-slate-600">
                              {vote.stake} POT
                            </span>
                            <div className="flex items-center gap-1 text-blue-600">
                              <Trophy className="size-3" />
                              <span>{vote.reputation}</span>
                            </div>
                            <span className="font-medium text-slate-900">
                              Weight: {weight.toFixed(0)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Voting Interface */}
        {claim.status === "active" && !hasVoted && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Vote className="size-5" />
                Cast Your Vote
              </CardTitle>
              <CardDescription>
                Stake tokens to vote. Higher reputation increases your voting power.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isConnected ? (
                <div className="text-center py-8">
                  <p className="text-slate-600 mb-4">Connect your wallet to participate</p>
                </div>
              ) : (
                <>
                  <div>
                    <Label htmlFor="vote-choice">Your Vote</Label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <Button
                        variant={selectedVote === "true" ? "default" : "outline"}
                        onClick={() => setSelectedVote("true")}
                        className={selectedVote === "true" ? "bg-green-600 hover:bg-green-700" : ""}
                      >
                        <TrendingUp className="size-4 mr-2" />
                        True
                      </Button>
                      <Button
                        variant={selectedVote === "false" ? "default" : "outline"}
                        onClick={() => setSelectedVote("false")}
                        className={selectedVote === "false" ? "bg-red-600 hover:bg-red-700" : ""}
                      >
                        <TrendingDown className="size-4 mr-2" />
                        False
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="stake-amount">Stake Amount (POT)</Label>
                    <Input
                      id="stake-amount"
                      type="number"
                      min="1"
                      max={balance}
                      value={stakeAmount}
                      onChange={e => setStakeAmount(e.target.value)}
                      className="mt-2"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Your balance: {balance} POT | Your reputation: {reputation} REP
                    </p>
                    <p className="text-xs text-slate-600 mt-2">
                      Your voting power: {(parseInt(stakeAmount || "0") * (1 + reputation / 100)).toFixed(0)}
                    </p>
                  </div>

                  <Button
                    onClick={handleVote}
                    disabled={!selectedVote || isExpired}
                    className="w-full"
                  >
                    Submit Vote
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Already Voted */}
        {hasVoted && claim.status === "active" && (
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <CheckCircle className="size-12 text-green-600 mx-auto mb-3" />
                <h3 className="font-medium mb-2">You've already voted on this claim</h3>
                <p className="text-sm text-slate-600">
                  Your vote has been recorded and your tokens are staked.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resolve Button */}
        {isExpired && claim.status === "active" && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="py-6">
              <div className="text-center">
                <h3 className="font-medium mb-2">Voting period has ended</h3>
                <p className="text-sm text-slate-600 mb-4">
                  This claim is ready to be resolved based on the community vote.
                </p>
                <Button onClick={handleResolve} className="bg-blue-600 hover:bg-blue-700">
                  Resolve Claim
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
