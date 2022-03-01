export default class AdvancedReportingService {
  static isDefinitionAccessible(def) {
    if (def == null) {
      def = {};
    }
    if (!def.isAdvanced) {
      return true;
    } else {
      return true;
    }
  }

  static userCanAccessAdvancedReporting() {
    return true;
  }
}
