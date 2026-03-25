import { useClaims } from "../context/claims-context";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Trophy, Medal, Award, TrendingUp } from "lucide-react";

interface LeaderboardEntry {
  address: string;
  reputation: number;
  totalVotes: number;
  correctVotes: number;
  winRate: number;
  totalStaked: number;
}

export function Leaderboard() {
  const { claims } = useClaims();

  // Aggregate user statistics
  const userStats = new Map<string, LeaderboardEntry>();

  claims.forEach(claim => {
    claim.votes.forEach(vote => {
      const existing = userStats.get(vote.voter) || {
        address: vote.voter,
        reputation: vote.reputation,
        totalVotes: 0,
        correctVotes: 0,
        winRate: 0,
        totalStaked: 0,
      };

      existing.totalVotes++;
      existing.totalStaked += vote.stake;
      existing.reputation = Math.max(existing.reputation, vote.reputation);

      if (claim.status === "resolved" && vote.vote === claim.resolution) {
        existing.correctVotes++;
      }

      userStats.set(vote.voter, existing);
    });
  });

  // Calculate win rates and sort
  const leaderboard = Array.from(userStats.values())
    .map(entry => ({
      ...entry,
      winRate: entry.totalVotes > 0 ? (entry.correctVotes / entry.totalVotes) * 100 : 0,
    }))
    .sort((a, b) => b.reputation - a.reputation);

  const getMedalIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="size-5 text-yellow-500" />;
      case 1:
        return <Medal className="size-5 text-slate-400" />;
      case 2:
        return <Award className="size-5 text-amber-600" />;
      default:
        return null;
    }
  };

  const getRankBadge = (index: number) => {
    if (index === 0) return <Badge className="bg-yellow-500">Top Voter</Badge>;
    if (index < 3) return <Badge variant="secondary">Top 3</Badge>;
    if (index < 10) return <Badge variant="outline">Top 10</Badge>;
    return null;
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
        <p className="text-slate-600">
          Top contributors ranked by reputation and voting accuracy
        </p>
      </div>

      {/* Top 3 Spotlight */}
      {leaderboard.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {leaderboard.slice(0, 3).map((entry, index) => (
            <Card
              key={entry.address}
              className={`${
                index === 0
                  ? "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300"
                  : index === 1
                  ? "bg-gradient-to-br from-slate-50 to-slate-100 border-slate-300"
                  : "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-300"
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getMedalIcon(index)}
                    <span className="font-bold text-lg">#{index + 1}</span>
                  </div>
                  {getRankBadge(index)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="font-mono text-sm mb-4 text-slate-700">
                  {entry.address.slice(0, 8)}...{entry.address.slice(-6)}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Reputation</span>
                    <span className="font-bold text-lg">{entry.reputation}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Win Rate</span>
                    <span className="font-medium">{entry.winRate.toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Total Votes</span>
                    <span className="font-medium">{entry.totalVotes}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Full Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="size-5" />
            All Voters
          </CardTitle>
        </CardHeader>
        <CardContent>
          {leaderboard.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600">No voting activity yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                      Rank
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                      Address
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-600">
                      Reputation
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-600">
                      Votes
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-600">
                      Win Rate
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-600">
                      Total Staked
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => (
                    <tr
                      key={entry.address}
                      className={`border-b border-slate-100 hover:bg-slate-50 ${
                        index < 3 ? "bg-slate-50/50" : ""
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {getMedalIcon(index)}
                          <span className="font-medium">#{index + 1}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm">
                          {entry.address.slice(0, 10)}...{entry.address.slice(-8)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-bold text-blue-600">{entry.reputation}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-slate-900">{entry.totalVotes}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Badge
                          variant={
                            entry.winRate >= 70
                              ? "default"
                              : entry.winRate >= 50
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {entry.winRate.toFixed(0)}%
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-slate-900">{entry.totalStaked} POT</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Section */}
      <Card className="mt-6 bg-blue-50 border-blue-200">
        <CardContent className="py-6">
          <h3 className="font-medium mb-2 text-blue-900">How Reputation Works</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Earn +10 reputation for correct votes on resolved claims</li>
            <li>• Lose -5 reputation for incorrect votes on resolved claims</li>
            <li>• Higher reputation increases your voting power (Weight = Stake × (1 + Rep/100))</li>
            <li>• Build your reputation to have more influence in the community</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
