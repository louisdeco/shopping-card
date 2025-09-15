import { describe, vi, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import  useFetch  from './useFetch';
import { safeFetchWithRetry } from '../utils/api';
import { use } from 'react';

// Mock
vi.mock('../utils/api.js', () => ({
    safeFetchWithRetry: vi.fn()
}));

describe('useFetch', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('state management & transitions', () => {
        it('should initialize with the proper state', () => {
            vi.mocked(safeFetchWithRetry).mockImplementation(() => {
                return new Promise(() => {})
            })

            const { result } = renderHook(() => useFetch('PRODUCTS'));

            expect(result.current.data).toBeNull();
            expect(result.current.error).toBeNull();
            expect(result.current.loading).toBe(true);
        });

        it('should transition from loading to success state', async () => {
            // Mock a successful API response
            const mockData = { id: 1, title: 'Test Product' }
            vi.mocked(safeFetchWithRetry).mockResolvedValue({
                success: true,
                data: mockData
            });

            const { result } = renderHook(() => useFetch('PRODUCTS'));
            
            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(result.current.data).toStrictEqual(mockData);
            expect(result.current.loading).toBe(false);
            expect(result.current.error).toBe(null);
        });

        it('should transition from loading to error state', async () => {
            // Mock API failure
            vi.mocked(safeFetchWithRetry).mockResolvedValue({
                success: false,
                error: 'Network Error',
            });

            const { result } = renderHook(() => useFetch('PRODUCTS'));

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(result.current.data).toBe(null);
            expect(result.current.loading).toBe(false);
            expect(result.current.error).toBe('Network Error');
        });

        it('should handle unexpected errors', async () => {
            vi.mocked(safeFetchWithRetry).mockRejectedValue(
                new Error('Something happened')
            );

            const { result } = renderHook(() => useFetch('PRODUCTS'));

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });
            
            expect(result.current.data).toBe(null);
            // expect(result.current.loading).toBe(false);
            expect(result.current.error).toBe('Something went wrong. Please try again');
        });

        it('should handle abort error gracefully', async () => {
            const abortError = new DOMException('The operation was aborted', 'AbortError');
            vi.mocked(safeFetchWithRetry).mockRejectedValue(abortError);

            const { result } = renderHook(() => useFetch('PRODUCTS'));

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(result.current.data).toBe(null);
            expect(result.current.loading).toBe(false);
            expect(result.current.error).toBe(null);
        });
    });

    describe('react lifecycle integration', () => {
        it('should fetch on mount', async () => {
            vi.mocked(safeFetchWithRetry).mockImplementation(() => {
                return new Promise(() => {})
            })
            const { result } = renderHook(() => useFetch('PRODUCTS'));


            expect(safeFetchWithRetry).toHaveBeenCalledTimes(1);
            expect(safeFetchWithRetry).toHaveBeenCalledWith('PRODUCTS', { signal: expect.any(AbortSignal) });
        });

        it('should clean up properly on unmount', () => {
            let abortSignal;
            vi.mocked(safeFetchWithRetry).mockImplementation((endPoint, options) => {
                abortSignal = options.signal;
                return new Promise(() => {});
            })
            const { unmount } = renderHook(() => useFetch('PRODUCTS'));

            unmount();
            
            expect(abortSignal.aborted).toBe(true);
        });

        it('should handle dependency changes correctly', async () => {
            const mockData1 = { id: 1, title: 'Test Product' };
            const mockData2 = { id: 1, title: 'Dependency Changed!' };

            vi.mocked(safeFetchWithRetry).mockResolvedValueOnce({
                success: true,
                data: mockData1
            }).mockResolvedValueOnce({
                success: true,
                data: mockData2
            });

            const { result, rerender } = renderHook(
                ({ endpoint }) => useFetch(endpoint),
                { initialProps: { endpoint: 'PRODUCTS' } }
            );

            // First fetch should be PRODUCTS
            expect(safeFetchWithRetry).toHaveBeenNthCalledWith(1, 'PRODUCTS', {
                signal: expect.any(AbortSignal)
            });

            rerender({ endpoint: 'CATEGORIES' });

            // Second fetch should be CATEGORIES
            expect(safeFetchWithRetry).toHaveBeenNthCalledWith(2, 'CATEGORIES', {
                signal: expect.any(AbortSignal)
            });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(result.current.data).toStrictEqual(mockData2);
            expect(result.current.loading).toBe(false);
            expect(result.current.error).toBe(null);
        });
    });

    describe('hook interfaces', () => {
        it('returns the expected shape', () => {
            vi.mocked(safeFetchWithRetry).mockImplementation(() => {
                return new Promise(() => {});
            });

            const { result } = renderHook(() => useFetch('PRODUCTS'));

            expect(result.current).toHaveProperty('data');
            expect(result.current).toHaveProperty('loading');
            expect(result.current).toHaveProperty('error');

            expect(result.current.data === null || typeof result.current.data === 'object').toBe(true);
            expect(result.current.error === null || typeof result.current.data === 'string').toBe(true);
            expect(typeof result.current.loading).toBe('boolean');
        });

        it('provides consistent interfaces across all states', async () => {
            // Loading state
            vi.mocked(safeFetchWithRetry).mockImplementation(() => {
                return new Promise(() => {});
            });

            const { result, rerender } = renderHook(
                ({ endpoint }) => useFetch(endpoint),
                { initialProps: { endpoint: 'PRODUCTS' } }
            );

            expect(result.current).toEqual({
                data: null,
                error: null,
                loading: true
            });

            // Data state
            const mockData = { id: 1, title: 'Test' };
            vi.mocked(safeFetchWithRetry).mockResolvedValue({
                success: true,
                data: mockData
            }),

            rerender({ endpoint: 'CATEGORIES' });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(result.current).toEqual({
                data: mockData,
                error: null,
                loading: false
            });

            // Error state
            vi.mocked(safeFetchWithRetry).mockResolvedValue({
                success: false,
                error: 'Test error'
            });

            rerender({ endpoint: 'PRODUCTS' });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(result.current).toEqual({
                data: null,
                error: 'Test error',
                loading: false
            });
        });

        it('never returns undefined properties', () => {
            vi.mocked(safeFetchWithRetry).mockImplementation(() => {
                return new Promise(() => {});
            });

            const { result } = renderHook(() => useFetch('PRODUCTS'));

            expect(result.current.data).not.toBe(undefined);
            expect(result.current.loading).not.toBe(undefined);
            expect(result.current.error).not.toBe(undefined);
        });
    });
});
