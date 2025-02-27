// src/config.jsx
import { createAppKit } from '@reown/appkit/react';
import { WagmiProvider } from 'wagmi';
import { mainnet, scroll } from '@reown/appkit/networks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import React from 'react';

// 1. Create a Query Client
const queryClient = new QueryClient();

// 2. Your Reown Cloud Project ID
const projectId = '3268c03bffd8e52c1b26452048d2ce4c';

// 3. Optional metadata for verification and branding
const metadata = {
  name: 'My Dapp',
  description: 'A Blockchain Table Banking Savings Dapp',
  url: 'https://chama.com', 
  icons: ['https://ibb.co/gZbByZLZ'],
};

// 4. Define supported networks
const networks = [mainnet, scroll];

// 5. Create a Wagmi adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true, // set to false if not using SSR
});

// 6. Initialize AppKit
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true, // Optional: enables analytics as per your cloud settings
  },
});

// 7. Export a provider component to wrap your app
export function AppKitProvider({ children }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
