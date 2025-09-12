import React from "react";

type CardProps = {
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export const Card: React.FC<CardProps> = ({ title, children, footer }) => {
  return (
    <div className="border rounded shadow-sm p-4 bg-white">
      {title && <h3 className="font-bold mb-2">{title}</h3>}
      <div>{children}</div>
      {footer && <div className="mt-2 border-t pt-2 text-sm">{footer}</div>}
    </div>
  );
};
