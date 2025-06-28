// src/hooks/useTypingEffect.js
import { useState, useEffect } from 'react';

/**
 * useTypingEffect
 * @param {string} text - The full string to type out
 * @param {number} speed - Interval in ms between each character
 * @returns {string} displayed - The current substring that has been "typed"
 */
export default function useTypingEffect(text, speed = 50) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    setDisplayed('');
    let idx = 0;
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + text.charAt(idx));
      idx++;
      if (idx >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return displayed;
}
