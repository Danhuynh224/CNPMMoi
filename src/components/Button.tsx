import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  children,
  ...props
}) => {
  const styles: Record<string, string> = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded",
    secondary: "bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded",
    danger: "bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded",
  };

  return (
    <button className={styles[variant]} {...props}>
      {children}
    </button>
  );
};
