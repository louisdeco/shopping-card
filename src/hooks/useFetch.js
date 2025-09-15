import { useState, useEffect } from 'react';
import { safeFetchWithRetry } from '../utils/api';

/**
 * Custom hook for fetching data from API endpoints
 * @param {string} endpointKey - the endpoint key to fetch from
 * @returns {{data: any, error: string|null, loading: boolean}}
 */
function useFetch(endpointKey) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        // Reset states
        setData(null);
        setLoading(true);
        setError(null);

        const controller = new AbortController();
        const globalTimeout = setTimeout(() => controller.abort(), 15000);

        const fetchData = async () => {

            try {
                const result = await safeFetchWithRetry(endpointKey, { signal: controller.signal });

                if (!controller.signal.aborted) {
                    if (result.success === false) {
                        setError(result.error);
                    } else {
                        setData(result.data);
                    }   
                }
            } catch (error) {
                if (error.name === 'AbortError') {
                        // console.log('Global operation was aborted');
                        return;
                    }
                if (!controller.signal.aborted) {
                    // console.log('Unexpected error: ', error)
                    setError('Something went wrong. Please try again');
                }
            } finally {
                clearTimeout(globalTimeout);
                if (!controller.signal.aborted) {
                    setLoading(false)
                }
            }
        };

        fetchData();

        return () => {
            clearTimeout(globalTimeout);
            controller.abort();
        }
    }, [endpointKey]);

    return {
        data,
        error,
        loading,
    }
}

export default useFetch;