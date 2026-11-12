import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { apiClient } from '../client';
import { useAuthStore } from '@/store/useAuthStore';

describe('apiClient Interceptors & Refresh Queue', () => {
  beforeEach(() => {
    useAuthStore.getState().clearAuth();
    vi.restoreAllMocks();
  });

  it('automatically attaches in-memory access token and anti-CSRF header via request interceptor', async () => {
    useAuthStore.getState().setAuth(
      {
        id: 1,
        fullName: 'Test Aspirant',
        email: 'test@bloom.com',
        emailVerified: true,
        createdAtUtc: new Date().toISOString(),
      },
      'bearer-token-123'
    );

    const config: any = {
      headers: new axios.AxiosHeaders(),
    };

    const requestInterceptor: any = (apiClient.interceptors.request as any).handlers[0];
    const modifiedConfig = await requestInterceptor.fulfilled(config);

    expect(modifiedConfig.headers.get('Authorization')).toBe('Bearer bearer-token-123');
    expect(modifiedConfig.headers.get('X-CSRF-Protection')).toBe('1');
  });

  it('queues concurrent 401 requests and retries them once silent refresh succeeds', async () => {
    useAuthStore.getState().setAuth(
      {
        id: 1,
        fullName: 'Test Aspirant',
        email: 'test@bloom.com',
        emailVerified: true,
        createdAtUtc: new Date().toISOString(),
      },
      'expired-token'
    );

    let refreshCallCount = 0;
    vi.spyOn(axios, 'post').mockImplementation(async (url: string) => {
      if (url === '/api/v1/auth/refresh') {
        refreshCallCount++;
        return {
          data: {
            success: true,
            data: {
              accessToken: 'brand-new-token-999',
              expiresInMinutes: 15,
            },
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as any,
        };
      }
      return Promise.reject(new Error('Unknown url'));
    });

    const originalAdapter = apiClient.defaults.adapter;
    apiClient.defaults.adapter = async (config) => {
      return {
        data: { success: true, tokenUsed: config.headers?.Authorization || config.headers?.get?.('Authorization') },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    };

    const responseInterceptor: any = (apiClient.interceptors.response as any).handlers[0];

    const error1: any = {
      response: { status: 401 },
      config: { url: '/data/item-1', headers: new axios.AxiosHeaders() },
    };
    const error2: any = {
      response: { status: 401 },
      config: { url: '/data/item-2', headers: new axios.AxiosHeaders() },
    };

    const [res1, res2] = await Promise.all([
      responseInterceptor.rejected(error1),
      responseInterceptor.rejected(error2),
    ]);

    expect(refreshCallCount).toBe(1);
    expect(useAuthStore.getState().accessToken).toBe('brand-new-token-999');
    expect(res1.data.tokenUsed).toBe('Bearer brand-new-token-999');
    expect(res2.data.tokenUsed).toBe('Bearer brand-new-token-999');

    apiClient.defaults.adapter = originalAdapter;
  });
});
