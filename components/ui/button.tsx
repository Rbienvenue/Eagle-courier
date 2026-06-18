import React from "react";

export function Button({ children, className = '', ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...rest} className={`primary-button ${className}`}> 
      {children}
    </button>
  );
}
