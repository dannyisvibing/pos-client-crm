import request from '../../../../utils/http';

export default class RBDashboardResource {
  /**
   * Get the list of cards, tasks and catalogue to display on the dashboard.
   *
   * @method getDashboardData
   *
   * @return {Promise<DashboardData>}
   */

  static getDashboardData() {
    return request({
      url: '/dashboard/data'
    }).then(response => response.data);
  }

  /**
   * Sends an API request to save the passed filters to the active user.
   *
   * @method saveFilters
   *
   * @param  {PreferenceFilters} data
   *         The filters to be saved
   *
   * @return {Promise<any>}
   */
  static saveFilters(data) {}

  /**
   * Update the catalogue of cards - enabling/disabling cards as defined by the given catalogue.
   *
   * @method updateCatalogue
   *
   * @param  {CatalogueEntry[]} catalogue
   *
   * @return {Promise<any>}
   */
  updateCatalogue(catalogue) {}
}
