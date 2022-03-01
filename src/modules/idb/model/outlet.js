export default class Outlet {
  constructor(config) {
    config = config || {};
    this.outletId = config.outletId;
    this.outletName = config.outletName;
    this.deletedAt = config.deletedAt;
    this.version = config.version;
  }

  getName() {
    return this.outletName + (this.deletedAt ? ' (deleted)' : '');
  }
}
