import { createContext } from 'preact';
import { useContext } from 'preact/hooks';

export const Page = createContext(null);

export function useStyle(style) {
  useContext(Page).styles.add(style);
}

export function useTitle(title) {
  useContext(Page).title = title;
}

export function flushStyles(styles) {
  const result = Array.from(styles).join('\n');
  styles.clear();
  return result;
}

export const css = (quasis, ...values) =>
  quasis.map((quasi, i) => `${quasi}${values[i] || ''}`).join('');
