import ReportData from './report-data';
import BlobDownload from '../../../utils/blobDownload';
import DimensionDefinitionsService from '../dimension-definitions.service';

function includeMetadata(def) {
  var dim, dimDef, dimType, _i, _len, _ref;
  _ref = ['row', 'column'];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    dimType = _ref[_i];
    var _j, _len1, _ref1;
    _ref1 = def.dimensions[dimType];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      dim = _ref1[_j];
      dimDef = DimensionDefinitionsService.findByKey(dim.key);
      if (dimDef.exportMetadata != null) {
        dim.metadata = dimDef.exportMetadata;
      }
      _ref1[_j] = dim;
    }
    def.dimensions[dimType] = _ref1;
  }
  return def;
}

function queryDefinition(definition) {
  var columnDimension, def;
  def = definition.queryDefinition();
  def = includeMetadata(def);
  if (def.report.hasDateFilter()) {
    columnDimension = DimensionDefinitionsService.findByKey(
      def.granularitySelection.granularity.key
    );
    if (columnDimension) {
      def.addDimension('column', columnDimension);
    }
  }
  def.size = 0;
  return def;
}

function download(definition) {
  var filename, data, _success, _error;
  filename = definition.identifier() + '.csv';
  data = ReportData.get(queryDefinition(definition), 'csv');
  _success = resp => {
    // var disposition, download, filenameMatch;
    // disposition = resp.headers.get('content-disposition');
    // filenameMatch = disposition.match(/filename="([^"]+)"/);
    // if ((filenameMatch != null ? filenameMatch.length : void 0) === 2) {
    //     filename = filenameMatch[1];
    // }
    resp.blob().then(blob => {
      const blobDownload = new BlobDownload(blob, filename);
      blobDownload.download();
    });
  };
  _error = error => {};
  data.then(_success, _error);
}

export default download;
