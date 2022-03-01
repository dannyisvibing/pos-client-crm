import React, { Component } from 'react';
import ReactDom from 'react-dom';
import forEach from 'lodash/forEach';
import defaults from 'lodash/defaults';
import cloneDeep from 'lodash/cloneDeep';
import * as d3 from 'd3';

import {
  abbreviateNumber,
  getLinearYAxisDomain,
  getElementPureSize
} from './util';
import WindowDelegate from '../../../utils/windowDelegate';

const LINEAR_SCALE = 'linear';
const TIME_SCALE = 'time';
const DEFAULT_CONFIG = {
  margin: {
    top: 30,
    right: 0,
    bottom: 34,
    left: 0
  },
  xScaleType: LINEAR_SCALE,
  yScaleType: LINEAR_SCALE,
  xAccessor: 'x',
  yAccessor: 'y'
};

class BaseChart extends Component {
  state = {};

  constructor(defaultConfig = {}) {
    super();
    this._chart = {};
    this._defaultConfig = defaults({}, defaultConfig, DEFAULT_CONFIG);

    this._drawOnResize = this._drawOnResize.bind(this);
  }

  componentDidMount() {
    const windowDelegate = WindowDelegate.getInstance();
    var element = ReactDom.findDOMNode(this);
    this._chart.svg = d3.select(element);
    this._chart.canvas = this._chart.svg.append('g');

    windowDelegate.on(windowDelegate.EVENTS().resize, this._drawOnResize);

    this._updateConfig(this.props.config);
    this._configure();
    this._draw();
  }

  componentWillReceiveProps(nextProps) {
    const { data, config } = nextProps;

    if (config) {
      this._updateConfig(nextProps.config);
      this._configure();
      this._draw();
    } else if (data) {
      this._draw();
    }
  }

  componentWillUnmount() {
    const windowDelegate = WindowDelegate.getInstance();
    windowDelegate.off(windowDelegate.EVENTS().resize, this._drawOnResize);
  }

  /**
   * Updates the chart config based off the bound object and default config
   *
   * @private
   * @method _updateConfig
   */
  _updateConfig(config) {
    this._config = defaults({}, config, this._defaultConfig);
  }

  /**
   * Configure the scale that d3 will use to determine axes and data visualizations
   *
   * @protected
   * @method _configureScale
   */
  _configureScale() {
    this._chart.xScale =
      this._config.xScaleType === TIME_SCALE ? d3.scaleUtc() : d3.scaleLinear();
    this._chart.yScale =
      this._config.yScaleType === TIME_SCALE ? d3.scaleUtc() : d3.scaleLinear();
  }

  /**
   * Configures how D3 should map data values to chart coordinates for each axis
   *
   * @protected
   * @method _configureAxisCoordinateMaps
   */
  _configureAxisCoordinateMaps() {
    const chart = this._chart;
    const config = this._config;

    chart.xMap = d => chart.xScale(d[config.xAccessor]);
    chart.yMap = d => chart.yScale(d[config.yAccessor]);
  }

  /**
   * Configure how axes, grids and ticks are displayed
   *
   * @protected
   * @method _configureAxesAndGrids
   */
  _configureAxesAndGrids() {
    const chart = this._chart;
    const config = this._config;

    // Configure offset distance of the tick text from the x axis line
    const xAxisTickOffset = 18;
    chart.xAxis = d3
      .axisBottom(chart.xScale)
      .tickSize(0)
      .tickPadding(xAxisTickOffset);

    // Check if custom property for optimum number of x axis ticks to display
    if (config.xAxisTicks) {
      chart.xAxis.ticks(config.xAxisTicks);
    }

    // Check if custom function is set to format the tick text to display
    if (typeof config.xAxisTickFormatter === 'function') {
      chart.xAxis.tickFormat(config.xAxisTickFormatter);
    }

    // Configure offset distance of the tick text from the y axis line
    const yAxisTickOffset = 6;
    chart.yAxis = d3
      .axisLeft(chart.yScale)
      .tickSize(0)
      .tickPadding(yAxisTickOffset);

    // Check if custom function is set to format the tick text to display
    if (typeof config.yAxisTickFormatter === 'function') {
      chart.yAxis.tickFormat(config.yAxisTickFormatter);
      // Or whether a string for an internal formatting fn is set
    } else if (config.yAxisTickFormatter === 'abbreviateNumber') {
      chart.yAxis.tickFormat(abbreviateNumber);
    }

    chart.yGrid = d3.axisLeft(chart.yScale).tickFormat('');

    // Check if custom property for optimum number of y axis ticks to display
    if (config.yAxisTicks) {
      chart.yAxis.ticks(config.yAxisTicks);
      chart.yGrid.ticks(config.yAxisTicks);
    }
  }

  /**
   * Configures and appends the base nodes to the SVG
   *
   * @protected
   * @method _configureBaseNodes
   */
  _configureBaseNodes() {
    const chart = this._chart;
    const { canvas } = chart;

    // Remove Any Existing Children Nodes (Resets the canvas)
    canvas.selectAll('*').remove();

    // ====== Add Background SVG Node ====== //
    canvas
      .append('rect')
      .attr('class', 'dp-background')
      .attr('fill', 'transparent');

    // ====== Add Horizontal Grid SVG Node ====== //
    canvas
      .append('g')
      .attr('class', 'dp-grid dp-y')
      .call(chart.yGrid);

    // ====== Add Axes SVG Nodes ====== //
    canvas
      .append('g')
      .attr('class', 'dp-axis dp-x')
      .call(chart.xAxis);

    canvas
      .append('g')
      .attr('class', 'dp-axis dp-y')
      .call(chart.yAxis);
  }

  /**
   * Configures and appends custom nodes to the SVG
   *
   * @protected
   * @method _configureCustomNodes
   */
  _configureCustomNodes() {
    // @NOTE Override this method if you require any nodes to be added before the draw phase
  }

  /**
   * Configures the d3 properties for the chart and appends any initial nodes required for the SVG
   *
   * @private
   * @method _configure
   */
  _configure() {
    this._configureScale();
    this._configureAxesAndGrids();
    this._configureAxisCoordinateMaps();
    this._configureBaseNodes();
    this._configureCustomNodes();
  }

  /**
   * Called after the SVG is updated and drawn. Used to bind any event listeners to SVG nodes
   *
   * @protected
   * @method _bindEvents
   */
  _bindEvents() {
    // Override this method to setup any event listeners on SVG nodes
  }

  /**
   * Called before the SVG is drawn. Used to remove any event listeners on SVG nodes
   *
   * @protected
   * @method _destroyEvents
   */
  _destroyEvents() {
    // Override this method to remove event listeners on SVG nodes
  }

  /**
   * Extends the scale domain so that it starts and ends on nice round values.
   * Will only update to use this if set in the config.
   *
   * @private
   * @method _updateNiceScaling
   */
  _updateNiceScaling() {
    const chart = this._chart;
    const { xScaleNice, yScaleNice } = this._config;

    if (xScaleNice) {
      // xScaleNice can either be an array of arguments to pass to the .nice() method
      // Or a boolean to turn the default behaviour on
      const niceArgs = xScaleNice instanceof Array ? xScaleNice : [];
      chart.xScale.nice.apply(null, niceArgs);
    }

    if (yScaleNice) {
      // yScaleNice can either be an array of arguments to pass to the .nice() method
      // Or a boolean to turn the default behaviour on
      const niceArgs = yScaleNice instanceof Array ? yScaleNice : [];
      chart.yScale.nice.apply(null, niceArgs);
    }
  }

  /**
   * Determines the best X Axis Domain based off the config
   *
   * @protected
   * @method _getXAxisDomain
   * @param {Array} initialDomain
   *        An array containing the initial calculated domain values of the X axis
   *
   * @return {Array} The final domain values for the X axis
   */
  _getXAxisDomain(initialDomain) {
    const { xAxisDomainFallback } = this._config;

    if (xAxisDomainFallback instanceof Array) {
      if (!initialDomain[0] && !initialDomain[1]) {
        // The X Axis domain has no domain values
        // Use the configured fallback domain
        return xAxisDomainFallback;
      }
    }

    return initialDomain;
  }

  /**
   * Determines the best Y Axis Domain based off the config
   *
   * @protected
   * @method _getYAxisDomain
   * @param {Array} initialDomain
   *        An array containing the initial calculated domain values of the Y axis
   *
   * @return {Array} The final domain values for the Y axis
   */
  _getYAxisDomain(initialDomain) {
    const { yScaleType, yAxisDomainFallback } = this._config;

    let yAxisDomain =
      yScaleType === LINEAR_SCALE
        ? getLinearYAxisDomain(initialDomain)
        : initialDomain;

    if (yAxisDomainFallback instanceof Array) {
      if (!yAxisDomain[0] && !yAxisDomain[1]) {
        // The Y Axis domain has no domain values
        // Use the configured fallback domain
        yAxisDomain = yAxisDomainFallback;
      }
    }

    return yAxisDomain;
  }

  /**
   * Updates D3 properties that may affect the calculated chart dimensions
   * E.g. Updating tick properties so we can estimate the width of the Y axis.
   *
   * @protected
   * @method _beforeChartDimensions
   */
  _beforeChartDimensions() {
    const chart = this._chart;
    const config = this._config;
    const data = this.props.data;

    const initialXAxisDomain = d3.extent(data, d => d[config.xAccessor]);
    const xAxisDomain = this._getXAxisDomain(initialXAxisDomain);
    chart.xScale.domain(xAxisDomain);

    const initialYAxisDomain = d3.extent(data, d => d[config.yAccessor]);
    const yAxisDomain = this._getYAxisDomain(initialYAxisDomain);

    chart.yScale.domain(yAxisDomain);

    this._updateNiceScaling();
  }

  /**
   * Updates D3 properties that depend on the chart size before we start drawing the SVG
   * E.g. Updating the length and range of ticks and axes
   *
   * @protected
   * @method _beforeDraw
   * @param {Object} chartDimensions
   *         @param {Number} canvasHeight
   *                The height of the chart canvas: The full height offset by config.margin
   *         @param {Number} canvasWidth
   *                The width of the chart canvas: The full width offset by config.margin
   */
  _beforeDraw({ canvasHeight, canvasWidth }) {
    const chart = this._chart;

    chart.xScale.range([0, canvasWidth]);
    chart.yScale.range([canvasHeight, 0]);
    // Set the width of the y grid to span the whole canvas
    chart.yGrid.tickSize(canvasWidth, 0, 0);
  }

  /**
   * Renders the base chart nodes
   * @NOTE For most charts you'll unlikely want to override this.
   *
   * @protected
   * @method _drawBaseChart
   * @param {Object} chartDimensions
   *         @param {Number} fullHeight
   *                The current full height of chart
   *         @param {Number} fullWidth
   *                The current full width of chart
   *         @param {Number} canvasHeight
   *                The height of the chart canvas: The full height offset by config.margin
   *         @param {Number} canvasWidth
   *                The width of the chart canvas: The full width offset by config.margin
   */
  _drawBaseChart({ fullHeight, fullWidth, canvasHeight, canvasWidth }) {
    const chart = this._chart;
    const config = this._config;
    const { svg, canvas } = chart;
    const margin = this._getMargins();
    svg.attr('height', fullHeight);
    svg.attr('width', fullWidth);
    // By translating the canvas by the margins, we no longer have to worry about margins within this node
    canvas.attr('transform', `translate(${margin.left}, ${margin.top})`);

    // ====== Draw Background ====== //
    canvas
      .select('.dp-background')
      .attr('height', canvasHeight)
      .attr('width', canvasWidth);

    // ====== Draw Axes ====== //
    const xAxisSelection = canvas
      .select('.dp-axis.dp-x')
      .attr('transform', `translate(0, ${canvasHeight})`)
      .attr('font-size', null)
      .attr('font-family', null)
      .call(chart.xAxis);

    if (config.xAxisTickAlignment === 'diagonal') {
      // Solution taken from: https://stackoverflow.com/a/11257082/5179940
      // Note: The dx and dy values are fairly magic, couldn't find a tangible way to explain.
      // The Em units provide a safeguard if we change the tick text size.
      xAxisSelection
        .selectAll('text')
        .attr('dx', '-1em')
        .attr('dy', '-.7em')
        .attr('transform', 'rotate(-45)')
        .attr('text-anchor', 'end');
    }

    canvas
      .select('.dp-axis.dp-y')
      // Remove the default font attributes
      .attr('font-size', null)
      .attr('font-family', null)
      // Anchor text from the start so it doesn't overflow off the svg canvas
      .attr('text-anchor', 'end')
      .call(chart.yAxis);

    // ====== Draw Grid ====== //
    canvas
      .select('.dp-grid.dp-y')
      .attr('transform', `translate(${canvasWidth}, 0)`)
      .call(chart.yGrid);

    // Add special class to denote the grid line at the zero y axis
    canvas
      .selectAll('.dp-grid.dp-y .tick')
      .filter(d => d === 0)
      .attr('class', 'tick dp-grid-zero-tick');
  }

  /**
   * Draws actual visualisation of data for the chart
   * @NOTE You are are required to override this method for your custom chart to work
   *
   * @protected
   * @method _drawChartContent
   * @param {Object} chartDimensions
   *        An object containing the current dimensions of chart
   */
  _drawChartContent(chartDimensions) {
    // You'll want to override this method and add the logic you need to draw your chart
    throw new Error(
      '_drawChartContent not configured. Please override and add your own method'
    );
  }

  /**
   * Draws an invisible overlay layer
   * Used to bind mouse events on a global level of the chart
   *
   * @private
   * @method _drawOverlay
   * @param {Object} chartDimensions
   *        An object containing the current dimensions of chart
   *         @param {Number} canvasHeight
   *               The height of the chart canvas: The full height offset by config.margin
   *        @param {Number} canvasWidth
   *               The width of the chart canvas: The full width offset by config.margin
   */
  _drawOverlay({ canvasHeight, canvasWidth }) {
    const { canvas } = this._chart;

    // Remove any existing overlay nodes, we always want to append this node last
    // so it is the top most node
    canvas.select('.dp-overlay').remove();

    canvas
      .append('rect')
      .attr('class', 'dp-overlay')
      .attr('fill', 'transparent')
      .attr('height', canvasHeight)
      .attr('width', canvasWidth);
  }

  /**
   * Calls the draw method in a separate angular digest.
   * Provides a consistent function signature for binding/unbinding
   * from a resize event listener.
   *
   * @private
   * @method _drawOnResize
   */
  _drawOnResize() {
    setTimeout(() => {
      this._draw();
    }, 0);
  }

  /**
   * Updates all the d3 properties of the chart given the data and dimensions.
   * Then updates/draws SVG based on this.
   * Lastly events are then bound to the freshly drawn SVG
   *
   * @private
   * @method _draw
   */
  _draw() {
    // Called to remove any existing event listeners
    this._destroyEvents();

    // `_beforeChartDimensions` usually will update tick config and the scale
    // May affect the calculated chart dimensions
    this._beforeChartDimensions();

    const chartDimensions = this._getChartDimensions();

    if (chartDimensions.fullHeight <= 0 || chartDimensions.fullWidth <= 0) {
      console.warn(
        '[D3PO] Invalid dimensions configured. Cannot render chart.',
        {
          data: { chartDimensions }
        }
      );
      return;
    }

    // `_beforeDraw` usually will update the scale and min/max data values before we draw
    this._beforeDraw(chartDimensions);

    // Sets and draws, svg size, background, axis and grid
    this._drawBaseChart(chartDimensions);
    // Draws the data and any custom nodes a chart requires
    this._drawChartContent(chartDimensions);
    // Draws the invisible overlay. The overlay needs to be rendered last
    // so it sits on top of all content.
    // The overlay should be used to bind mouse events to.
    this._drawOverlay(chartDimensions);

    // Lastly bind any event listeners to updated nodes
    this._bindEvents();
  }

  /**
   * Retrieves the current dimensions of the chart
   *
   * @private
   * @method _getChartDimensions
   * @return {Object}
   *         @param {Number} fullHeight
   *                The current full height of chart
   *         @param {Number} fullWidth
   *                The current full width of chart
   *         @param {Number} canvasHeight
   *                The height of the chart canvas: The full height offset by config.margin
   *         @param {Number} canvasWidth
   *                The width of the chart canvas: The full width offset by config.margin
   */
  _getChartDimensions() {
    const margin = this._getMargins();
    const fullHeight = this._getHeight();
    const fullWidth = this._getWidth();
    return {
      fullHeight,
      fullWidth,
      canvasHeight: fullHeight - margin.top - margin.bottom,
      canvasWidth: fullWidth - margin.left - margin.right
    };
  }

  /**
   * Retrieves either the static width set in the config or calculates the width of parent element for auto-sizing
   *
   * @private
   * @method _getWidth
   * @return {Number} The current width of the chart
   */
  _getWidth() {
    const width = this._config.width;
    // Check if width is explicitly defined
    if (typeof width === 'number') {
      return width;
    }

    // Automatically determine the content width from parent element

    var element = ReactDom.findDOMNode(this).parentNode;
    return getElementPureSize(element).width;
  }

  /**
   * Retrieves either the static height set in the config or calculates the height of parent element for auto-sizing
   *
   * @private
   * @method _getHeight
   * @return {Number} The current height of the chart
   */
  _getHeight() {
    const height = this._config.height;

    // Check if height is explicitly defined
    if (typeof height === 'number') {
      return height;
    }

    // Automatically determine the content height from parent element
    return ReactDom.findDOMNode(this).parentNode.getBoundingClientRect().height;
  }

  /**
   * Asserts the width of the Y axis based on its tick labels
   *
   * @private
   * @method _getEstimatedYAxisWidth
   * @return {Number} The estimated width of the y axis
   */
  _getEstimatedYAxisWidth() {
    const AVERAGE_CHAR_WIDTH = 8;
    const MIN_AXIS_WIDTH = 17;
    const formatter = this._chart.yAxis.tickFormat();
    let longestTickLength = 0;

    forEach(this._chart.yScale.ticks(), tick => {
      if (typeof formatter === 'function') {
        tick = formatter(tick);
      }

      const tickLength = String(tick).length;

      longestTickLength = Math.max(tickLength, longestTickLength);
    });

    return Math.max(longestTickLength * AVERAGE_CHAR_WIDTH, MIN_AXIS_WIDTH);
  }

  /**
   * Calculates the margins from the config
   * Note: The left margin is offset by the yAxisWidth
   *
   * @private
   * @method _getMargins
   * @return {Object}
   */
  _getMargins() {
    const marginCopy = cloneDeep(this._config.margin);

    const yAxisWidth = this._getEstimatedYAxisWidth();
    const leftMargin = marginCopy.left || 0;

    // Update the left margin to account for the y axis width
    marginCopy.left = leftMargin + yAxisWidth;

    return marginCopy;
  }

  render() {
    return <div />;
  }
}

export default BaseChart;
