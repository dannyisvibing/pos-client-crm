import cloneDeep from 'lodash/cloneDeep';

import RBPermissionGroupModel from './permissionGroup.model';
import RBPermissionViewRadioModel from './permissionViewRadio.model';
import RBPermissionViewModel from './permissionView.model';

class RBPermissionStore {
  constructor() {
    this.ROLE_PLACEHOLDER = ':role';
    this._permissions = this._createPermissions();
  }

  /**
   * Creates an array of permission groups with their permissions.
   *
   * @method _createPermissions
   * @private
   *
   * @param  {RBPermissionViewModel} RBPermissionViewModel
   *         the RBPermissionViewModel to use
   *
   * @param  {RBPermissionGroupModel} RBPermissionGroupModel
   *         the RBPermissionGroupModel to use
   *
   * @param  {RBPermissionViewModel} RBPermissionViewModel
   *         the RBPermissionViewModel to use
   *
   * @return {Array<RBPermissionGroupModel>} an array of RBPermissionGroupModel
   *         contianing the full permissions set along with their details
   */
  _createPermissions() {
    return [
      new RBPermissionGroupModel({
        name: 'Product Costs',
        permissions: [
          new RBPermissionViewModel({
            name: 'Show Product Costs',
            description:
              'Show product costs, margins and profitability information in the Sell screen, product catalog, reporting and stock control.',
            editable: true,
            keys: ['product.cost.manage', 'product.cost.view']
          })
        ]
      }),
      new RBPermissionGroupModel({
        name: 'Labels',
        permissions: [
          new RBPermissionViewModel({
            name: 'Print Labels',
            description: `Allow ${
              this.ROLE_PLACEHOLDER
            } to print labels from the product catalogue and on stock control.`,
            editable: true,
            keys: ['barcode.print']
          })
        ]
      }),
      new RBPermissionGroupModel({
        name: 'Discounts',
        permissions: [
          new RBPermissionViewModel({
            name: 'Apply Discounts',
            description: `Allow ${
              this.ROLE_PLACEHOLDER
            } to provide discounts on a sale, including individual line
                            items. This excludes managing price books.`,
            editable: true,
            keys: ['sale.discount.manage']
          })
        ]
      }),
      new RBPermissionGroupModel({
        name: 'Sell',
        permissions: [
          new RBPermissionViewModel({
            name: 'Create or continue On-Account sales',
            editable: true,
            keys: ['sale.on_account.process']
          }),
          new RBPermissionViewModel({
            name: 'Create or continue Layby sales',
            editable: true,
            keys: ['sale.layby.process']
          }),
          new RBPermissionViewModel({
            name: 'Perform sale returns and exchanges',
            editable: true,
            keys: ['sale.return.process'],
            children: [
              new RBPermissionViewModel({
                name: 'Issue store credit for a return sale',
                editable: true,
                keys: ['store_credit.issue.return']
              })
            ]
          }),
          new RBPermissionViewModel({
            name: 'Issue manual store credit',
            editable: true,
            keys: ['store_credit.issue.manual']
          }),
          new RBPermissionViewModel({
            name: 'Void sales on Sales Ledger',
            editable: true,
            keys: ['sale.void']
          }),
          new RBPermissionViewModel({
            name: 'Edit sales on Sales Ledger',
            editable: true,
            keys: ['sale.closed.edit']
          }),
          new RBPermissionViewModel({
            name: 'Make sales',
            editable: false,
            keys: ['sell_screen.view', 'sale.regular.process']
          }),
          new RBPermissionViewModel({
            name: 'View sales history of assigned outlets',
            editable: false,
            keys: ['sale.history.view']
          }),
          new RBPermissionViewModel({
            name: 'Close registers at the end of the day',
            editable: false,
            keys: ['register.closures.perform']
          }),
          new RBPermissionViewModel({
            name: 'Sell and redeem gift cards',
            editable: false,
            keys: ['gift_card.sell', 'gift_card.redeem']
          }),
          new RBPermissionViewModel({
            name: 'Perform cash movements',
            editable: false,
            keys: [
              'cash_movement.float.add',
              'cash_movement.cash_in_out.add',
              'cash_movement.petty_cash_in_out.add'
            ]
          })
        ]
      }),
      new RBPermissionGroupModel({
        name: 'Customers',
        permissions: [
          new RBPermissionViewModel({
            name: 'Export customer list',
            editable: true,
            keys: ['customer.export']
          }),
          new RBPermissionViewModel({
            name: 'Add a new customer',
            editable: false,
            keys: ['customer.add_edit']
          }),
          new RBPermissionViewModel({
            name: 'Remove a customer',
            editable: false,
            keys: ['customer.delete']
          }),
          new RBPermissionViewModel({
            name: 'Add customers in bulk with a CSV import',
            editable: false,
            keys: ['customer.import']
          }),
          new RBPermissionViewModel({
            name: 'Add customer groups',
            editable: false,
            keys: ['customer.group.manage']
          })
        ]
      }),
      new RBPermissionGroupModel({
        name: 'Products',
        permissions: [
          new RBPermissionViewModel({
            name: 'Create and edit products',
            editable: true,
            keys: ['product.add_edit']
          }),
          new RBPermissionViewModel({
            name: 'Perform inventory counts',
            editable: true,
            keys: ['stock.inventory_count.manage']
          }),
          new RBPermissionViewModel({
            name: 'Perform supplier stock orders and returns',
            editable: true,
            keys: ['stock.supplier.order_return']
          }),
          new RBPermissionViewModel({
            name: 'Create and edit promotions',
            editable: true,
            keys: ['promotion.add_edit'],
            feature: 'promotions'
          }),
          new RBPermissionViewModel({
            name: 'Create and edit price books',
            editable: true,
            keys: ['product.price_book.manage']
          }),
          new RBPermissionViewModel({
            name: 'Perform a stock transfer',
            editable: false,
            keys: ['stock.transfer.create_send', 'stock.transfer.receive']
          })
        ]
      }),
      new RBPermissionGroupModel({
        name: 'Reporting',
        permissions: [
          new RBPermissionViewModel({
            name: 'View Sales Report ',
            editable: false,
            keys: ['reporting.inventory', 'reporting.register_closure'],
            children: [
              new RBPermissionViewRadioModel({
                onLabel: 'all sales made at assigned outlets',
                offLabel: 'only own sales',
                editable: true,
                keys: ['reporting.sales.all']
              })
            ]
          }),
          new RBPermissionViewModel({
            name: 'View reporting on payments',
            editable: false,
            keys: ['reporting.payments']
          })
        ]
      }),
      new RBPermissionGroupModel({
        name: 'Ecommerce',
        permissions: [
          new RBPermissionViewModel({
            name: 'Access Vend Ecommerce',
            editable: false,
            keys: ['ecomm.manage', 'ecomm.order.manage']
          })
        ]
      }),
      new RBPermissionGroupModel({
        name: 'Setup',
        permissions: [
          new RBPermissionViewModel({
            name: 'Manage Quick Keys',
            editable: false,
            keys: ['quick_keys.manage']
          }),
          new RBPermissionViewModel({
            name: 'Manage Payment Types',
            editable: false,
            keys: ['payment_type.add_edit', 'payment_type.delete']
          }),
          new RBPermissionViewModel({
            name: 'Add and edit Cashiers',
            editable: false,
            keys: ['user.add_edit']
          }),
          new RBPermissionViewModel({
            name: 'Manage Taxes',
            editable: false,
            keys: ['tax.manage']
          }),
          new RBPermissionViewModel({
            name: 'Add and edit Managers',
            editable: false,
            // there is no specific permission for "managing managers", so chose this one as it's enabled for admins,
            // but disabled for managers.
            keys: ['account.settings.manage']
          }),
          new RBPermissionViewModel({
            name: 'Manage Loyalty',
            editable: false,
            keys: ['loyalty.manage']
          }),
          new RBPermissionViewModel({
            name: 'Enable Add-ons',
            editable: false,
            keys: ['add_ons.manage']
          }),
          new RBPermissionViewModel({
            name: 'Manage hardware on iOS',
            editable: false,
            keys: ['mobile_client.hardware.manage']
          })
        ]
      })
    ];
  }

  /**
   * Returns the full permissions set.
   *
   * @method getAll
   * @return {Array<RBPermissionGroupModel>} the full permissions set array
   */
  getAll() {
    return cloneDeep(this._permissions);
  }
}

const rbPermissionStoreInstance = new RBPermissionStore();
export default rbPermissionStoreInstance;
