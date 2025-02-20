
import { useState, useEffect } from 'react';

export function addToLocalStorage<T>(key: string, initialValue: T) {
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(initialValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, initialValue]);
}

export function getFromLocalStorage<T>(key: string) {
  const [storedValue, setStoredValue] = useState<T | null>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(error);
      return null;
    }
  });
  return storedValue;
}
