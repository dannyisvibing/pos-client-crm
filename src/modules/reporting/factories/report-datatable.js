import _ from 'lodash';
import EventEmitter from 'tiny-emitter';

export default class ReportDatatable extends EventEmitter {
  constructor(data, paginated) {
    super();
    var success, failure;
    this.paginated = paginated != null ? paginated : false;
    this.loading = true;
    this.canLoadMore = false;
    this.error = false;
    success = (function(_this) {
      return function() {
        var _ref;
        _this.data = data.table;
        _this.noResults =
          !_this.data || !_this.data.rows || _this.data.rows.length === 0;
        _this.loading = false;
        _this.canLoadMore =
          (_ref = data.table) != null ? _ref.moreResults : void 0;
        _this.emit('update');
        return _this.canLoadMore;
      };
    })(this);
    failure = (function(_this) {
      return function(error) {
        _this.loading = false;
        _this.error = error;
        _this.emit('update');
      };
    })(this);
    data.then(success, failure);
  }

  loadMore(data) {
    return data.then(table => {
      if (table.rows.length) {
        _.forEach(table.rows, function(row) {
          return this.data.rows.push(row);
        });
        _.forEach(table.headers.rows, function(row) {
          return this.data.headers.rows.push(row);
        });
        _.forEach(table.headers.rowIds, function(row) {
          return this.data.headers.rowIds.push(row);
        });
        _.forEach(table.aggregates.row, function(row) {
          return this.data.aggregates.row.push(row);
        });
        _.forEach(table.headers.rowMetadata, function(row) {
          return this.data.headers.rowMetadata.push(row);
        });
        this.data.aggregates.table = table.aggregates.table;
        this.data.aggregates.column = table.aggregates.column;
        this.canLoadMore = table.moreResults;
      } else {
        this.canLoadMore = false;
      }
      this.noResults = !this.data;
      this.loading = false;
      this.emit('update');
      return this.loading;
    });
  }

  applyFormatterOptions(options) {
    var _ref;
    if (((_ref = this.data.currency) != null ? _ref.symbol : void 0) != null) {
      options.currencySymbol = this.data.currency.symbol;
      return (this.loading = false);
    }
  }
}
