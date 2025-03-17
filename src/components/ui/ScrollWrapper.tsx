import { useEffect, useRef } from "react";

interface ScrollWrapperProps {
  children: React.ReactNode;
}

const ScrollWrapper: React.FC<ScrollWrapperProps> = ({ children }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(0);

  useEffect(() => {
    // Save the current scroll position
    const savePosition = () => {
      if (scrollRef.current) {
        positionRef.current = window.scrollY;
      }
    };

    // Restore the scroll position
    const restorePosition = () => {
      window.scrollTo(0, positionRef.current);
    };

    window.addEventListener("scroll", savePosition);
    return () => {
      restorePosition();
      window.removeEventListener("scroll", savePosition);
    };
  }, []);

  return <div ref={scrollRef}>{children}</div>;
};

export default ScrollWrapper;
