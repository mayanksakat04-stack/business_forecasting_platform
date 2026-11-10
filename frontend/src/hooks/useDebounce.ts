import { useState, useEffect } from "react";

// This hook uses a generic <T> so it can debounce a string, a number, or an entire object.
export function useDebounce<T>(value: T, delay: number): T {
    // State to hold the delayed value
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // 1. The Stopwatch Starts: Schedule the update after the delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // 2. The Reset Switch: If 'value' changes BEFORE the delay finishes, 
        // the cleanup function clears the previous timeout and restarts the clock.
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]); // Only re-run if value or delay changes

    return debouncedValue;
}