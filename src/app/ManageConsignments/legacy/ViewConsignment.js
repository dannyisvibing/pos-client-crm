import React, { Component } from 'react';
import { RBLoader, RBSection } from '../../../rombostrap';
import HeaderSection from './View/Header';
import ActionBarSection from './View/ActionBar';
import DetailsSection from './View/Details';
import TargetProductsTable from './View/TargetProductsTable';
import SendEmailDialog from './Dialog/SendEmail';

import STATES from './constants/states';
import rbConsignmentResource from './api';
import rbLocalStorage from '../../../utils/localStorage';

export const SEND_EMAIL = 'stock-control-send-email';
export const RECEIVE_STOCK = 'stock-control-receive-stock';

class ViewConsignment extends Component {
  state = {
    state: STATES.inProgress,
    type: ''
  };

  componentWillMount() {
    this.trySendOrderIfNeeded = this.trySendOrderIfNeeded.bind(this);
    this.sendConsignment = this.sendConsignment.bind(this);
    this.receiveStock = this.receiveStock.bind(this);

    const { params, routerReplace } = this.props;

    var filters = {
      ids: [params.id]
    };
    rbConsignmentResource
      .get(filters)
      .then(consignments => consignments[0])
      .then(consignment => {
        if (!consignment) {
          routerReplace('/product/consignment');
        } else {
          this.setState(
            {
              state: STATES.ready,
              ...consignment
            },
            this.trySendOrderIfNeeded
          );
        }
      });
  }

  reload() {
    const { params, routerReplace } = this.props;
    if (!params.create) {
      var filters = {
        ids: [params.id]
      };
      rbConsignmentResource
        .get(filters)
        .then(consignments => consignments[0])
        .then(consignment => {
          if (!consignment) {
            routerReplace('/product/consignment');
          } else {
            this.setState({
              state: STATES.ready,
              ...consignment
            });
          }
        });
    }
  }

  trySendOrderIfNeeded() {
    if (rbLocalStorage.get(SEND_EMAIL) === 'send-on-init') {
      rbLocalStorage.remove(SEND_EMAIL);
      setTimeout(this.sendConsignment, 0);
    }

    if (rbLocalStorage.get(RECEIVE_STOCK) === 'receive-on-init') {
      rbLocalStorage.remove(RECEIVE_STOCK);
      setTimeout(this.receiveStock, 0);
    }
  }

  sendConsignment() {
    const { type, reference, supplier } = this.state;
    const { params, retailerSettings } = this.props;

    this.sendEmailDlg
      .open({
        type,
        recipientName:
          type === 'supplierOrder' || type === 'supplierReturn'
            ? supplier.name || ''
            : '',
        subject:
          type === 'supplierOrder'
            ? `Order #${reference} from ${retailerSettings.storeName}`
            : type === 'supplierReturn'
              ? `Return #${reference} from ${retailerSettings.storeName}`
              : `Transfer from ${retailerSettings.storeName}`
      })
      .then(emailConfig => {
        rbConsignmentResource
          .perform(params.id, { action: 'send', emailConfig })
          .then(() => {
            this.reload();
          })
          .then(err => {
            // doneRequest();
          });
      });
  }

  receiveStock() {
    const { params } = this.props;
    rbConsignmentResource
      .perform(params.id, { action: 'receive', slient: true })
      .then(() => {
        this.reload();
      })
      .catch(() => {
        // doneRequest();
      });
  }

  handleSend = e => {
    e.preventDefault();
    this.sendConsignment();
  };

  handleExport = e => {
    e.preventDefault();
  };

  handleMarkAsSent = e => {
    e.preventDefault();

    const { params } = this.props;
    rbConsignmentResource
      .perform(params.id, { action: 'send', slient: true })
      .then(() => {
        this.reload();
      })
      .catch(err => {
        // doneRequest();
      });
  };

  handleCancel = e => {
    e.preventDefault();

    const { params } = this.props;
    rbConsignmentResource
      .perform(params.id, { action: 'cancel' })
      .then(() => {
        this.reload();
      })
      .catch(err => {
        // doneRequest();
      });
  };

  render() {
    const { state, type, name, status, id, items } = this.state;
    var canSend = !!(items || []).length;

    return state === STATES.inProgress ? (
      <div className="ds-page-loading">
        <RBLoader />
      </div>
    ) : state === STATES.ready ? (
      <div>
        <HeaderSection name={name} status={status} />
        <ActionBarSection
          type={type}
          status={status}
          id={id}
          canSend={canSend}
          onSend={this.handleSend}
          onExport={this.handleExport}
          onMarkAsSent={this.handleMarkAsSent}
          onCancel={this.handleCancel}
        />
        <RBSection classes="vd-mtl">
          <DetailsSection
            type={type}
            supplier={this.state.supplier}
            outletId={this.state.outletId}
            sourceOutletId={this.state.sourceOutletId}
            createdAt={this.state.createdAt}
            dueAt={this.state.dueAt}
            supplierInvoice={this.state.supplierInvoice}
            reference={this.state.reference}
          />
          <TargetProductsTable
            type={type}
            status={status}
            items={this.state.items}
          />
        </RBSection>
        <SendEmailDialog ref={c => (this.sendEmailDlg = c)} />
      </div>
    ) : (
      <div />
    );
  }
}

export default ViewConsignment;
