import { Link } from "react-router";
import { Claim } from "../context/claims-context";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Clock, TrendingUp, TrendingDown, CheckCircle, XCircle, Users } from "lucide-react";

interface ClaimCardProps {
  claim: Claim;
}

export function ClaimCard({ claim }: ClaimCardProps) {
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

  return (
    <Link to={`/claim/${claim.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-lg leading-tight">{claim.title}</CardTitle>
            <div className="flex-shrink-0">
              {claim.status === "active" ? (
                <Badge variant={isExpired ? "destructive" : "default"}>
                  {isExpired ? "Voting Ended" : "Active"}
                </Badge>
              ) : (
                <Badge variant="outline" className="flex items-center gap-1">
                  {claim.resolution === "true" ? (
                    <>
                      <CheckCircle className="size-3 text-green-600" />
                      <span className="text-green-600">Verified True</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="size-3 text-red-600" />
                      <span className="text-red-600">Marked False</span>
                    </>
                  )}
                </Badge>
              )}
            </div>
          </div>
          <p className="text-sm text-slate-600 mt-2 line-clamp-2">{claim.description}</p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Voting Progress */}
          <div>
            <div className="flex items-center justify-between mb-2 text-sm">
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="size-4" />
                <span>True: {truePercentage.toFixed(1)}%</span>
              </div>
              <div className="flex items-center gap-1 text-red-600">
                <TrendingDown className="size-4" />
                <span>False: {(100 - truePercentage).toFixed(1)}%</span>
              </div>
            </div>
            <Progress value={truePercentage} className="h-2" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-slate-500 text-xs mb-1">Stake</p>
              <p className="font-medium">{claim.stake} POT</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs mb-1">Votes</p>
              <p className="font-medium flex items-center gap-1">
                <Users className="size-3" />
                {claim.votes.length}
              </p>
            </div>
            <div>
              <p className="text-slate-500 text-xs mb-1">
                {claim.status === "active" ? "Time Left" : "Resolved"}
              </p>
              <p className="font-medium flex items-center gap-1">
                <Clock className="size-3" />
                {claim.status === "active"
                  ? `${daysRemaining}d`
                  : new Date(claim.timestamp).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="text-xs text-slate-500">
          <span>Submitted by {claim.submitter.slice(0, 6)}...{claim.submitter.slice(-4)}</span>
        </CardFooter>
      </Card>
    </Link>
  );
}
