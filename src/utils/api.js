import { API_BASE_URL, ENDPOINTS } from '../constants';

/**
 * Fetch data from the Fake Store API with timeout
 * @param {string} endpointKey - Valid endpoint key (e.g., 'PRODUCTS', 'CATEGORIES')
 * @returns  {Promise<Object>} - API response data
 * @throws {Error} - HTTP errors or timeout (5s)
 */
async function fetchResource(endpointKey) {
    // Timeout 
    const timeoutController = new AbortController();
    const timeoutId = setTimeout(() => timeoutController.abort(), 5000);

    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS[endpointKey]}`, { signal: timeoutController.signal });
        // Check for HTTP errors
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const productData = await response.json();
        return productData;
    }
    finally {
        // Clear timeout
        clearTimeout(timeoutId);
    }
}

/**
 *  Wraps an async function with error handling
 * @param {Function} asyncFn - The async function to wrap 
 * @returns {Function} - A new function that returns {success, data} or {success, error, timestamp}
 * const safeFunction = withErrorHandling(fetchFunction);
 * const result = await safeFunction(fetchFunctionArgs);
 */
function withErrorHandling(asyncFn) {
    return async function(...args) {
        try {
            const result = await asyncFn(...args);
            return { success: true, data: result };
        } catch (error) {
            if (error.name === 'AbortError') throw error;
            return { success: false, error: error.message, timestamp: new Date() };
        }
    }
}

/**
 * Wraps an async function with exponential backoff retry logic
 * @param {*} fetchFn  - The fetch function to wrap
 * @param {*} retries - Number of retry attempts (default: 2)
 * @param {*} delay - Initial delay in ms (default: 500ms, doubles each retry)
 * @returns {Function} - New function that retries on failure with exponential backoff
 * @example
 * const retryFetch = withRetry(fetchResource, 3, 1000);
 * const result = await retryFetch('PRODUCTS');
 */
function withRetry(fetchFn, retries = 2, delay = 500) {
    return async function(...args) {
        try {
            return await fetchFn(...args);
        } catch (error) {
            if (retries <= 0 || error.name === 'AbortError') throw error;
            await new Promise(r => setTimeout(r, delay));
            return withRetry(fetchFn, retries - 1, delay * 2)(...args); // the (...args) allows to invoke the function
        }
    }
}

export { fetchResource, withErrorHandling, withRetry };
export const safeFetchWithRetry = withErrorHandling(withRetry(fetchResource));