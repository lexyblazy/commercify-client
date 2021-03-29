import React, { useState } from "react";
import { nanoid } from "nanoid";
import _ from "lodash";

import * as apis from "../../apis";

export const ProductCreate = () => {
  const [state, setState] = useState({
    isPhysicalProduct: false,
    showAddVariantsOption: true,
    showAddVariantsForm: false,
    variantOptions: {
      [nanoid()]: {
        name: "Size",
        values: [] as string[],
      },
      [nanoid()]: {
        name: "Color",
        values: [],
      },
    },
  });

  const [formState, setFormState] = useState({
    name: "",
    description: "",
    price: "",
    comparePrice: "",
    costPerItem: "",
    sku: "",
    barcode: "",
    quantity: 1,
  });

  const addVariantOption = () => {
    setState({
      ...state,
      variantOptions: {
        ...state.variantOptions,
        [nanoid()]: {
          name: "",
          values: [],
        },
      },
    });
  };

  const removeVariantOption = (key: string) => {
    setState({
      ...state,
      variantOptions: _.omit(state.variantOptions, key),
    });
  };

  const handleInputChange = ({
    target,
  }: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setFormState({ ...formState, [target.name]: target.value });
  };

  const handleOptionChange = (
    fieldName: "optionName" | "optionValue",
    key: string,
    fieldValue: string
  ) => {
    if (fieldName === "optionName") {
      setState({
        ...state,
        variantOptions: {
          ...state.variantOptions,
          [key]: {
            ...state.variantOptions[key],
            name: fieldValue,
          },
        },
      });
    } else if (fieldName === "optionValue") {
      const variantOptions = {
        ...state.variantOptions,
        [key]: {
          ...state.variantOptions[key],
          values: fieldValue.split(","),
        },
      };
      setState({
        ...state,
        variantOptions,
      });
    }
  };

  const renderOptionValues = (values: string[]) => {
    console.log(values);
    // return values.map((val) => <span>{val.trim()}</span>);
    return values.join(",");
  };

  const renderVariantsOptions = () => {
    const variantsOptionsKeys = Object.keys(state.variantOptions);
    const variantInputs = variantsOptionsKeys.map((key) => {
      return (
        <div
          className="products__create-form__variants-row margin-bottom-2"
          key={key}
        >
          <div className="variant-option-name">
            <input
              className="input card__input"
              onChange={(e) =>
                handleOptionChange("optionName", key, e.target.value)
              }
              value={state.variantOptions[key].name}
            />
          </div>
          <div className="variant-option-value">
            <textarea
              className="input card__textarea"
              rows={5}
              placeholder="Separate options with a comma"
              onChange={(e) =>
                handleOptionChange("optionValue", key, e.target.value)
              }
              value={renderOptionValues(state.variantOptions[key].values)}
            />
          </div>

          {variantsOptionsKeys.length > 1 && (
            <div
              className="variant-option-trash"
              onClick={() => removeVariantOption(key)}
            >
              <i className="fas fa-trash"></i>
            </div>
          )}
        </div>
      );
    });

    return variantInputs;
  };

  const handleSubmit = async () => {
    console.log({ ...formState, isPhysicalProduct: state.isPhysicalProduct });

    const {
      name,
      barcode,
      description,
      quantity,
      sku,
      comparePrice,
      costPerItem,
      price,
    } = formState;

    const response = await apis.products.create({
      name,
      barcode,
      description,
      quantity,
      sku,
      comparePrice,
      costPerItem,
      isPhysicalProduct: state.isPhysicalProduct,
      price,
    });

    if (response && response.ok && response.data) {
      console.log("SUccess", response.data);
    } else {
      console.log("Error", response.data?.error);
    }
  };

  return (
    <div className="products__create-form">
      <div className="card margin-bottom-4">
        <label className="card__label margin-bottom-1">Name</label>
        <input
          className="input card__input margin-bottom-3"
          name="name"
          onChange={handleInputChange}
          value={formState.name}
        ></input>
        <label className="card__label margin-bottom-1">Description</label>
        <textarea
          className="input card__textarea"
          rows={20}
          onChange={handleInputChange}
          name="description"
          value={formState.description}
        ></textarea>
      </div>
      <div className="card products__create-form--image-upload margin-bottom-4">
        <div className="left-to-right-container">
          <h4 className="left">Images</h4>

          <label htmlFor="file-upload" className="file-input right">
            Upload Image
            <input type="file" multiple id="file-upload" />
          </label>
        </div>
        <div className="image-upload-viewer"></div>
      </div>

      <div className="card margin-bottom-4 products__create-form__pricing">
        <h4 className="margin-bottom-2">Pricing</h4>

        <div className="products__create-form--input-row margin-bottom-3">
          <div className="products__create-form--input-row-col-1-of-2">
            <label className="card__label margin-bottom-1">Price</label>
            {/* <span>$</span> */}
            <input
              className="input card__input"
              onChange={handleInputChange}
              name="price"
              value={formState.price}
            ></input>
          </div>

          <div className="products__create-form--input-row-col-1-of-2">
            <label className="card__label margin-bottom-1">
              Compare at price
            </label>
            {/* <span>$</span> */}
            <input
              className="input card__input"
              onChange={handleInputChange}
              name="comparePrice"
              value={formState.comparePrice}
            ></input>
          </div>
        </div>

        <div className="products__create-form--input-row products__create-form__pricing">
          <div className="products__create-form--input-row-col-1-of-2">
            <label className="card__label margin-bottom-1">Cost Per item</label>
            <input
              className="input card__input card__input"
              onChange={handleInputChange}
              name="costPerItem"
              value={formState.costPerItem}
            ></input>
          </div>
        </div>
      </div>

      <div className="card margin-bottom-4 products__create-form__inventory">
        <h4 className="margin-bottom-2">Inventory</h4>

        <div className="products__create-form--input-row  margin-bottom-3">
          <div className="products__create-form--input-row-col-1-of-2">
            <label className="card__label margin-bottom-1">
              SKU (stock keeping unit)
            </label>
            <input
              className="input card__input card__input"
              onChange={handleInputChange}
              name="sku"
              value={formState.sku}
            ></input>
          </div>

          <div className="products__create-form--input-row-col-1-of-2">
            <label className="card__label margin-bottom-1">
              Barcode (12 digit ISBN, UPC, GTIN, etc)
            </label>
            <input
              className="input card__input card__input"
              onChange={handleInputChange}
              name="barcode"
              value={formState.barcode}
            ></input>
          </div>
        </div>

        <div className="products__create-form--input-row  margin-bottom-3">
          <div className="products__create-form--input-row-col-1-of-2">
            <input
              className="checkbox"
              type="checkbox"
              id="physical-product"
              checked={state.isPhysicalProduct}
              onChange={(e) =>
                setState({
                  ...state,
                  isPhysicalProduct: !state.isPhysicalProduct,
                })
              }
            ></input>{" "}
            &nbsp;
            <label
              className="card__label--inline margin-bottom-1"
              htmlFor="physical-product"
            >
              This is a physical product
            </label>
            <span className="products__create-form--custom-checkbox"></span>
          </div>

          <div className="products__create-form--input-row-col-1-of-2">
            {state.isPhysicalProduct ? (
              <>
                <label className="card__label margin-bottom-1">Quantity</label>
                <input
                  className="input card__input card__input"
                  type="number"
                  min="1"
                  onChange={handleInputChange}
                  name="quantity"
                  value={formState.quantity}
                ></input>
              </>
            ) : (
              <div></div>
            )}
          </div>
        </div>
        {state.isPhysicalProduct ? (
          <div>
            <input type="checkbox" id="out-of-stock-purchase"></input> &nbsp;
            <label
              className="card__label--inline"
              htmlFor="out-of-stock-purchase"
            >
              Allow customers to purchase this product when it's out of stock
            </label>
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <div className="card margin-bottom-4 products__create-form__variants">
        <div className="left-to-right-container margin-bottom-3">
          <h4 className="left">Variants</h4>
          <span
            className="right add-variant"
            onClick={() =>
              setState({
                ...state,
                showAddVariantsOption: !state.showAddVariantsOption,
                showAddVariantsForm: !state.showAddVariantsForm,
              })
            }
          >
            {state.showAddVariantsOption ? "Add variant" : "Cancel"}
          </span>
        </div>

        <p className="margin-bottom-3">
          Add variants if this product comes in multiple versions, like
          different sizes or colors
        </p>
        {state.showAddVariantsForm ? (
          <>
            <div className="products__create-form__variants-row margin-bottom-2">
              <div className="variant-option-name ">Option name</div>
              <div className="">Option values</div>
            </div>
            {renderVariantsOptions()}

            <button className="btn" onClick={addVariantOption}>
              Add Another option
            </button>
          </>
        ) : (
          <></>
        )}
      </div>

      <div className="card margin-bottom-3 products__create-form__actions">
        <div className="left-to-right-container">
          <div className="left products__create-form__actions--cancel">
            <button className="btn">Cancel</button>
          </div>
          <div className="right products__create-form__actions--submit">
            <button className="btn btn--green" onClick={handleSubmit}>
              Add Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
