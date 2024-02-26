"use client";
import { FC, ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";

interface ProvidersProps {
  children: ReactNode;
}
const queryClient = new QueryClient();

const Providers: FC<ProvidersProps> = ({ children }) => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-center" reverseOrder={false} />
        {children}
      </QueryClientProvider>
    </>
  );
};

export default Providers;
