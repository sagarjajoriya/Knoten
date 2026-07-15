import { useEffect, useState } from 'react';

/**
 * Subscribe to a CSS media query. Returns the current match and updates on change.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = (): void => {
      setMatches(media.matches);
    };
    onChange();
    media.addEventListener('change', onChange);
    return () => {
      media.removeEventListener('change', onChange);
    };
  }, [query]);

  return matches;
}
