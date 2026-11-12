import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, MemoryRouterProps } from 'react-router-dom';

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

interface WrapperProps {
  children: React.ReactNode;
  routerInitialEntries?: MemoryRouterProps['initialEntries'];
  queryClient?: QueryClient;
}

export function AllTheProviders({
  children,
  routerInitialEntries = ['/'],
  queryClient = createTestQueryClient(),
}: WrapperProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={routerInitialEntries}>
        {children}
      </MemoryRouter>
    </QueryClientProvider>
  );
}

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & {
    initialEntries?: MemoryRouterProps['initialEntries'];
    queryClient?: QueryClient;
  }
) {
  const queryClient = options?.queryClient || createTestQueryClient();
  const initialEntries = options?.initialEntries || ['/'];

  return {
    queryClient,
    ...render(ui, {
      wrapper: ({ children }) => (
        <AllTheProviders routerInitialEntries={initialEntries} queryClient={queryClient}>
          {children}
        </AllTheProviders>
      ),
      ...options,
    }),
  };
}

