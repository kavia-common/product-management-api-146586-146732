'use strict';

const productsService = require('../services/products');
const { validateProduct, createProductFromPayload, applyProductPatch } = require('../models/product');

/**
 * ProductsController orchestrates request validation and service calls,
 * returning consistent JSON responses and HTTP status codes.
 */
class ProductsController {
  // PUBLIC_INTERFACE
  /**
   * List products with pagination.
   * Query params: page, pageSize
   */
  async list(req, res, next) {
    /** Lists products using pagination parameters. */
    try {
      const { page, pageSize } = req.query;
      const result = productsService.list({ page, pageSize });
      return res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Get a single product by ID.
   * Path params: id
   */
  async get(req, res, next) {
    /** Gets a single product by id. */
    try {
      const { id } = req.params;
      const product = productsService.getById(id);
      if (!product) {
        return res.status(404).json({
          status: 'error',
          message: 'Product not found',
        });
      }
      return res.status(200).json({
        status: 'success',
        data: product,
      });
    } catch (err) {
      return next(err);
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Create a new product.
   * Body: { name, price, quantity }
   */
  async create(req, res, next) {
    /** Creates a product after payload validation. */
    try {
      const { valid, errors } = validateProduct(req.body, false);
      if (!valid) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors,
        });
      }
      const product = createProductFromPayload(req.body);
      const created = productsService.create(product);
      return res.status(201).json({
        status: 'success',
        data: created,
      });
    } catch (err) {
      return next(err);
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Update an existing product fully (PUT).
   * Path: /products/:id
   * Body: { name, price, quantity }
   */
  async put(req, res, next) {
    /** Replaces an existing product after validation. */
    try {
      const { id } = req.params;
      const current = productsService.getById(id);
      if (!current) {
        return res.status(404).json({
          status: 'error',
          message: 'Product not found',
        });
      }
      const { valid, errors } = validateProduct(req.body, false);
      if (!valid) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors,
        });
      }
      const updated = {
        ...current,
        name: String(req.body.name).trim(),
        price: Number(req.body.price),
        quantity: Number(req.body.quantity),
        updatedAt: new Date().toISOString(),
      };
      productsService.update(id, updated);
      return res.status(200).json({
        status: 'success',
        data: updated,
      });
    } catch (err) {
      return next(err);
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Partially update an existing product (PATCH).
   * Path: /products/:id
   * Body: Partial<{ name, price, quantity }>
   */
  async patch(req, res, next) {
    /** Applies a partial update after partial validation. */
    try {
      const { id } = req.params;
      const current = productsService.getById(id);
      if (!current) {
        return res.status(404).json({
          status: 'error',
          message: 'Product not found',
        });
      }
      const { valid, errors } = validateProduct(req.body, true);
      if (!valid) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors,
        });
      }
      const updated = applyProductPatch(current, req.body);
      productsService.update(id, updated);
      return res.status(200).json({
        status: 'success',
        data: updated,
      });
    } catch (err) {
      return next(err);
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Delete a product by ID.
   * Path: /products/:id
   */
  async remove(req, res, next) {
    /** Deletes a product if exists. */
    try {
      const { id } = req.params;
      const ok = productsService.delete(id);
      if (!ok) {
        return res.status(404).json({
          status: 'error',
          message: 'Product not found',
        });
      }
      return res.status(204).send();
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new ProductsController();
