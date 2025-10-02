'use strict';

/**
 * ProductsService
 * In-memory data store for products with CRUD operations.
 * This can be later replaced with a database-backed repository without
 * changing controllers/routes thanks to clear separation.
 */
class ProductsService {
  constructor() {
    /** @type {Map<string, object>} */
    this.store = new Map();
  }

  // PUBLIC_INTERFACE
  /**
   * List products with optional pagination.
   * @param {{page?:number, pageSize?:number}} opts
   * @returns {{items: object[], page:number, pageSize:number, total:number}}
   */
  list(opts = {}) {
    /** Returns paginated list of products. */
    const pageSize = Math.max(1, Math.min(Number(opts.pageSize) || 20, 100));
    const page = Math.max(1, Number(opts.page) || 1);

    const all = Array.from(this.store.values());
    const total = all.length;

    const start = (page - 1) * pageSize;
    const items = all.slice(start, start + pageSize);

    return { items, page, pageSize, total };
  }

  // PUBLIC_INTERFACE
  /**
   * Get a single product by id.
   * @param {string} id
   * @returns {object|null}
   */
  getById(id) {
    /** Returns a single product or null. */
    return this.store.get(String(id)) || null;
  }

  // PUBLIC_INTERFACE
  /**
   * Create a product.
   * @param {object} product
   * @returns {object} created product
   */
  create(product) {
    /** Inserts a product into the store. */
    this.store.set(product.id, product);
    return product;
  }

  // PUBLIC_INTERFACE
  /**
   * Update a product by replacing fields.
   * @param {string} id
   * @param {object} updated
   * @returns {object|null}
   */
  update(id, updated) {
    /** Replaces the product fields if exists. */
    if (!this.store.has(id)) return null;
    this.store.set(id, updated);
    return updated;
  }

  // PUBLIC_INTERFACE
  /**
   * Delete a product by id.
   * @param {string} id
   * @returns {boolean} true if deleted
   */
  delete(id) {
    /** Deletes a product if exists. */
    return this.store.delete(id);
  }
}

module.exports = new ProductsService();
