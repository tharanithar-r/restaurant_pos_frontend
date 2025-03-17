import { useRef, useCallback } from "react";

export const useScrollPosition = () => {
  const scrollPos = useRef(0);

  const saveScrollPosition = useCallback(() => {
    scrollPos.current = window.scrollY;
  }, []);

  const restoreScrollPosition = useCallback(() => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        window.scrollTo({
          top: scrollPos.current,
          behavior: "instant",
        });
      }, 0);
    });
  }, []);

  return { saveScrollPosition, restoreScrollPosition };
};
