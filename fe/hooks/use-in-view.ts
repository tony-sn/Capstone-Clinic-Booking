"use client";

import { useState, useEffect, RefObject } from "react";

interface UseInViewOptions {
  once?: boolean;
  margin?: string;
}

export function useInView(
  ref: RefObject<HTMLElement>,
  options: UseInViewOptions = {},
) {
  const { once = false, margin = "0px" } = options;
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!once) {
          setIsInView(false);
        }
      },
      { rootMargin: margin },
    );

    observer.observe(ref.current);

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, once, margin]);

  return isInView;
}
