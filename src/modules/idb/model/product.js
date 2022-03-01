export default class Product {
  constructor(config) {
    config = config || {};
    this.id = config.id;
    this.name = config.name;
    this.fullname = config.fullname;
    this.sku = config.sku;
    this.deletedAt = config.deletedAt;
    this.handle = config.handle;
    this.supplierCode = config.supplierCode;
    this.active = config.active;
    this.brandId = config.brandId;
    this.literalTypeId = config.literalTypeId;
    this.supplierId = config.supplierId;
    this.tagIds = config.tagIds;
  }

  getName() {
    var name = this.fullname || this.name;

    name += this.deletedAt ? ' (deleted)' : '';

    return name;
  }

  toJson() {
    return {
      id: this.id,
      name: this.name,
      fullname: this.fullname,
      sku: this.sku,
      deletedAt: this.deletedAt,
      handle: this.handle,
      supplierCode: this.supplierCode,
      active: this.active,
      brandId: this.brandId,
      literalTypeId: this.literalTypeId,
      supplierId: this.supplierId,
      tagIds: this.tagIds
    };
  }
}
