import React from "react";

const FloatingElements: React.FC = () => (
  <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
    {[...Array(20)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full mix-blend-screen animate-float"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: `${Math.random() * 300 + 50}px`,
          height: `${Math.random() * 300 + 50}px`,
          background: `radial-gradient(circle at center, rgba(${Math.random() * 255
            }, ${Math.random() * 255}, ${Math.random() * 255
            }, 0.1) 0%, transparent 70%)`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${Math.random() * 10 + 10}s`,
        }}
      />
    ))}
  </div>
);

export default FloatingElements;
