"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { PRIVY_APP_ID, isPrivyConfigured } from "@/lib/env";

export function Providers({ children }: { children: React.ReactNode }) {
  if (!isPrivyConfigured()) {
    return <>{children}</>;
  }

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        loginMethods: ["email", "sms"],
        appearance: {
          theme: "light",
          accentColor: "#1f6f4a",
          logo: undefined,
        },
        embeddedWallets: {
          ethereum: { createOnLogin: "off" },
          solana: { createOnLogin: "off" },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
