import { RouterProvider } from "react-router";
import { router } from "./routes";
import { WalletProvider } from "./context/wallet-context";
import { ClaimsProvider } from "./context/claims-context";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  return (
    <WalletProvider>
      <ClaimsProvider>
        <RouterProvider router={router} />
        <Toaster />
      </ClaimsProvider>
    </WalletProvider>
  );
}