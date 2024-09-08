import React, { useState, useEffect } from "react";

function useDebounce(value, delay = 1000) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(id);
    };
  }, [value, delay]);
  return debouncedValue;
}

export default useDebounce;
