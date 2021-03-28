import React, { useState } from "react";
import { ProductCreate } from "./ProductCreate";

interface Props {
  isActive?: boolean;
}

export const Products = ({ isActive }: Props) => {
  const [showForm, setState] = useState(false);

  return (
    <div className="products">
      <button
        className="products__plus-button products__plus-button--fixed"
        onClick={() => setState(!showForm)}
      >
        <i className={!showForm ? `fas fa-plus` : `fas fa-times`}></i>
      </button>

      {showForm ? (
        <ProductCreate />
      ) : (
        <>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. In
            assumenda provident voluptate, deserunt harum quam voluptatem magnam
            magni nisi sed ducimus sint cumque temporibus blanditiis inventore
            rem esse accusantium odio!
          </p>
        </>
      )}
    </div>
  );
};
