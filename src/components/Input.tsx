import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export const Input: React.FC<InputProps> = ({ label, ...props }) => {
  return (
    <div className="flex flex-col gap-1 mb-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      <input
        className="border border-gray-300 rounded px-2 py-1 focus:outline-blue-500"
        {...props}
      />
    </div>
  );
};
