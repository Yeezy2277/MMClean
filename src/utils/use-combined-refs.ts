import {useRef, useEffect, ForwardedRef} from 'react';

export const useCombinedRefs = (...refs: ForwardedRef<unknown>[]) => {
  const targetRef = useRef();

  useEffect(() => {
    refs.forEach(ref => {
      if (!ref) {
        return;
      }

      if (typeof ref === 'function') {
        ref(targetRef.current);
      } else {
        ref.current = targetRef.current;
      }
    });
  }, [refs]);

  return targetRef;
};
