import React from "react";

export const Button = ({
  text,
  onClick,
  cssClasses,
  disabled,
}: {
  text: string;
  onClick: (event: React.MouseEvent) => void;
  cssClasses?: string[];
  disabled?: boolean;
}) => {
  const disabledClass = !!disabled ? "btn--disabled" : "";

  return (
    <button
      className={`btn ${cssClasses?.join(" ")} ${disabledClass}`}
      onClick={onClick}
      disabled={!!disabled}
    >
      {text}
    </button>
  );
};
