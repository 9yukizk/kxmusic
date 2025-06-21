<<<<<<< HEAD
"use client";

import { QueryClient, QueryClientProvider } from "react-query";
import { MusicProvider } from "@/contexts/MusicContext";
import { ReactNode } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <MusicProvider>{children}</MusicProvider>
    </QueryClientProvider>
  );
}
=======
"use client";

import { QueryClient, QueryClientProvider } from "react-query";
import { MusicProvider } from "@/contexts/MusicContext";
import { ReactNode } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <MusicProvider>{children}</MusicProvider>
    </QueryClientProvider>
  );
}
>>>>>>> 0c5f55189a494bedfad37fe5688daf97b7f48f4a
