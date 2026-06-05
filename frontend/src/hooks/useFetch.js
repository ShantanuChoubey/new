import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Generic data-fetching hook.
 *
 * @param {Function} fetchFn  - async function that returns data
 * @param {object}   options
 * @param {boolean}  options.immediate - fetch on mount (default true)
 * @param {any[]}    options.deps      - additional deps to re-trigger fetch
 */
export function useFetch(fetchFn, { immediate = true, deps = [] } = {}) {
  const [data,      setData]      = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState(null);
  const abortRef = useRef(null);

  const execute = useCallback(
    async (...args) => {
      // Cancel any in-flight request
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchFn(...args);
        setData(result);
        return { data: result, error: null };
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          setError(err);
        }
        return { data: null, error: err };
      } finally {
        setIsLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchFn, ...deps]
  );

  useEffect(() => {
    if (immediate) execute();
    return () => abortRef.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [execute]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { data, isLoading, error, execute, reset };
}
