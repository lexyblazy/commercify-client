import React from "react";

export const ProductCreate = () => {
  return (
    <div className="products__create-form">
      <div className="card margin-bottom-4">
        <label className="card__label margin-bottom-1">Title</label>
        <input className="input card__input margin-bottom-3"></input>
        <label className="card__label margin-bottom-1">Description</label>
        <textarea className="input card__textarea" rows={20}></textarea>
      </div>
      <div className="card products__create-form--image-upload margin-bottom-4">
        <div className="image-upload-header">
          <label className="image-upload-label">Images</label>

          <label htmlFor="file-upload" className="file-input">
            Upload Image
            <input type="file" multiple id="file-upload" />
          </label>
        </div>
        <div className="image-upload-viewer"></div>
      </div>

      <div className="card margin-bottom-4">
        <label className="card__label margin-bottom-1">Price</label>
        <input className="input card__input margin-bottom-3"></input>

        <label className="card__label margin-bottom-1">Compare Price</label>
        <input className="input card__input margin-bottom-3"></input>
      </div>

      <div className="card margin-bottom-4">
        <label className="card__label margin-bottom-1">Inventory</label>
        <input className="input card__input margin-bottom-3"></input>

        <label className="card__label margin-bottom-1">Compare Price</label>
        <input className="input card__input margin-bottom-3"></input>
      </div>
    </div>
  );
};
