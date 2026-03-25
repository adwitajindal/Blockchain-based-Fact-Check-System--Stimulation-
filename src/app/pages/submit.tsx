import { useState } from "react";
import { useNavigate } from "react-router";
import { useClaims } from "../context/claims-context";
import { useWallet } from "../context/wallet-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { PlusCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "../components/ui/alert";

export function Submit() {
  const navigate = useNavigate();
  const { addClaim } = useClaims();
  const { isConnected, address, balance, updateBalance } = useWallet();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [source, setSource] = useState("");
  const [stake, setStake] = useState("100");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      toast.error("Please connect your wallet to submit a claim");
      return;
    }

    if (!title.trim()) {
      toast.error("Please enter a claim title");
      return;
    }

    if (!description.trim()) {
      toast.error("Please enter a claim description");
      return;
    }

    const stakeAmount = parseInt(stake);
    if (isNaN(stakeAmount) || stakeAmount < 50) {
      toast.error("Minimum stake is 50 POT");
      return;
    }

    if (stakeAmount > balance) {
      toast.error("Insufficient balance");
      return;
    }

    // Add claim
    addClaim({
      title: title.trim(),
      description: description.trim(),
      source: source.trim(),
      submitter: address!,
      stake: stakeAmount,
    });

    // Update balance
    updateBalance(-stakeAmount);

    toast.success("Claim submitted successfully!");
    navigate("/");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Submit New Claim</h1>
        <p className="text-slate-600">
          Challenge an online claim by staking tokens. The community will vote on its truthfulness.
        </p>
      </div>

      {!isConnected ? (
        <Alert>
          <AlertCircle className="size-4" />
          <AlertDescription>
            Please connect your wallet to submit a claim.
          </AlertDescription>
        </Alert>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Claim Details</CardTitle>
            <CardDescription>
              Provide clear information about the claim you want to verify
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Claim Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g., Bitcoin will reach $100,000 by end of 2024"
                  maxLength={200}
                  className="mt-2"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">
                  {title.length}/200 characters
                </p>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Provide context and details about this claim..."
                  rows={5}
                  maxLength={1000}
                  className="mt-2"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">
                  {description.length}/1000 characters
                </p>
              </div>

              <div>
                <Label htmlFor="source">Source URL (Optional)</Label>
                <Input
                  id="source"
                  type="url"
                  value={source}
                  onChange={e => setSource(e.target.value)}
                  placeholder="https://example.com/article"
                  className="mt-2"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Link to the original claim or supporting evidence
                </p>
              </div>

              <div>
                <Label htmlFor="stake">Initial Stake (POT) *</Label>
                <Input
                  id="stake"
                  type="number"
                  min="50"
                  max={balance}
                  value={stake}
                  onChange={e => setStake(e.target.value)}
                  className="mt-2"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">
                  Minimum: 50 POT | Your balance: {balance} POT
                </p>
                <p className="text-xs text-slate-600 mt-2">
                  Your stake will be locked until the claim is resolved. Higher stakes signal confidence.
                </p>
              </div>

              <Alert>
                <AlertCircle className="size-4" />
                <AlertDescription className="text-sm">
                  <strong>Important:</strong> Once submitted, the community will have 7 days to vote on this claim.
                  Your stake will be returned if the claim is resolved in your favor, plus a bonus from losing voters.
                </AlertDescription>
              </Alert>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <PlusCircle className="size-4 mr-2" />
                  Submit Claim
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
