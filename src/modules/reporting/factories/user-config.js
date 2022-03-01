import _ from 'lodash';
import AvailableWidgetDefinitions from './widget-definitions';
import AggregateDefinitionsService from '../aggregate-definitions.service';
// import rbActiveUser from '../../active-user';
import rbLocalStorageService from '../../../utils/localStorage';

export default class UserConfig {
  WIDGETS_VERSION = 1;

  constructor() {
    this.widgets = this.getWidgets();
    this.assertValidity();
  }

  assertValidity() {
    var widget, _i, _len, _ref;
    _ref = this.getWidgets();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      widget = _ref[_i];
      if (!AggregateDefinitionsService.findByKey(widget.aggregate)) {
        this.initWidgets();
        this.widgets = this.getWidgets();
        return;
      }
    }
  }

  get(key) {
    return rbLocalStorageService.get(key);
  }

  set(key, data) {
    return rbLocalStorageService.save(key, data);
  }

  initWidgets() {
    var widgets;
    widgets = _.filter(AvailableWidgetDefinitions, function(widgetDefinition) {
      return !widgetDefinition.permission || true;
      // return (
      //   !widgetDefinition.permission ||
      //   rbActiveUser.hasPermission(widgetDefinition.permission)
      // );
    });
    this.set('widgets' + this.WIDGETS_VERSION, widgets);
    return widgets;
  }

  getWidgets() {
    return this.initWidgets();
  }

  addWidget(newWidget) {
    this.widgets.push(newWidget);
    return this.set('widgets' + this.WIDGETS_VERSION, this.widgets);
  }

  removeWidget(widget) {
    _.remove(this.widgets, widget);
    return this.set('widgets' + this.WIDGETS_VERSION, this.widgets);
  }
}
