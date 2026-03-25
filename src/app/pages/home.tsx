import { useClaims } from "../context/claims-context";
import { ClaimCard } from "../components/claim-card";
import { MetaMaskInfo } from "../components/metamask-info";
import { StorageInfo } from "../components/storage-info";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

export function Home() {
  const { claims } = useClaims();
  const [searchQuery, setSearchQuery] = useState("");

  const activeClaims = claims.filter(claim => claim.status === "active");
  const resolvedClaims = claims.filter(claim => claim.status === "resolved");

  const filterClaims = (claimsList: typeof claims) => {
    if (!searchQuery) return claimsList;
    return claimsList.filter(
      claim =>
        claim.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        claim.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Community Claims</h1>
        <p className="text-slate-600">
          Challenge claims, stake tokens, and vote with reputation-weighted power
        </p>
      </div>

      {/* MetaMask Info */}
      <MetaMaskInfo />

      {/* Storage Info */}
      <StorageInfo />

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search claims..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Claims Tabs */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="active">
            Active Claims ({activeClaims.length})
          </TabsTrigger>
          <TabsTrigger value="resolved">
            Resolved Claims ({resolvedClaims.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <div className="space-y-4">
            {filterClaims(activeClaims).length > 0 ? (
              filterClaims(activeClaims).map(claim => (
                <ClaimCard key={claim.id} claim={claim} />
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
                <p className="text-slate-500">No active claims found</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="resolved">
          <div className="space-y-4">
            {filterClaims(resolvedClaims).length > 0 ? (
              filterClaims(resolvedClaims).map(claim => (
                <ClaimCard key={claim.id} claim={claim} />
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
                <p className="text-slate-500">No resolved claims found</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}