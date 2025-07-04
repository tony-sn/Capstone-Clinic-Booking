import { ReactNode } from "react";

interface MotionProps {
  children: ReactNode;
  initial?: Record<string, any>;
  animate?: Record<string, any>;
  transition?: {
    duration?: number;
    delay?: number;
  };
  className?: string;
}

export const motion = {
  div: ({ children, initial, animate, transition, className }: MotionProps) => {
    return (
      <div
        className={className}
        style={{
          opacity: 1,
          transform: "none",
          transition: `all ${transition?.duration || 0.3}s ease-in-out ${transition?.delay || 0}s`,
        }}
      >
        {children}
      </div>
    );
  },
};
