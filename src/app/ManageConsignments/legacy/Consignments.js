import React, { Component } from 'react';
import queryString from 'query-string';
import _ from 'lodash';
import moment from 'moment';
import { RBSection, RBHeader, RBFlex } from '../../../rombostrap';
import RBButton, {
  RBButtonGroup
} from '../../../rombostrap/components/RBButton';
import Filter from './Filter';
import List from './ListContainer';
import STATES from './constants/states';
import Filters from './constants/filter';
import { logRender } from '../../../utils/debug';
import api from './api';

class Consignments extends Component {
  state = {
    state: STATES.inProgress,
    filter: '',
    name: '',
    outlet_id: '',
    moreFilter: false,
    dateFrom: '',
    dateTo: '',
    dueDateFrom: '',
    dueDateTo: '',
    supplierId: ''
  };

  componentWillMount() {
    this.outlets = [];
    this.suppliers = [];
    this.consignments = [];
    const { suppliers, myOutlets } = this.props;
    this.init([suppliers, myOutlets]);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.fullUrl === window.location.href) return;
    this.init();
  }

  init(config) {
    this.fullUrl = window.location.href;
    if (config) {
      this.suppliers = config[0];
      this.outlets = config[1];
    }

    this.search = this.parseFilterFromUrl();
    this.setState({ ...this.search });
    this.search = _.pickBy(this.search, d => !!d);
    this.getData();
  }

  parseFilterFromUrl() {
    var search,
      filterEntity,
      filters = {},
      moreFilters = {};
    search = queryString.parse(this.props.location.search);
    filterEntity = this.validityFilter(search.filter);

    filters = {
      ...filterEntity,
      name: search.name,
      outlet_id: _.find(this.outlets, { outlet_id: search.outlet_id })
        ? search.outlet_id
        : '',
      order: search.order || 'created_at',
      dir: search.dir || 'asc'
    };
    moreFilters = {
      supplierId: _.find(this.suppliers, { id: search.supplierId })
        ? search.supplierId
        : '',
      dateFrom: this.ensureValid(search.dateFrom),
      dateTo: this.ensureValid(search.dateTo),
      dueDateFrom: this.ensureValid(search.dueDateFrom),
      dueDateTo: this.ensureValid(search.dueDateTo)
    };

    if (_.keys(_.pickBy(moreFilters, d => !!d)).length > 0) {
      filters = _.merge(filters, moreFilters);
      filters.moreFilter = true;
    }
    return filters;
  }

  ensureValid(date) {
    var ref = moment(date);
    return !!date && ref.isValid() ? ref.format() : '';
  }

  validityFilter(filter) {
    var filterEntity;
    filterEntity = Filters.find(
      filterEntity => filterEntity.entity === filter
    ) || {
      entity: '',
      status: '',
      type: ''
    };
    return {
      filter: filterEntity.entity,
      status: filterEntity.status,
      type: filterEntity.type
    };
  }

  async getData() {
    let consignments = await api.get(this.search);
    consignments = consignments.filter(
      consignment => consignment.type !== 'stocktake'
    );
    this.consignments = consignments.filter(item => item.type !== 'stocktake');
    this.setState({ state: STATES.ready });
  }

  updateUrl() {
    this.props.history.push({
      pathname: '/product/consignment',
      search: queryString.stringify(this.search)
    });
  }

  handleLessMoreFilters = e => {
    e.preventDefault();
    this.setState({ moreFilter: !this.state.moreFilter });
  };

  handleFilterChange = (filterType, filterValue) => {
    this.setState({ [filterType]: filterValue });
  };

  handleFilterUpdate = e => {
    e && e.preventDefault();
    const {
      filter,
      name,
      outlet_id,
      order,
      dir,
      dateFrom,
      dateTo,
      dueDateFrom,
      dueDateTo,
      supplierId,
      moreFilter
    } = this.state;
    var filters = {},
      moreFilters = {};
    filters = { filter, name, outlet_id, order, dir };
    moreFilters = {
      dateFrom: this.ensureValid(dateFrom),
      dateTo: this.ensureValid(dateTo),
      dueDateFrom: this.ensureValid(dueDateFrom),
      dueDateTo: this.ensureValid(dueDateTo),
      supplierId
    };
    this.search = moreFilter ? _.merge(filters, moreFilters) : filters;
    this.updateUrl();
  };

  handleSort = prop => {
    var order, dir;
    order = this.state.order;
    dir = this.state.dir;
    dir = order !== prop ? 'asc' : dir === 'asc' ? 'desc' : 'asc';
    order = prop;
    this.setState({ order, dir }, () => {
      this.handleFilterUpdate();
    });
  };

  render() {
    logRender('render Consignments');
    return (
      <div>
        <RBSection>
          <RBHeader category="page">Stock Control</RBHeader>
        </RBSection>
        <RBSection type="secondary">
          <RBFlex flex flexJustify="between" flexAlign="center">
            <span className="vd-mrl">A list of all of your consignments</span>
            <RBButtonGroup>
              <RBButton
                category="secondary"
                href="/product/consignment/newSupplier"
              >
                Order Stock
              </RBButton>
              <RBButton
                category="secondary"
                href="/product/consignment/newReturn"
              >
                Return Stock
              </RBButton>
              <RBButton
                category="secondary"
                href="/product/consignment/newOutlet"
              >
                Transfer Stock
              </RBButton>
              <RBButton category="secondary" href="/product/inventory_count">
                Inventory Count
              </RBButton>
            </RBButtonGroup>
          </RBFlex>
        </RBSection>
        <Filter
          filter={this.state.filter}
          name={this.state.name}
          outlet_id={this.state.outlet_id}
          moreFilter={this.state.moreFilter}
          dateFrom={this.state.dateFrom}
          dateTo={this.state.dateTo}
          dueDateFrom={this.state.dueDateFrom}
          dueDateTo={this.state.dueDateTo}
          supplierId={this.state.supplierId}
          outlets={this.outlets}
          suppliers={this.suppliers}
          onLessMoreFilters={this.handleLessMoreFilters}
          onFilterChange={this.handleFilterChange}
          onFilterUpdate={this.handleFilterUpdate}
        />
        <RBSection>
          <List
            state={this.state.state}
            consignments={this.consignments}
            order={this.state.order}
            orderDirection={this.state.dir}
            onSort={this.handleSort}
          />
        </RBSection>
      </div>
    );
  }
}

export default Consignments;
