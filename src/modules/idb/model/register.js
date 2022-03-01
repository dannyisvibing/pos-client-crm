export default class Register {
  constructor(config = {}) {
    this.registerId = config.registerId;
    this.registerName = config.registerName;

    this.createdAt = config.createdAt;
    this.deletedAt = config.deletedAt;

    this.outletId = config.outletId;
    this.registerCash = config.registerCash;
    this.receiptTemplateId = config.receiptTemplateId;
    this.receiptNumber = config.receiptNumber;
    this.receiptPrefix = config.receiptPrefix;
    this.receiptSuffix = config.receiptSuffix;

    this.selectUserForNextSale = config.selectUserForNextSale;
    this.emailReceipt = config.emailReceipt;
    this.printReceipt = config.printReceipt;
    this.askForNote = config.askForNote;
    this.printNoteOnReceipt = config.printNoteOnReceipt;
    this.showDiscountsOnReceipt = config.showDiscountsOnReceipt;
    this.qklayoutEnabled = config.qklayoutEnabled;
    this.currentQklayoutId = config.currentQklayoutId;
    this.openingClosureId = config.openingClosureId;
    this.nextClosureIndex = config.nextClosureIndex;
    this.version = config.version;
  }
}
