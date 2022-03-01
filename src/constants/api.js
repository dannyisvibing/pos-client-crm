const APIs = {
  authLogin: '/auth/login',

  authSessionCheck: '/auth/check-auth',

  customersGroup: '/customerGroups',
  /**
   * GET get list of consignments or one specific data | PUT modify a consignment
   */
  stocktakes: '/consignments/:id',

  /**
   * GET list products in consignment | PUT set the count for a product in a consignment |
   * POST Adjust the count for a product | DELETE Deletes a consignment product if a product id is specified
   */
  stocktakeItems: '/consignments/:id/products/:productId',

  /**
   * GET get collection of a versioned entity
   */
  versionedEntity: '/:entity',

  /**
   * GET get collection of products
   */
  products: '/products',

  tags: '/tags/:id',

  versions: '/versions'
};

export default APIs;
