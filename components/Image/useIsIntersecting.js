import { useEffect, useState } from 'react';

const defaultIntersectionOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.25,
  shouldObserveOnce: false,
};

/**
 * @description hook that returns a boolean representing whether or not a ref'd element is
 * intersecting an IntersectionObserver with optionally provided config.
 */
function useIsIntersecting(ref, options) {
  const [isIntersecting, setIntersecting] = useState(false);

  const observerOptions = {
    ...defaultIntersectionOptions,
    ...options,
  };

  useEffect(() => {
    const observer = new IntersectionObserver(([entry], _observer) => {
      // Update our state when observer callback fires
      setIntersecting(entry.isIntersecting);

      if (observerOptions.shouldObserveOnce && entry.isIntersecting) {
        _observer.unobserve(ref.current);
      }
    }, observerOptions);

    if (ref.current) {
      observer.observe(ref.current);
    }

    // cleanup called on unmount
    return () => {
      observer.unobserve(ref.current);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return isIntersecting;
}

export default useIsIntersecting;
