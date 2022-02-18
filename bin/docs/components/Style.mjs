import { createContext } from 'preact';
import { useContext } from 'preact/hooks';

export const Style = createContext(null);

export function useStyle(name) {
  useContext(Style).add(name);
}

export function flushStyles(styles) {
  const result = Array.from(styles).join('\n');
  styles.clear();
  return result;
}

export const css = (quasis, ...values) =>
  quasis.map((quasi, i) => `${quasi}${values[i] || ''}`).join('');
