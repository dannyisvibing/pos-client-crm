import reduce from 'lodash/reduce';
import * as d3 from 'd3';

/**
 * From a collection of data arrays, iterate through each set and find the overall max and min values
 *
 * @method getMinMaxFromDataset
 * @param {Array} dataset
 *        The collection of data values to iterate through
 * @param {String} accessor
 *        The accessor of the data axis to get values from e.g. X or Y axis values
 *
 * @return {Array} An array with two values, the most min and max values from the dataset
 */
export function getMinMaxFromDataset(dataset, accessor) {
  return reduce(
    dataset,
    (datasetExtent, data) => {
      // Determine the min and max values for the singular dataset
      const currentDataExtent = d3.extent(data, d => d[accessor]);

      // Compare current data and the overall dataset extent to determine the most max and min values
      const min = d3.min([currentDataExtent, datasetExtent], d => d[0]);
      const max = d3.max([currentDataExtent, datasetExtent], d => d[1]);

      return [min, max];
    },
    []
  );
}
