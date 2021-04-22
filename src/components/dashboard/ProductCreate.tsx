import React, { useState } from "react";
import { nanoid } from "nanoid";
import _ from "lodash";

import * as apis from "../../apis";
import { Loader } from "../Loader";

export const ProductCreate = () => {
  const [viewState, setViewState] = useState({
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
    imageInputTouched: false,
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
    allowOutOfStockPurchase: false,
    files: {} as FileList,
    imageUrls: [] as string[],
  });

  const [validationState, setValidationState] = useState([] as string[]);

  const uploadImages = async (files: FileList) => {
    const filesMetaData = Array.from(files)
      .slice(0, 5)
      .map(({ name, type }) => ({
        name,
        type,
      }));

    const response = await apis.uploads.getSignedUrl(filesMetaData);

    if (!response.ok || !response.data) {
      alert("Error");

      return;
    }
    const signedUrls = response.data;

    const uploadPromises = signedUrls.map((signedUrl, index) => {
      return apis.uploads.uploadToS3(signedUrl, files[index]);
    });

    const result = _.compact(await Promise.all(uploadPromises));

    console.log(result);

    setFormState({ ...formState, imageUrls: result });
  };

  const addVariantOption = () => {
    setViewState({
      ...viewState,
      variantOptions: {
        ...viewState.variantOptions,
        [nanoid()]: {
          name: "",
          values: [],
        },
      },
    });
  };

  const removeVariantOption = (key: string) => {
    setViewState({
      ...viewState,
      variantOptions: _.omit(viewState.variantOptions, key),
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
      setViewState({
        ...viewState,
        variantOptions: {
          ...viewState.variantOptions,
          [key]: {
            ...viewState.variantOptions[key],
            name: fieldValue.trim(),
          },
        },
      });
    } else if (fieldName === "optionValue") {
      const variantOptions = {
        ...viewState.variantOptions,
        [key]: {
          ...viewState.variantOptions[key],
          values: fieldValue.split(",").map((val) => val.trim()),
        },
      };
      setViewState({
        ...viewState,
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
    const variantsOptionsKeys = Object.keys(viewState.variantOptions);
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
              value={viewState.variantOptions[key].name}
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
              value={renderOptionValues(viewState.variantOptions[key].values)}
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

  const renderFormErrors = () => {
    const errors = validationState.map((val) => (
      <li className="margin-bottom-1" key={nanoid()}>
        {val}
      </li>
    ));

    return <ul className="margin-bottom-3">{errors}</ul>;
  };

  const validate = ({
    name,
    description,
    barcode,
    sku,
    price,
    isPhysicalProduct,
    quantity,
    costPerItem,
    imageUrls,
  }: ProductCreateParams) => {
    const errors = [];

    const isValidPrice = !isNaN(Number(price));
    const isValidCostPerItem = !isNaN(Number(costPerItem));
    const isValidQuantity = !isNaN(Number(quantity));

    if (!name) {
      errors.push("Product name cannot be blank");
    }

    if (name.length < 5) {
      errors.push("Product name must be at least 5 characters");
    }

    if (name.length > 35) {
      errors.push("Product name cannot be longer than 35 characters");
    }

    if (!description) {
      errors.push("Product description cannot be blank");
    }

    if (description.length < 35) {
      errors.push("Product description must be at least 35 characters");
    }

    if (!barcode) {
      errors.push("Barcode cannot be blank");
    }

    if (barcode.length !== 12) {
      errors.push("Barcode must be 12 digits");

      const exp = /^\d+$/;

      if (!exp.test(barcode)) {
        errors.push("Barcode must contain only digits");
      }
    }

    if (!sku) {
      errors.push("SKU cannot be blank");
    }

    if (!price) {
      errors.push("Price cannot be blank");
    }

    if (price) {
      if (!isValidPrice) {
        errors.push("Price must be valid number");
      }
    }

    if (!costPerItem) {
      errors.push("Cost per item cannot be blank");
    }

    if (costPerItem) {
      if (!isValidCostPerItem) {
        errors.push("Cost per item must be valid number");
      }
    }

    if (isValidPrice && isValidCostPerItem) {
      if (Number(costPerItem) > Number(price)) {
        errors.push("Cost per Item cannot be greater than product price");
      }
    }

    if (isPhysicalProduct) {
      if (!quantity) {
        errors.push("A physical product must have a quantity");
      }

      if (quantity) {
        if (!isValidQuantity) {
          errors.push("Quantity must be valid number");
        }

        if (quantity < 1) {
          errors.push("Quantity must be greater than 0");
        }
      }
    }

    if (imageUrls.length < 1) {
      errors.push("A product must have at least one image");
    }

    return errors;
  };

  const handleImageInputChange = async (files: HTMLInputElement["files"]) => {
    if (files === null || files.length < 1) {
      return;
    }

    if (!viewState.imageInputTouched) {
      setViewState({ ...viewState, imageInputTouched: true });
    }

    uploadImages(files);
  };

  const showImagePreview = () => {
    // const previewUrls = Array.from(filesState).map((file) =>
    //   URL.createObjectURL(file)
    // );

    const showLoading =
      viewState.imageInputTouched && formState.imageUrls.length < 1;

    if (showLoading) {
      return <Loader size="small" withContainer />;
    }

    return (
      <div className="image-upload-previewer margin-top-4">
        {formState.imageUrls.map((url) => (
          <img
            key={nanoid()}
            src={url}
            alt="preview"
            className="image-preview"
          />
        ))}
      </div>
    );
  };

  const handleSubmit = async () => {
    const {
      name,
      barcode,
      description,
      quantity,
      sku,
      comparePrice,
      costPerItem,
      price,
      imageUrls,
    } = formState;

    const params: ProductCreateParams = {
      name: name.trim(),
      barcode: barcode.trim(),
      description: description.trim(),
      sku: sku.trim(),
      comparePrice: comparePrice ? comparePrice.trim() : comparePrice,
      costPerItem: costPerItem.trim(),
      isPhysicalProduct: viewState.isPhysicalProduct,
      quantity: quantity.toString().trim(),
      price: price.trim(),
      allowOutOfStockPurchase: formState.allowOutOfStockPurchase,
      imageUrls,
    };

    const errors = validate(params);

    setValidationState(errors);

    console.log(formState);

    if (errors.length > 0) {
      return;
    }

    const response = await apis.products.create(params);

    if (response && response.ok && response.data) {
      console.log("Success", response.data);
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
            <input
              type="file"
              multiple
              id="file-upload"
              accept=".jpg,.jpeg,.png"
              onChange={(e) => handleImageInputChange(e.target.files)}
            />
          </label>
        </div>
        {showImagePreview()}
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
            <label className="card__label margin-bottom-1">
              Cost Per item (The cost price of this product)
            </label>
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
              checked={viewState.isPhysicalProduct}
              onChange={(e) =>
                setViewState({
                  ...viewState,
                  isPhysicalProduct: !viewState.isPhysicalProduct,
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
            {viewState.isPhysicalProduct ? (
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
        {viewState.isPhysicalProduct ? (
          <div>
            <input
              type="checkbox"
              id="out-of-stock-purchase"
              checked={formState.allowOutOfStockPurchase}
              onChange={() =>
                setFormState({
                  ...formState,
                  allowOutOfStockPurchase: !formState.allowOutOfStockPurchase,
                })
              }
            ></input>{" "}
            &nbsp;
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
              setViewState({
                ...viewState,
                showAddVariantsOption: !viewState.showAddVariantsOption,
                showAddVariantsForm: !viewState.showAddVariantsForm,
              })
            }
          >
            {viewState.showAddVariantsOption ? "Add variant" : "Cancel"}
          </span>
        </div>

        <p className="margin-bottom-3">
          Add variants if this product comes in multiple versions, like
          different sizes or colors
        </p>
        {viewState.showAddVariantsForm ? (
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
        {validationState.length > 0 ? renderFormErrors() : <span />}
        <div className="left-to-right-container">
          <div className="left products__create-form__actions--cancel"></div>
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
