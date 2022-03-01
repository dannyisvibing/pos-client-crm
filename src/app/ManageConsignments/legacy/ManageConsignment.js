import React, { Component } from 'react';
import moment from 'moment';
import { RBLoader, RBForm } from '../../../rombostrap';
import HeaderSection from './Manage/Header';
import ActionBarSection from './Manage/ActionBar';
import DetailsSection from './Manage/Details';
import TargetProductsSection from './Manage/TargetProducts';
// import { SEND_EMAIL, RECEIVE_STOCK } from './ViewConsignment';
import STATES from './constants/states';
import myLocalStorage from '../../../utils/localStorage';
import consignmentResource from './api';

export const SEND_EMAIL = 'stock-control-send-email';
export const RECEIVE_STOCK = 'stock-control-receive-stock';

/**
 * Form Invalid code
 * 1 - No Outlet
 * 2 - No Source Outlet
 * 3 - Outlet and Source Outlet are same
 * 4 - Send without any items
 */
class ManageConsignment extends Component {
  state = {
    state: STATES.inProgress,
    type: '',
    name: '',
    dueAt: '',
    sourceOutletId: '',
    reference: '',
    supplier: '',
    outletId: '',
    outlets: [],
    supplierInvoice: '',
    autoFill: 'yes',
    items: [],
    formInvalidCode: 0,
    formState: {}
  };

  componentWillMount() {
    const { params, myOutlets } = this.props;
    this.fullUrl = window.location.href;
    if (params.create) {
      this.setDetailsDefault(myOutlets);
    } else {
      this.resolveDetails(params.id, myOutlets);
    }
  }

  componentDidUpdate() {
    if (this.fullUrl !== window.location.href) {
      this.fullUrl = window.location.href;
      const { params, myOutlets } = this.props;
      if (!params.create) {
        this.resolveDetails(params.id, myOutlets);
      }
    }
  }

  setDetailsDefault(data) {
    const { params } = this.props;
    var state = {
      state: STATES.ready,
      outlets: data,
      name: this.getDefaultConsignmentName(params.type),
      type: params.type
    };

    this.setState(state);
  }

  resolveDetails(id, data) {
    var filters = {
      ids: [id]
    };
    consignmentResource
      .get(filters)
      .then(consignments => consignments[0])
      .then(consignment => {
        if (!consignment) {
          this.props.history.replace('/product/consignment');
        } else {
          var state = {
            ...consignment,
            state: STATES.ready,
            outlets: data[0]
          };
          if (consignment.dueAt)
            state.dueAt = moment(consignment.dueAt).toDate();
          this.setState(state);
        }
      });
  }

  getDefaultConsignmentName(type) {
    if (type === 'supplierOrder')
      return `Order - ${moment().format('ddd D MMM YYYY')}`;
    if (type === 'supplierReturn')
      return `Return - ${moment().format('ddd D MMM YYYY')}`;
    if (type === 'outletTransfer')
      return `Trans - ${moment().format('ddd D MMM YYYY')}`;
  }

  getAutoNumber(outletId) {
    var outlet = this.state.outlets.find(
      outlet => outlet.outletId === outletId
    );
    if (outlet) {
      const { params } = this.props;
      if (params.type === 'supplierOrder') {
        return `${outlet.orderNumberPrefix}-${outlet.orderNumber}`;
      } else if (params.type === 'supplierReturn') {
        return `${outlet.supplierReturnPrefix}-${outlet.supplierReturnNumber}`;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  performSave() {
    const { params, routerReplace } = this.props;
    const { type, outletId, sourceOutletId } = this.state;
    if (!outletId) {
      this.setState({ formInvalidCode: 1 });
      return;
    } else if (type === 'outletTransfer' && !sourceOutletId) {
      this.setState({ formInvalidCode: 2 });
      return;
    } else if (type === 'outletTransfer' && outletId === sourceOutletId) {
      this.setState({ formInvalidCode: 3 });
      return;
    }

    if (params.create) {
      consignmentResource
        .create(this.state)
        .then(id => {
          this.setState({ id });
          routerReplace(`/product/consignment/${id}/edit`);
        })
        .catch(err => {
          // doneRequest();
        });
    } else {
      if (params.target === 'details') {
        var { name, dueAt, reference, supplierInvoice } = this.state;
        consignmentResource
          .update(params.id, false, { name, dueAt, reference, supplierInvoice })
          .then(() => {
            routerReplace(`/product/consignment/${params.id}/edit`);
          })
          .catch(err => {
            // doneRequest();
          });
      } else {
        consignmentResource
          .update(null, true, this.state.items)
          .then(() => {
            // doneRequest();
            routerReplace(`/product/consignment/${params.id}`);
          })
          .catch(err => {
            // doneRequest();
          });
      }
    }
  }

  handleSave = e => {
    e.preventDefault();
    this.performSave();
  };

  handleDelete = e => {
    e.preventDefault();
  };

  handleSavAndSend = e => {
    e.preventDefault();
    const { items } = this.state;
    if (!items.length) {
      this.setState({ formInvalidCode: 4 });
      return;
    }
    myLocalStorage.save(SEND_EMAIL, 'send-on-init');
    this.performSave();
  };

  handleSaveAndReceive = e => {
    e.preventDefault();
    myLocalStorage.save(RECEIVE_STOCK, 'receive-on-init');
    this.performSave();
  };

  handleDetailChange = (key, value) => {
    this.setState({ [key]: value });

    if (key === 'outletId') {
      var autoNumber = this.getAutoNumber(value);
      if (autoNumber) {
        this.setState({
          autoNumber: true,
          reference: autoNumber
        });
      }
    }
  };

  handleSuggestionSelect = suggestion => {
    const { params } = this.props;
    consignmentResource
      .addItem(suggestion.productId, this.state.id)
      .then(id => {
        var filters = {
          ids: [params.id],
          itemIds: [id]
        };
        consignmentResource
          .get(filters)
          .then(consignments => consignments[0])
          .then(consignment => {
            var items = this.state.items.concat(consignment.items);
            this.setState({ items });
          });
      });
  };

  handleItemChange = (index, key, value) => {
    var items = this.state.items;
    items[index][key] = value;
    this.setState({ items });
  };

  handleItemRemove = (e, index) => {
    e.preventDefault();
    var { items } = this.state;
    consignmentResource.removeItem(items[index].id).then(() => {
      items.splice(index, 1);
      this.setState({ items });
    });
  };

  canEditItemsTable() {
    const { params } = this.props;
    return (
      !params.create &&
      (params.target === 'entire' || params.target === 'receive')
    );
  }

  handleFormStateChange = formState => {
    this.setState({ formState });
  };

  handleFormElementStateChange = (name, state) => {
    if (!this.formRef) {
      setTimeout(() => {
        this.handleFormElementStateChange(name, state);
      }, 0);
    } else {
      this.formRef.onStateChanged(name, state);
    }
  };

  render() {
    const { params } = this.props;
    const { state, type, formInvalidCode } = this.state;

    return state === STATES.inProgress ? (
      <div className="ds-page-loading">
        <RBLoader />
      </div>
    ) : state === STATES.ready ? (
      <div>
        <HeaderSection
          create={params.create}
          type={type}
          target={params.target}
        />
        <ActionBarSection
          create={params.create}
          type={type}
          target={params.target}
          formState={this.state.formState}
          onDelete={this.handleDelete}
          onSave={this.handleSave}
          onSaveAndSend={this.handleSavAndSend}
          onSaveAndReceive={this.handleSaveAndReceive}
        />
        <DetailsSection
          create={params.create}
          type={type}
          target={params.target}
          formInvalidCode={formInvalidCode}
          id={this.state.id}
          name={this.state.name}
          dueAt={this.state.dueAt}
          supplierId={this.state.supplierId}
          suppliers={this.props.suppliers}
          supplier={this.state.supplier}
          reference={this.state.reference}
          outletId={this.state.outletId}
          sourceOutletId={this.state.sourceOutletId}
          outlets={this.state.outlets}
          supplierInvoice={this.state.supplierInvoice}
          autoFill={this.state.autoFill}
          onFormChange={this.handleDetailChange}
        />
        {this.canEditItemsTable() && <hr className="vd-hr" />}
        {this.canEditItemsTable() && (
          <RBForm
            ref={c => (this.formRef = c)}
            onFormStateChanged={this.handleFormStateChange}
          >
            <TargetProductsSection
              type={type}
              target={params.target}
              items={this.state.items}
              formInvalidCode={formInvalidCode}
              onProductSelect={this.handleSuggestionSelect}
              onItemChange={this.handleItemChange}
              onItemRemove={this.handleItemRemove}
              onFormElementStateChange={this.handleFormElementStateChange}
            />
          </RBForm>
        )}
      </div>
    ) : (
      <div />
    );
  }
}

export default ManageConsignment;
