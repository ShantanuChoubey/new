import { useState } from "react";
import { getItem, setItem } from "../utils/storage";

/**
 * useState-like hook backed by localStorage.
 * The stored value is automatically serialised/deserialised as JSON.
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    return getItem(key) ?? initialValue;
  });

  function setValue(value) {
    const valueToStore =
      typeof value === "function" ? value(storedValue) : value;
    setStoredValue(valueToStore);
    setItem(key, valueToStore);
  }

  return [storedValue, setValue];
}
