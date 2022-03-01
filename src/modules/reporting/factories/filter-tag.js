import FilterDefinitionsService from '../filter-definitions.service';

export default class FilterTag {
  constructor(attrs) {
    var filter;
    this.id = attrs.id;
    this.name = attrs.name;
    this.type = attrs.type;
    filter = FilterDefinitionsService.findByKey(this.type);
    this.typeName = filter.name;
  }
}
