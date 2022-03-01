import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import MainLayout from '../../common/containers/MainLayoutContainer';
import ProductsLayout from '../../common/containers/ProductsLayoutContainer';
import ManageProducts from '../../ManageProducts';
import ManagePricebooks from '../../ManagePricebooks';
import ManageConsignments from '../../ManageConsignments';
import ManageInventoryCounts from '../../ManageInventoryCount';
import ProductTypeDialog from '../../common/containers/ProductTypeDialogContainer';
import ProductBrandDialog from '../../common/containers/ProductBrandDialogContainer';
import ProductSupplierDialog from '../../common/containers/ProductSupplierDialogContainer';
import ProductTagDialog from '../../common/containers/ProductTagDialogContainer';
import WarnPermanentActionDialog from '../../common/containers/WarnPermanentActionDialogContainer';
import OfflineNotificationDialog from '../../common/containers/OfflineNotificationDialogContainer';
import { logRender } from '../../../utils/debug';

const RoutesConfig = () => {
  logRender('render Products Routes');
  return (
    <MainLayout>
      <ProductsLayout>
        <Switch>
          <Route
            path="/product/inventory_count/:action?/:id?"
            component={ManageInventoryCounts}
          />
          <Route
            path="/product/consignment/:actionOrId?/:action?"
            component={ManageConsignments}
          />
          <Route
            path="/product/price_book/:action?/:id?"
            component={ManagePricebooks}
          />
          <Route path="/product/:action?/:id?" component={ManageProducts} />
          <Redirect path="/product/*" to="/product" />
        </Switch>
      </ProductsLayout>
      <ProductTypeDialog />
      <ProductBrandDialog />
      <ProductSupplierDialog />
      <ProductTagDialog />
      <WarnPermanentActionDialog />
      <OfflineNotificationDialog />
    </MainLayout>
  );
};

export default RoutesConfig;
