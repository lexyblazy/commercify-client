import React from "react";

interface LoaderProps {
  size: "small" | "medium" | "large";
}
export const Loader = ({ size }: LoaderProps) => {
  return <div className={`loader loader--center loader--${size}`}></div>;
};
