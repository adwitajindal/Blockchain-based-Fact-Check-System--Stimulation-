import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type VoteType = "true" | "false";

export interface Vote {
  id: string;
  claimId: string;
  voter: string;
  vote: VoteType;
  stake: number;
  reputation: number;
  timestamp: number;
}

export interface Claim {
  id: string;
  title: string;
  description: string;
  source: string;
  submitter: string;
  stake: number;
  timestamp: number;
  votes: Vote[];
  status: "active" | "resolved";
  resolution?: VoteType;
  deadline: number;
}

interface ClaimsContextType {
  claims: Claim[];
  addClaim: (claim: Omit<Claim, "id" | "votes" | "status" | "timestamp" | "deadline">) => void;
  addVote: (claimId: string, vote: Omit<Vote, "id" | "timestamp">) => void;
  resolveClaim: (claimId: string) => void;
  getClaim: (id: string) => Claim | undefined;
}

const ClaimsContext = createContext<ClaimsContextType | undefined>(undefined);

// Default claims for new users
const defaultClaims: Claim[] = [
  {
    id: "1",
    title: "Bitcoin will reach $100,000 by end of 2024",
    description: "According to market analysts and historical trends, Bitcoin is expected to reach $100,000 by the end of 2024.",
    source: "https://example.com/bitcoin-prediction",
    submitter: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    stake: 500,
    timestamp: Date.now() - 86400000 * 5,
    deadline: Date.now() + 86400000 * 2,
    votes: [
      {
        id: "v1",
        claimId: "1",
        voter: "0x123...",
        vote: "true",
        stake: 200,
        reputation: 150,
        timestamp: Date.now() - 86400000 * 4,
      },
      {
        id: "v2",
        claimId: "1",
        voter: "0x456...",
        vote: "false",
        stake: 150,
        reputation: 120,
        timestamp: Date.now() - 86400000 * 3,
      },
    ],
    status: "active",
  },
  {
    id: "2",
    title: "Climate change will cause sea levels to rise 2 meters by 2100",
    description: "Scientific research suggests that global sea levels could rise by 2 meters by the end of the century due to climate change.",
    source: "https://example.com/climate-report",
    submitter: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
    stake: 750,
    timestamp: Date.now() - 86400000 * 3,
    deadline: Date.now() + 86400000 * 4,
    votes: [],
    status: "active",
  },
  {
    id: "3",
    title: "AI will surpass human intelligence by 2030",
    description: "Leading AI researchers predict that artificial general intelligence (AGI) will surpass human intelligence within this decade.",
    source: "https://example.com/ai-prediction",
    submitter: "0x9f2Df0FeD2c77648dE5860a4cC508Cd0818c85b8",
    stake: 300,
    timestamp: Date.now() - 86400000 * 7,
    deadline: Date.now() - 86400000 * 1,
    votes: [
      {
        id: "v3",
        claimId: "3",
        voter: "0x789...",
        vote: "false",
        stake: 400,
        reputation: 200,
        timestamp: Date.now() - 86400000 * 6,
      },
      {
        id: "v4",
        claimId: "3",
        voter: "0xabc...",
        vote: "false",
        stake: 250,
        reputation: 180,
        timestamp: Date.now() - 86400000 * 5,
      },
    ],
    status: "resolved",
    resolution: "false",
  },
];

export function ClaimsProvider({ children }: { children: ReactNode }) {
  const [claims, setClaims] = useState<Claim[]>([]);

  // Load claims from localStorage on mount
  useEffect(() => {
    loadClaims();
  }, []);

  // Save claims to localStorage whenever they change
  useEffect(() => {
    if (claims.length > 0) {
      saveClaims(claims);
    }
  }, [claims]);

  const loadClaims = () => {
    try {
      const stored = localStorage.getItem('claims_data');
      if (stored) {
        const data = JSON.parse(stored);
        setClaims(data);
      } else {
        // First time - use default claims
        setClaims(defaultClaims);
      }
    } catch (error) {
      console.error("Error loading claims:", error);
      setClaims(defaultClaims);
    }
  };

  const saveClaims = (claimsData: Claim[]) => {
    try {
      localStorage.setItem('claims_data', JSON.stringify(claimsData));
    } catch (error) {
      console.error("Error saving claims:", error);
    }
  };

  const addClaim = (claim: Omit<Claim, "id" | "votes" | "status" | "timestamp" | "deadline">) => {
    const newClaim: Claim = {
      ...claim,
      id: Date.now().toString(),
      votes: [],
      status: "active",
      timestamp: Date.now(),
      deadline: Date.now() + 86400000 * 7, // 7 days
    };
    setClaims(prev => [newClaim, ...prev]);
  };

  const addVote = (claimId: string, vote: Omit<Vote, "id" | "timestamp">) => {
    setClaims(prev =>
      prev.map(claim => {
        if (claim.id === claimId) {
          const newVote: Vote = {
            ...vote,
            id: Date.now().toString(),
            timestamp: Date.now(),
          };
          return {
            ...claim,
            votes: [...claim.votes, newVote],
          };
        }
        return claim;
      })
    );
  };

  const resolveClaim = (claimId: string) => {
    setClaims(prev =>
      prev.map(claim => {
        if (claim.id === claimId && claim.status === "active") {
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

          const resolution: VoteType = trueWeight > falseWeight ? "true" : "false";

          return {
            ...claim,
            status: "resolved" as const,
            resolution,
          };
        }
        return claim;
      })
    );
  };

  const getClaim = (id: string) => {
    return claims.find(claim => claim.id === id);
  };

  return (
    <ClaimsContext.Provider value={{ claims, addClaim, addVote, resolveClaim, getClaim }}>
      {children}
    </ClaimsContext.Provider>
  );
}

export function useClaims() {
  const context = useContext(ClaimsContext);
  if (context === undefined) {
    throw new Error("useClaims must be used within a ClaimsProvider");
  }
  return context;
}