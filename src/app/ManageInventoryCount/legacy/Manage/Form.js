import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import ActionBar from './ActionBar';
import FilterProductSearch from './FilterProductSearch';
import SimpleDatePicker from '../../../common/components/SimpleDatePicker';
import STATES from '../../../../constants/states';
import API_STOCKTAKE_STATUS from '../../../../constants/stocktake/api-status';
import Stocktake from '../../../../modules/idb/model/stocktake';
import stocktakeDateCreate from '../../../../modules/idb/utils/stocktake-date';
import {
  RBSection,
  RBHeader,
  RBFlex,
  RBP,
  RBSelect,
  RBSegControl,
  RBSwitch
} from '../../../../rombostrap';
import RBInput from '../../../../rombostrap/components/RBInputV1';
import RBField, {
  RBLabel,
  RBValue
} from '../../../../rombostrap/components/RBField';
import stocktakeResource from '../api/stocktake';

class Form extends Component {
  state = {
    state: STATES.inProgress,
    name: '',
    scheduledDate: null,
    scheduledTime: null,
    outletId: '',
    countType: 'partial',
    includeInactive: false,
    isSaving: false,
    isStarting: false
  };

  componentWillMount() {
    this.selectedFilters = [];
    const { isCreatePage } = this.props;
    if (isCreatePage) {
      this._initCreateForm();
    } else {
      this._initEditForm();
    }
  }

  defaultStocktakeName() {
    var dateStr, timeStr, selectedOutlet;
    const { name, scheduledDate, scheduledTime, outletId } = this.state;
    const { isCreatePage, outlets } = this.props;

    if (!outletId) return;

    dateStr = scheduledDate || '';
    timeStr = scheduledTime || '';
    if (!name && isCreatePage) {
      dateStr = moment(dateStr).format('DD MMM YYYY');
      selectedOutlet = _.find(outlets, { outletId: outletId }) || {
        outletName: ''
      };
      this.setState({
        name: selectedOutlet.outletName + '-' + dateStr + ' ' + timeStr
      });
    }
  }

  _initCreateForm() {
    this.stocktake = new Stocktake();
    this._initDefaultValues();
    this.setState({ state: STATES.ready });
  }

  _initEditForm() {
    var countType;
    this.stocktake = this.props.stocktake;
    this._initDateTimeFields();

    if (this.stocktake.isPartial()) {
      this.selectedFilters = this.stocktake.getFilters();
      countType = 'partial';
    } else {
      countType = 'full';
    }

    this.setState({
      state: STATES.ready,
      name: this.stocktake.name,
      outletId: this.stocktake.outletId,
      countType: countType,
      includeInactive: this.stocktake.showInactive
    });
  }

  _initDefaultValues() {
    const { outlets } = this.props;
    this._initDateTimeFields();

    if (outlets.length === 1) {
      this.setState({ outletId: outlets[0].outletId });
      setTimeout(() => {
        this.defaultStocktakeName();
      }, 0);
    }
  }

  _initDateTimeFields() {
    if (!this.stocktake.dueAt) {
      this.stocktake.dueAt = new Date();
      this.stocktake.dueAt.setHours(this.stocktake.dueAt.getHours() + 1);
      this.stocktake.dueAt.setMinutes(0);
    }

    this.setState({
      scheduledDate: moment(this.stocktake.dueAt).toDate(),
      scheduledTime: moment(this.stocktake.dueAt).format('h:mm a')
    });
  }

  _manageStocktake(status, url) {
    const { isCreatePage } = this.props;
    var stocktake = this.stocktake,
      params;

    params = this._getApiParams();
    params.status = status;
    if (isCreatePage) {
      stocktakeResource.save(params).then(stocktakeId => {
        this.props.router.replace(url.replace(':id', stocktakeId));
      });
    } else {
      stocktakeResource.update(params, stocktake.id).then(stocktakeId => {
        this.props.router.replace(url.replace(':id', stocktakeId));
      });
    }
  }

  _canStartStocktake() {
    const { countType } = this.state;
    if (
      countType === 'partial' &&
      (!this.productResults || !this.productResults.length)
    ) {
      return false;
    } else {
      return true;
    }
  }

  _getApiParams() {
    var {
      scheduledDate,
      scheduledTime,
      includeInactive,
      countType,
      name,
      outletId
    } = this.state;
    var stocktake = this.stocktake,
      partialFilters,
      dueAt;

    if (countType === 'partial' && stocktake.filters.length) {
      partialFilters = stocktake.getPluralisedFilters(false);
    } else {
      partialFilters = [];
    }

    scheduledDate = moment(scheduledDate).format('DD-MM-YYYY');
    dueAt = stocktakeDateCreate(scheduledDate, scheduledTime);
    return {
      outletId: outletId,
      dueAt: dueAt.toISOString(),
      showInactive: includeInactive,
      name: name,
      status: stocktake.status,
      filters: partialFilters
    };
  }

  _successHandler(stocktake, url) {
    this.setState({ isStarting: false, isSaving: false });
    this.props.history.push(url.replace(':id', stocktake.id));
  }

  _errorHandler() {}

  handleGeneralInputChange = (key, value) => {
    this.setState({ [key]: value });
    if (key !== 'name') {
      this.defaultStocktakeName();
    }
  };

  handleSelectCountType = e => {
    this.setState({ countType: e.target.value });
  };

  handleIncludeInactiveProducts = e => {
    this.setState({ includeInactive: e.target.checked });
  };

  handleFilterChange = stocktake => {
    this.stocktake = stocktake;
    this.selectedFilters = this.stocktake.getFilters();
  };

  handleFilteredProductsUpdate = productResults => {
    this.productResults = productResults;
  };

  handleSave = e => {
    e.preventDefault();
    this.setState({ isSaving: true });
    this._manageStocktake(
      API_STOCKTAKE_STATUS.stocktake,
      '/product/inventory_count'
    );
  };

  handleStart = e => {
    e.preventDefault();
    if (!this._canStartStocktake()) {
      return;
    }
    this.setState({ isStarting: true });
    this._manageStocktake(
      API_STOCKTAKE_STATUS.inProgress,
      '/product/inventory_count/perform/:id'
    );
  };

  render() {
    const {
      scheduledDate,
      scheduledTime,
      name,
      outletId,
      countType,
      includeInactive,
      isSaving,
      isStarting
    } = this.state;
    const { outlets = [], isCreatePage, singleOutlet } = this.props;
    return (
      <div>
        <ActionBar
          isSaving={isSaving}
          isStarting={isStarting}
          onSave={this.handleSave}
          onStart={this.handleStart}
        />
        <form>
          <RBSection classes="vd-mtl">
            <RBHeader category="settings">General</RBHeader>
            <RBFlex flex>
              <RBFlex
                classes="vd-col-2 vd-mrxl"
                flex
                flexDirection="column"
                flexType="responsive-column"
              >
                <RBP>
                  Start an inventory count now or schedule one for the future.
                </RBP>
              </RBFlex>
              <RBFlex
                classes="vd-col-8"
                flex
                flexDirection="column"
                flexType="responsive-column"
              >
                <RBFlex flex>
                  <RBField short classes="vd-mrl">
                    <RBLabel>Start Date</RBLabel>
                    <RBValue>
                      <SimpleDatePicker
                        date={scheduledDate}
                        onSelectDay={date =>
                          this.handleGeneralInputChange('scheduledDate', date)
                        }
                      />
                    </RBValue>
                  </RBField>
                  <RBField short>
                    <RBLabel>Start Time</RBLabel>
                    <RBValue>
                      <RBInput
                        value={scheduledTime}
                        onInputChange={date =>
                          this.handleGeneralInputChange('scheduledTime', date)
                        }
                      />
                    </RBValue>
                  </RBField>
                </RBFlex>
              </RBFlex>
            </RBFlex>
            <RBFlex flex>
              <RBFlex
                classes="vd-col-2 vd-mrxl"
                flex
                flexDirection="column"
                flexType="responsive-column"
              />
              <RBFlex
                classes="vd-col-8"
                flex
                flexDirection="column"
                flexType="responsive-column"
              >
                <RBFlex flex>
                  <RBField short classes="vd-mrl">
                    <RBLabel>Outlet</RBLabel>
                    <RBValue>
                      <RBSelect
                        disabled={!isCreatePage || singleOutlet}
                        selectedEntity={outletId}
                        nullLabel="Select outlet..."
                        entityKey="outletName"
                        entityValue="outletId"
                        entities={outlets}
                        onChange={outlet =>
                          this.handleGeneralInputChange(
                            'outletId',
                            outlet.outletId
                          )
                        }
                      />
                    </RBValue>
                  </RBField>
                  <RBField short>
                    <RBLabel>Count Name</RBLabel>
                    <RBInput
                      value={name}
                      onInputChange={name =>
                        this.handleGeneralInputChange('name', name)
                      }
                    />
                  </RBField>
                </RBFlex>
              </RBFlex>
            </RBFlex>
            <hr className="vd-hr vd-mtxl vd-mbxl" />
            <RBHeader category="settings">Choose Products to Count</RBHeader>
            <RBFlex flex>
              <RBFlex
                classes="vd-col-2 vd-mrxl"
                flex
                flexDirection="column"
                flexType="responsive-column"
              >
                <RBP>
                  You can include inactive products, which are not available for
                  sale but may still be in stock.
                </RBP>
              </RBFlex>
              <RBFlex
                classes="vd-col-8"
                flex
                flexDirection="column"
                flexType="responsive-column"
              >
                <RBFlex flex>
                  <RBSegControl
                    classes="vd-col-8"
                    value="partial"
                    checked={countType === 'partial'}
                    onChange={this.handleSelectCountType}
                  >
                    <RBHeader>Partial Count</RBHeader>
                    <hr className="vd-hr" />
                    <span>
                      Specify the products to include in this inventory count.
                    </span>
                  </RBSegControl>
                  <RBSegControl
                    classes="vd-col-8"
                    value="full"
                    checked={countType === 'full'}
                    onChange={this.handleSelectCountType}
                  >
                    <RBHeader>Full Count</RBHeader>
                    <hr className="vd-hr" />
                    <span>
                      Include all the products in this inventory count.
                    </span>
                  </RBSegControl>
                </RBFlex>
              </RBFlex>
            </RBFlex>
            <RBFlex flex>
              <RBFlex
                classes="vd-col-2 vd-mrxl"
                flex
                flexDirection="column"
                flexType="responsive-column"
              />
              <RBFlex
                classes="vd-col-8 vd-mtl"
                flex
                flexDirection="column"
                flexType="responsive-column"
              >
                <div>
                  <RBHeader category="section" classes="vd-mtl">
                    {countType === 'full' ? 'All' : [].length} products will be
                    counted, {includeInactive ? 'including' : 'excluding'}{' '}
                    inactive products.
                  </RBHeader>
                </div>
                <RBField>
                  <RBFlex flex flexAlign="center" classes="vd-field vd-mtm">
                    <RBSwitch
                      modifiers={['small']}
                      checked={includeInactive}
                      onChange={this.handleIncludeInactiveProducts}
                    />
                    <div className="vd-mlm">Include inactive products</div>
                  </RBFlex>
                </RBField>
                {countType !== 'full' && (
                  <FilterProductSearch
                    selectedFilters={this.selectedFilters}
                    stocktake={this.stocktake}
                    includeInactive={includeInactive}
                    onFilterChange={this.handleFilterChange}
                    onProductResultsUpdate={this.handleFilteredProductsUpdate}
                  />
                )}
              </RBFlex>
            </RBFlex>
          </RBSection>
        </form>
      </div>
    );
  }
}

export default Form;
