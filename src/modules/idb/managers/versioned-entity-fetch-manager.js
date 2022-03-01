import VERSIONED_ENTITIES from '../versioned-entities';
import APIs from '../../../constants/api';
import request from '../../../utils/http';
const DEFAULT_PAGE_SIZE = 1000;

export default class versionedEntityFetchManager {
  static fetchPage(params) {
    var entity = params.entity,
      apiParams = params.apiParams,
      url;

    apiParams.pageSize = apiParams.pageSize || DEFAULT_PAGE_SIZE;

    if (entity === VERSIONED_ENTITIES.products) {
      url = APIs.products;
    } else {
      url = APIs.versionedEntity.replace(':entity', entity);
    }

    return request({
      url,
      params: apiParams
    }).then(response => response.data);
  }
}
