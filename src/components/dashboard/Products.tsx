import React, { useState, useEffect } from "react";
import { ProductCreate } from "./ProductCreate";

import * as apis from "../../apis";

interface Props {
  isActive?: boolean;
}

export const Products = ({ isActive }: Props) => {
  const [showForm, setState] = useState(true);

  const listAllProducts = async () => {
    const response = await apis.products.list();

    if (!response || !response.ok || !response.data) {
      alert("Error");
      return;
    }

    const products = response.data;
    console.log(products);
  };

  useEffect(() => {
    listAllProducts();
  }, []);

  return (
    <div className="products">
      <button
        className="products__plus-button products__plus-button--fixed"
        onClick={() => setState(!showForm)}
      >
        <i className={showForm ? `fas fa-times` : `fas fa-plus`}></i>
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
