'use strict';

/**
 * Product model utilities and schema definition.
 * This module defines a simple in-memory "model" structure for Product data,
 * including creation defaults and validation helpers.
 */

const { v4: uuidv4 } = require('uuid');

// PUBLIC_INTERFACE
/**
 * Validate a product payload.
 * @param {object} payload - Input data for Product.
 * @param {boolean} isPartial - If true, allows partial fields (for updates/patch).
 * @returns {{valid: boolean, errors: Array<{field:string,message:string}>}}
 */
function validateProduct(payload, isPartial = false) {
  /** This function validates the product input payload. */
  const errors = [];
  const has = (k) => Object.prototype.hasOwnProperty.call(payload || {}, k);

  if (!isPartial || has('name')) {
    if (typeof payload.name !== 'string' || payload.name.trim().length === 0) {
      errors.push({ field: 'name', message: 'Name must be a non-empty string.' });
    }
  }

  if (!isPartial || has('price')) {
    const price = Number(payload.price);
    if (Number.isNaN(price) || price < 0) {
      errors.push({ field: 'price', message: 'Price must be a non-negative number.' });
    }
  }

  if (!isPartial || has('quantity')) {
    const quantity = Number(payload.quantity);
    if (!Number.isInteger(quantity) || quantity < 0) {
      errors.push({ field: 'quantity', message: 'Quantity must be a non-negative integer.' });
    }
  }

  return { valid: errors.length === 0, errors };
}

// PUBLIC_INTERFACE
/**
 * Create a normalized product object with defaults and a generated id.
 * @param {object} payload - Validated payload with name, price, quantity
 * @returns {{id:string,name:string,price:number,quantity:number,createdAt:string,updatedAt:string}}
 */
function createProductFromPayload(payload) {
  /** This function creates a normalized product with id and timestamps. */
  const now = new Date().toISOString();
  return {
    id: uuidv4(),
    name: String(payload.name).trim(),
    price: Number(payload.price),
    quantity: Number(payload.quantity),
    createdAt: now,
    updatedAt: now,
  };
}

// PUBLIC_INTERFACE
/**
 * Apply updates to a product and refresh updatedAt.
 * @param {object} product - Existing product.
 * @param {object} patch - Partial payload to update.
 * @returns {object} Updated product
 */
function applyProductPatch(product, patch) {
  /** This function updates a product with provided fields. */
  const updated = { ...product };

  if (Object.prototype.hasOwnProperty.call(patch, 'name')) {
    updated.name = String(patch.name).trim();
  }
  if (Object.prototype.hasOwnProperty.call(patch, 'price')) {
    updated.price = Number(patch.price);
  }
  if (Object.prototype.hasOwnProperty.call(patch, 'quantity')) {
    updated.quantity = Number(patch.quantity);
  }
  updated.updatedAt = new Date().toISOString();
  return updated;
}

module.exports = {
  validateProduct,
  createProductFromPayload,
  applyProductPatch,
};
