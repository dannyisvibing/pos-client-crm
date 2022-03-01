import EventEmitter from 'tiny-emitter';
import * as find from 'lodash/find';

import Period from '../../constants/period.enum';
import { ProductsBy } from '../product-performance/product-performance.service';

import rbDashboardResource from './dashboard.resource';
import RBCardService from '../card/card.service';
import RBTaskService from '../task/task.service';
import rbOutletReportService from '../report/outlet-report.service';
import rbUserReportService from '../report/user-report.service';

export const DASHBOARD_EVENTS = {
  PERIOD_CHANGE: 'periodChange',
  OUTLET_CHANGE: 'outletChange',
  USER_CHANGE: 'userChange',
  PRODUCTS_BY_CHANGE: 'productsByChange',
  REFRESH: 'refresh',
  DASHBOARD_STATE: 'dashboardState'
};

const defaultPreferences = {
  // DashboardPreferences
  filters: {
    outletId: null,
    period: Period.Day
  }
};

const REFRESH_INTERVAL = 120000;

class RBDashboardService extends EventEmitter {
  getUser() {
    return this._user;
  }

  getUserOutlets() {
    return this._userOutlets;
  }

  getPeriod() {
    return this._period;
  }

  getOutlet() {
    return this._outlet;
  }

  getProductsBy() {
    return this._productsBy;
  }

  getCatalogue() {
    return this._catalogue;
  }

  /**
   * Gets the store context subject
   *
   * @method getStoreContextSubject
   *
   * @return {string}
   */
  getStoreContextSubject() {
    if (this._userOutlets.length === 1) {
      return 'your store';
    }

    return this._outlet ? 'this store' : 'your stores';
  }

  init(activeUser, userOutlets) {
    // To Do
    // Outlets, retailer and features should be fetched from api server
    this.cardService = new RBCardService();
    this.taskService = new RBTaskService();
    this._user = activeUser;
    this._userOutlets = userOutlets;
    return this.reloadDashboard();
  }

  /**
   * Reload the dashboard by re-fetching the cards to display from the API and refreshing the user and outlet API
   * data.
   *
   * @method reloadDashboard
   * @return {Promise}
   */
  reloadDashboard() {
    return this._loadDashboard().then(() => {
      this._loadOutletReportData();
      this._loadUserReportData();
    });
  }

  /**
   * Sets a new outlet - tracks a couple of UBEs and remembers the newly selected outlet in local storage.
   *
   * @method setOutlet
   *
   * @param  {Hash} outlet
   * @param  {Hash} [options]
   *         @param {Boolean} [options.quiet]
   *                If enabled will not trigger events, UBEs or data loads related to the change. For use during init.
   */
  setOutlet(outlet, options = {}) {
    const previousValue = this._outlet;

    if (outlet !== previousValue) {
      this._outlet = outlet;

      if (!options.quiet) {
        this._loadOutletReportData();

        const currentValue = outlet;
        this.emit(DASHBOARD_EVENTS.OUTLET_CHANGE, {
          currentValue,
          previousValue
        });

        this._saveFilters();
        this._loadTasks();
        this._startPoll();
      }
    }
  }

  /**
   * Sets a new period - tracks a couple of UBEs and remembers the newly selected period in local storage.
   *
   * @method setPeriod
   *
   * @param  {Period} period
   */
  setPeriod(period) {
    const previousValue = this._period;
    if (period !== previousValue) {
      this._period = period;

      this._loadOutletReportData();
      this._loadUserReportData();

      const currentValue = this._period;
      this.emit(DASHBOARD_EVENTS.PERIOD_CHANGE, {
        currentValue,
        previousValue
      });

      this._saveFilters();
      this._loadTasks();
      this._startPoll();
    }
  }

  /**
   * Set the products by filter preference.
   *
   * @method setProductsBy
   *
   * @param  productsBy {ProductsBy}
   */
  setProductsBy(productsBy) {
    const previousValue = this._productsBy;

    if (productsBy !== previousValue) {
      this._productsBy = productsBy;

      const currentValue = this._productsBy;
      this.emit(DASHBOARD_EVENTS.PRODUCTS_BY_CHANGE, {
        currentValue,
        previousValue
      });
      this._saveFilters();
    }
  }

  setCatalogue(catalogue) {
    var payload;
    const previousValue = this._catalogue;
    if (catalogue !== previousValue) {
      payload = {
        cards: catalogue.filter(item => item.enabled),
        catalogue: catalogue
      };
      this._setUserCards(payload);
      this.emit(DASHBOARD_EVENTS.DASHBOARD_STATE, { loading: true });
      this._startPoll();
      setTimeout(() => {
        this.emit(DASHBOARD_EVENTS.DASHBOARD_STATE, { loading: false });
      }, 500);
    }
  }

  /**
   * Sets the user preferences from the API.
   *
   * @private
   * @method __setUserPreferences
   * @param {DashboardPreferences} preferences
   */
  _setUserPreferences(preferences) {
    preferences.filters = preferences.filters || {};
    this._period = preferences.filters.period || Period.Day;
    this._productsBy = preferences.filters.productsBy || ProductsBy.BY_COUNT;

    const rememberedOutletId = preferences.filters.outletId;
    const rememberedOutlet =
      rememberedOutletId &&
      find(this._userOutlets, { outletId: rememberedOutletId });
    this.setOutlet(rememberedOutlet || null, { quiet: true });
  }

  /**
   * Refresh the dashboard. Refreshes outlet/user report data, refreshes the task list and emits the `refresh` event
   * so that cards etc can re-render with the updated data etc.
   *
   * @private
   * @method _refreshDashboard
   */
  _refreshDashboard() {
    this._loadOutletReportData();
    this._loadUserReportData();
    this.taskService.refreshTasks(this._period, this._outlet);
    this.emit(DASHBOARD_EVENTS.REFRESH);
  }

  /**
   * Start (or restart) the regular poll to update data/tasks in the dashboard.
   *
   * @private
   * @method _startPoll
   */
  _startPoll() {
    this._cancelPoll();
    this._pollInterval = setTimeout(() => {
      this._refreshDashboard();
    }, REFRESH_INTERVAL);
  }

  /**
   * Cancel the regular poll that updates data/tasks in the dashboard.
   *
   * @private
   * @method _cancelPoll
   */
  _cancelPoll() {
    if (this._pollInterval) {
      clearTimeout(this._pollInterval);
      this._pollInterval = null;
    }
  }

  _loadDashboard() {
    this.emit(DASHBOARD_EVENTS.DASHBOARD_STATE, { loading: true });
    this._cancelPoll();
    return (
      rbDashboardResource
        .getDashboardData()
        /**
         * @return {DashboardData}
         */
        .then(data => {
          this._setUserCards(data);
          this._setUserPreferences(data.preferences);
          // this._loadTasks();
          this._startPoll();
          this.emit(DASHBOARD_EVENTS.DASHBOARD_STATE, { loading: false });
        })
        .catch(err => {
          this._setUserPreferences(defaultPreferences);
          // this._loadTasks();
          this._startPoll();
          this.emit(DASHBOARD_EVENTS.DASHBOARD_STATE, {
            failed: true,
            loading: false
          });
        })
    );
  }

  _saveFilters() {}

  _loadTasks() {
    this.taskService.loadTasks(this._period, this._outlet);
  }

  /**
   * Sets and registers the available cards for the active user.
   *
   * @private
   * @method _setUserCards
   * @param  {DashboardData} userCards
   */
  _setUserCards(payload) {
    this.cardService.register(payload);
    this._catalogue = payload.catalogue;
    //To Do - remove later
    this.cardService.setPrimaryCard();

    this.taskService.register(payload.tasks);
  }

  _loadOutletReportData() {
    return rbOutletReportService.loadData(this._outlet, this._period);
  }

  _loadUserReportData() {
    return rbUserReportService.loadData(this._user, this._period);
  }
}

const rbDashboardService = new RBDashboardService();
export default rbDashboardService;
