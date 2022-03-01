import React from 'react';
import { RBSection } from '../../../rombostrap';
import SearchForProducts from '../../common/containers/SearchForProductsContainer';
import QuickKeys from '../../common/components/QuickKeys';
import OpenRegisterPanel from '../../common/containers/OpenRegisterPanelContainer';
import QkLayoutSetupNeeded from './QkLayoutSetupNeeded';
import ReceiptBuilder from '../containers/ReceiptBuilderContainer';
import PayPanelSlide from '../containers/PayPanelSlideContainer';
import PaymentControlPanel from '../containers/PaymentControlPanelContainer';
import SelectVariantToSale from '../containers/SelectVariantToSaleContainer';
import WarnNoSaleNoteDialog from '../containers/WarnNoSaleNoteDialogContainer';
import SaleLostWarnDialog from '../../common/containers/SaleLostWarnDialogContainer';
import '../styles/SalePage.css';

const SalePage = props => {
  const {
    currentRegister,
    productsHash,
    qkLayout,
    closure,
    onClickQk,
    onClickProductSuggestion
  } = props;
  return (
    <div className="vd-main-content wr-main-content">
      <div className="wr-primary-view">
        <RBSection classes="wr-current-sale">
          <div className="wr-current-sale-panel wr-current-sale-panel--workspace">
            <div className="wr-transition-fade wr-full-height wr-current-sale-panel-content">
              <div className="wr-global-search">
                <SearchForProducts handler={onClickProductSuggestion} />
              </div>
              <div className="wr-workspace-module-container">
                <div className="wr-quick-keys wr-workspace-module wr-workspace-module--fit-container">
                  {currentRegister.currentQklayoutId ? (
                    <QuickKeys
                      qkKeys={qkLayout.nodes}
                      productsHash={productsHash}
                      onSelectKey={onClickQk}
                    />
                  ) : (
                    <QkLayoutSetupNeeded />
                  )}
                </div>
              </div>
            </div>
          </div>
          {closure ? <ReceiptBuilder /> : <OpenRegisterPanel />}
        </RBSection>
      </div>
      <PayPanelSlide fullScreen maxWidth={1100}>
        <PaymentControlPanel />
      </PayPanelSlide>
      <SelectVariantToSale />
      <SaleLostWarnDialog />
      <WarnNoSaleNoteDialog />
    </div>
  );
};

export default SalePage;
