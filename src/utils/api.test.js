import { describe, vi, it, expect, beforeEach, afterEach } from 'vitest';
import { baseFetch, fetchResource, fetchSingleResource, withErrorHandling, withRetry } from './api';

// Constants
vi.mock('../constants', () => ({
    API_BASE_URL: 'https://api.test.com',
    ENDPOINTS : {
        PRODUCTS: '/products',
        CATEGORIES: '/categories'
    }
}));

// Mock global fetch
global.fetch = vi.fn();

describe('api', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    })

    describe('baseFetch', () => {

        it('should fetch and return data successfully', async () => {
            // Set up data returned by fetch
            const mockData = { id: 1, title: 'Test Product'};
            vi.mocked(fetch).mockResolvedValue({
                ok: true,
                json: vi.fn().mockResolvedValue(mockData)
            });

            const result = await baseFetch('https://api.test.com/products');

            expect(fetch).toHaveBeenCalledTimes(1);
            expect(fetch).toHaveBeenCalledWith('https://api.test.com/products', { signal: expect.any(AbortSignal) });
            expect(result).toEqual(mockData);
        });

        it('should pass abort signal to fetch', async () => {
            vi.mocked(fetch).mockResolvedValue({
                ok: true,
                json: vi.fn().mockResolvedValue({})
            });

            const result = await baseFetch('https://api.test.com/products');

            expect(fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({signal: expect.any(AbortSignal)})
            )
        });

        it('should throw error when response is not ok', async () => {
            // Set up HTTP error returned by fetch
            vi.mocked(fetch).mockResolvedValue({
                ok: false,
                status: 404,
                text: vi.fn().mockResolvedValue('Not Found')
            });
            // expect(asyncFn).reject: "wait for this Promise to reject, then test the rejection"
            await expect(baseFetch('https://api.test.com/products')).rejects.toThrow('HTTP 404: Not Found');
        });

        it('should handle network errors', async () => {
            vi.mocked(fetch).mockRejectedValue(new Error('Network error'));
            await expect(baseFetch('https://api.test.com/products')).rejects.toThrow('Network error');
        });

        it('should throw when response is not valid JSON', async() => {
            vi.mocked(fetch).mockResolvedValue({
                ok: true,
                json: vi.fn().mockRejectedValue(new SyntaxError('Unexpected token < in JSON'))
            });

            await expect(baseFetch('https://api.test.com/products')).rejects.toThrow('Unexpected token < in JSON')
        });

        it('should respect default timeout', async () => {
            vi.mocked(fetch).mockImplementation((url, options) => {
                return new Promise((resolve, reject) => {
                    if (options?.signal) {
                        options.signal.addEventListener('abort', () => {
                            reject(new DOMException('The operation was aborted', 'AbortError'));
                        })
                    }
                })
            });

            const promise = baseFetch('https://api.test.com/products');
            const expectation = expect(promise).rejects.toThrow('The operation was aborted');
            await vi.advanceTimersByTimeAsync(5001);
            await expectation;
        });

        it('should respect custom timeout', async () => {
            vi.mocked(fetch).mockImplementation((url, options) => {
                return new Promise((resolve, reject) => {
                    if (options?.signal) {
                        options.signal.addEventListener('abort', () => {
                            reject(new DOMException('The operation was aborted', 'AbortError'));
                        })
                    }
                })
            });

            const promise = baseFetch('https://api.test.com/products', { timeout: 2000 });
            const expectation = expect(promise).rejects.toThrow();

            await vi.advanceTimersByTimeAsync(2001);
            await expectation;
        });

        it('should use external signal when provided', async () => {
            let capturedSignal;
            const externalController = new AbortController();
            vi.mocked(fetch).mockImplementation((url, options) => {
                capturedSignal = options.signal;
                return new Promise((resolve, reject) => {
                    resolve({
                        ok: true,
                        json: vi.fn().mockResolvedValue({})
                    });
                });
            });

            await baseFetch('https://api.test.com/products', { signal: externalController.signal });
            
            // It should be a different signal, a mixed
            expect(capturedSignal).not.toBe(externalController.signal);
            expect(capturedSignal).toBeInstanceOf(AbortSignal);
        });

        it('should cancel request when external signal is aborted', async () => {
            const externalController = new AbortController;

            vi.mocked(fetch).mockImplementation((url, options) => {
                return new Promise((resolve, reject) => {
                    if (options?.signal) {
                        options.signal.addEventListener('abort', () => {
                            reject(new DOMException('The operation was aborted', 'AbortError'));
                        });
                    }
                });
            });

            const promise = baseFetch('https://api.test.com/products', { signal: externalController.signal });
            externalController.abort();
            await expect(promise).rejects.toThrow('The operation was aborted')
        });
    });

    describe('fetchResource', () => {
        it('should construct correct URL for collection endpoint', async () => {
            vi.mocked(fetch).mockResolvedValue({
                ok: true,
                json: vi.fn().mockResolvedValue({ data: [] })
            });

            await fetchResource('PRODUCTS');

            expect(fetch).toHaveBeenCalledWith('https://api.test.com/products/?page=1&perPage=30', { signal: expect.any(AbortSignal) })
        });
    });

    describe('fetchSingleResource', () => {
        it('should construct correct URL for collection endpoint', async () => {
            vi.mocked(fetch).mockResolvedValue({
                ok: true,
                json: vi.fn().mockResolvedValue({ data: [] })
            });

            await fetchSingleResource('PRODUCTS', '1');

            expect(fetch).toHaveBeenCalledWith('https://api.test.com/products/1', { signal: expect.any(AbortSignal) })
        });
    })

    describe('withRetry', () => {
        let mockAsyncFn;
        mockAsyncFn = vi.fn();

        it('should return result on first successful attempt', async () => {
            mockAsyncFn.mockResolvedValue('success');
            const retryAsyncFn = withRetry(mockAsyncFn);

            const result = await retryAsyncFn('arg1', 'arg2');

            expect(result).toBe('success')
            expect(mockAsyncFn).toHaveBeenCalledTimes(1);
            expect(mockAsyncFn).toHaveBeenCalledWith('arg1', 'arg2')
        });

        it('should retry on failure and succeed on second attempt', async () => {
            mockAsyncFn.mockRejectedValueOnce(new Error('First fail')).mockResolvedValueOnce('success');
            const retryAsyncFn = withRetry(mockAsyncFn, 2, 100);

            // Start the async operation WITHOUT awaiting it
            // This kicks off the retry logic but doesn't block execution
            // What happens internally:
            // 1. retryAsyncFn calls mockAsyncFn('arg1') 
            // 2. mockAsyncFn immediately rejects with 'First fail'
            // 3. The catch block executes and creates: new Promise(r => setTimeout(r, 100))
            // 4. The function is now waiting for this setTimeout to fire before retrying
            // 5. Returns a promise representing the entire operation (currently pending)
            const promise = retryAsyncFn('arg1');

            // At this point:
            // - Time is frozen at 0ms (due to fake timers)
            // - A setTimeout is scheduled for 100ms but hasn't fired
            // - The promise is pending, waiting for the setTimeout to complete
            
            // Manually advance the fake clock by 100ms
            // This does two things:
            // 1. Moves the fake clock from 0ms to 100ms, triggering the setTimeout
            // 2. Waits for all promises created by that timer to resolve
            // After this line, the retry logic has continued:
            // - The setTimeout promise resolved
            // - mockAsyncFn was called a second time with 'arg1'
            // - This second call returned 'success'
            // - The promise chain updated but hasn't been awaited yet
            await vi.advanceTimersByTimeAsync(100);

            // Now await the original promise to get the final result
            // Since the retry has already happened (triggered by advancing timers),
            // this will immediately resolve with 'success'
            const result = await promise;

            expect(result).toBe('success');
            expect(mockAsyncFn).toHaveBeenCalledTimes(2);
        });

        it('should apply exponential backoff', async () => {
            mockAsyncFn
                .mockRejectedValueOnce(new Error('First Fail'))
                .mockRejectedValueOnce(new Error('Second Fail'))
                .mockResolvedValueOnce('success');
            
            const retryAsyncFn = withRetry(mockAsyncFn, 2, 100);

            const promise = retryAsyncFn();

            // First retry after 100ms
            await vi.advanceTimersByTimeAsync(100);
            expect(mockAsyncFn).toHaveBeenCalledTimes(2);
            
            // should retry after 200ms more
            await vi.advanceTimersByTimeAsync(100);
            expect(mockAsyncFn).toHaveBeenCalledTimes(2);
            await vi.advanceTimersByTimeAsync(100);
            expect(mockAsyncFn).toHaveBeenCalledTimes(3);
        });

        it('should throw after exhausting all retries', async () => {
            mockAsyncFn.mockRejectedValue(new Error('Always fails'));

            const retryAsyncFn = withRetry(mockAsyncFn, 2, 100);
            
            const promise = retryAsyncFn();

            // Attach the handler
            const expectation = expect(promise).rejects.toThrow('Always fails');

            // Both retry after 300ms
            await vi.advanceTimersByTimeAsync(300);

            await expectation;
            expect(mockAsyncFn).toHaveBeenCalledTimes(3);
        });

        it('should not retry on AbortError', async () => {
            const abortError = new DOMException('The operation was aborted', 'AbortError');
            mockAsyncFn.mockRejectedValue(abortError);

            const retryAsyncFn = withRetry(mockAsyncFn, 2, 100);
            
            await expect(retryAsyncFn()).rejects.toThrow('The operation was aborted');
            expect(mockAsyncFn).toHaveBeenCalledTimes(1);
        })

        it('should work with default parameters', async () => {
            mockAsyncFn.mockRejectedValueOnce(new Error('First fail')).mockRejectedValueOnce('Second fail').mockResolvedValueOnce('success');

            const retryAsyncFn = withRetry(mockAsyncFn);
            
            const promise = retryAsyncFn();

            const expectation = expect(promise).resolves.toBe('success');

            // First retry, default delay is 500ms
            await vi.advanceTimersByTimeAsync(500);
            expect(mockAsyncFn).toHaveBeenCalledTimes(2);

            // Second retry, default delay with exponential backoff is 1000ms
            await vi.advanceTimersByTimeAsync(1000);
            expect(mockAsyncFn).toHaveBeenCalledTimes(3);

            await expectation;
        });

        it('should preserves arguments through retries', async () => {
            const args = ['arg1', {key: 'value'}, 42]
            mockAsyncFn.mockRejectedValueOnce(new Error('First fail')).mockRejectedValueOnce('Second fail').mockResolvedValueOnce('success');

            const retryAsyncFn = withRetry(mockAsyncFn, 2, 50);

            const promise = retryAsyncFn(...args);
            await vi.advanceTimersByTimeAsync(150);
            await promise;

            expect(mockAsyncFn).toHaveBeenCalledTimes(3);
            expect(mockAsyncFn).toHaveBeenNthCalledWith(1, ...args);
            expect(mockAsyncFn).toHaveBeenNthCalledWith(2, ...args);
            expect(mockAsyncFn).toHaveBeenNthCalledWith(3, ...args);
        });
    });

    describe('withRetry', () => {
        let mockAsyncFn;
        mockAsyncFn = vi.fn();

        it('should return { success: true, data: result } in case of success', async () => {
            mockAsyncFn.mockResolvedValue('success');

            const safeFetch = withErrorHandling(mockAsyncFn);
            const result = await safeFetch();

            expect(result).toStrictEqual({ success: true, data: 'success' })
        });

        it('should return { success: false, error: error.message, timestamp: new Date() } in case of a failure ', async () => {
            mockAsyncFn.mockRejectedValue(new Error('Always fails'));

            const safeFetch = withErrorHandling(mockAsyncFn);
            const result = await safeFetch();

            expect(result).toStrictEqual({ success: false, error: 'Always fails', timestamp: new Date() })

            const date1 = new Date();
            const date2 = new Date();

            expect(date1).toStrictEqual(date2)
        });

        it('should re-throw if the wrapped function throws AbortError', async () => {
            const abortError = new DOMException('The operation was aborted', 'AbortError');
            mockAsyncFn.mockRejectedValue(abortError);

            const safeFetch = withErrorHandling(mockAsyncFn);
            await expect(safeFetch()).rejects.toStrictEqual(abortError)
        });

        it('should forward arguments to the wrapped function', async () => {
            mockAsyncFn.mockResolvedValue('success');
            const args = ['arg1', {key: 'value'}, 42];

            const safeFetch = withErrorHandling(mockAsyncFn);
            const result = await safeFetch(...args);

            expect(mockAsyncFn).toHaveBeenCalledTimes(1);
            expect(mockAsyncFn).toHaveBeenCalledWith(...args);
        });
    });
});

