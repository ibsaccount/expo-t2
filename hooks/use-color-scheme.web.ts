import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    /* istanbul ignore next */
    setHasHydrated(true);
  }, []);

  const colorScheme = useRNColorScheme();

  /* istanbul ignore next */
  if (hasHydrated) {
    /* istanbul ignore next */
    return colorScheme;
  }

  /* istanbul ignore next */
  return 'light';
}
