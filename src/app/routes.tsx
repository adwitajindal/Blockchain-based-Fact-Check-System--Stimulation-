import { createBrowserRouter } from "react-router";
import { Layout } from "./components/layout";
import { Home } from "./pages/home";
import { ClaimDetail } from "./pages/claim-detail";
import { Submit } from "./pages/submit";
import { Profile } from "./pages/profile";
import { Leaderboard } from "./pages/leaderboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "claim/:id", Component: ClaimDetail },
      { path: "submit", Component: Submit },
      { path: "profile", Component: Profile },
      { path: "leaderboard", Component: Leaderboard },
    ],
  },
]);
