import React from 'react';
import ReactDom from 'react-dom';

import * as d3 from 'd3';
import eachRight from 'lodash/eachRight';
import map from 'lodash/map';
import throttle from 'lodash/throttle';

import { getMinMaxFromDataset } from './util';
import BaseChart from '../Common/BaseChart';

const DEFAULT_CONFIG = {
  linesOffset: {
    left: 20,
    right: 20
  },
  lineConfigs: [
    {
      showPlotPoints: true,
      showArea: false
    }
  ]
};

const EVENT_MOUSEOVER_THROTTLE_LIMIT = 100;

class RBLineChart extends BaseChart {
  state = {};

  constructor() {
    super(DEFAULT_CONFIG);
  }

  /**
   * Sets up and appends the line and area path nodes based on the current dataset
   *
   * @override
   * @private
   * @method _setupChartLineNodes
   */
  _setupChartLineNodes() {
    const chart = this._chart;

    chart.line = d3
      .line()
      .x(chart.xMap)
      .y(chart.yMap);
    chart.area = d3
      .area()
      .x(chart.xMap)
      .y1(chart.yMap);

    const canvas = chart.canvas;

    // Reset the canvas
    canvas.selectAll('.dp-line-wrapper').remove();

    // Append the line nodes from right to left.
    // This is so lines at the start of the array will have precedence and render on top
    eachRight(this.props.data, (lineData, index) => {
      const lineConfig = this._config.lineConfigs[index] || {};

      // ====== Add Line Wrapper SVG Node ====== //
      const lineWrapper = canvas
        .append('g')
        .attr('class', `dp-line-wrapper dp-line-wrapper-${index}`);

      // ====== Add Line SVG Node ====== //
      lineWrapper.append('path').attr('class', `dp-line dp-line-${index}`);

      // ====== Add Line Area SVG Node ====== //
      if (lineConfig.showArea) {
        lineWrapper.append('path').attr('class', `dp-area dp-area-${index}`);
      }
    });
  }

  /**
   * Updates D3 properties that depend on the data before we start drawing the SVG
   * E.g. Updating the min/max values for axes based on data
   *
   * @override
   * @protected
   * @method _beforeChartDimensions
   */
  _beforeChartDimensions() {
    const chart = this._chart;
    const config = this._config;
    const data = this.props.data;

    const initialXAxisDomain = getMinMaxFromDataset(data, config.xAccessor);
    const xAxisDomain = this._getXAxisDomain(initialXAxisDomain);
    chart.xScale.domain(xAxisDomain);

    const initialYAxisDomain = getMinMaxFromDataset(data, config.yAccessor);
    const yAxisDomain = this._getYAxisDomain(initialYAxisDomain);

    chart.yScale.domain(yAxisDomain);

    this._updateNiceScaling();
  }

  /**
   * Updates D3 properties that depend on the data before we start drawing the SVG
   * E.g. Updating the min/max values for axes based on data
   *
   * @override
   * @protected
   * @method _beforeDraw
   */
  _beforeDraw({ canvasHeight, canvasWidth }) {
    const chart = this._chart;
    const config = this._config;

    // Indent the xScale from the canvas based on lines offset config
    // Offsets the rendered lines and data points so they don't render on the edges of the chart canvas
    chart.xScale.range([
      config.linesOffset.left,
      canvasWidth - config.linesOffset.right
    ]);

    chart.yScale.range([canvasHeight, 0]);

    // Set the width of the y grid to span the whole canvas
    chart.yGrid.tickSize(canvasWidth, 0, 0);

    // Appends the nodes needed for the current dataset to begin drawing
    this._setupChartLineNodes();

    // Set the distance from top where the Line Area should start (effectively from the axis line)
    chart.area.y0(canvasHeight);
  }

  /**
   * Updates and draws the line, area and plot points of lines based on the dataset
   *
   * @override
   * @private
   * @method _drawChartContent
   */
  _drawChartContent() {
    const chart = this._chart;
    const data = this.props.data;
    const { canvas } = chart;

    // Iterate through each set in the data array and render the line, area and plot points based on config
    // Iterate from the right so the data at the start will render last
    eachRight(data, (lineData, lineIndex) => {
      const lineConfig = this._config.lineConfigs[lineIndex] || {};
      const lineWrapper = canvas.select(`.dp-line-wrapper-${lineIndex}`);

      // ====== Draw Line Path ====== //
      canvas.select(`.dp-line-${lineIndex}`).attr('d', chart.line(lineData));

      // ====== Draw Line Area ====== //
      if (lineConfig.showArea) {
        canvas.select(`.dp-area-${lineIndex}`).attr('d', chart.area(lineData));
      }

      // ====== Draw Hidden Line Plot Points ====== //
      const plotPoints = lineWrapper.selectAll(`.dp-plot-point-${lineIndex}`);
      // Remove existing points then append new plot point circles for the current data set
      plotPoints
        .remove()
        .data(lineData)
        .enter()
        .append('circle')
        .attr('r', 5)
        .attr('cx', chart.xMap)
        .attr('cy', chart.yMap)
        .attr('class', (d, plotPointIndex) => {
          const classes = ['dp-plot-point', `dp-plot-point-${lineIndex}`];
          let hidePlotPoint = true;

          // Determine whether plot point should be shown based on config and data
          if (lineConfig.showPlotPoints) {
            const previousPlotPoint = lineData[plotPointIndex - 1] || {};
            const nextPlotPoint = lineData[plotPointIndex + 1] || {};
            // Hide plot points for consecutive zero Y axis values.
            // BUT, still show the first and last zero-value points in the sequence.
            hidePlotPoint =
              d.y === 0 && previousPlotPoint.y === 0 && nextPlotPoint.y === 0;
          }

          if (hidePlotPoint) {
            classes.push('dp-plot-point--hidden');
          }

          return classes.join(' ');
        })
        .exit();

      // ====== Draw Line Label ====== //
      if (lineConfig.label) {
        let lastIndexWithData;

        // Iterate through the line data from the end to find the
        // last data point with a y value not equal to zero
        // This is to prevent rendering a label on the zero Y axis line
        eachRight(lineData, (data, index) => {
          if (data.y !== 0) {
            lastIndexWithData = index;
            // Break loop
            return false;
          }
        });

        const dataPointToLabel = lineData[lastIndexWithData];
        // Always offset label to the left unless the first data point
        const offsetTextFromLine = lastIndexWithData > 0 ? -9 : 9;
        const centerTextOnLine = '0.35em';

        if (dataPointToLabel) {
          // Appends a label text node at the last data point not equal to zero
          lineWrapper
            .append('text')
            .attr('class', `dp-line-label dp-line-label-${lineIndex}`)
            .attr(
              'transform',
              `translate(${chart.xMap(dataPointToLabel)}, ${chart.yMap(
                dataPointToLabel
              )})`
            )
            // Always offset label to the left unless the first data point
            .attr('text-anchor', lastIndexWithData > 0 ? 'end' : 'start')
            .attr('x', offsetTextFromLine)
            .attr('dy', centerTextOnLine)
            .text(lineConfig.label);
        }
      }
    });
  }

  /**
   * Finds the data index of nearest x axis value relative to the mouse's x axis coords
   *
   * @private
   * @method _findIndexOfNearestXAxisValue
   * @param  {Node} boundaryElement
   *         The element node where mouse event occurred
   * @param  {Number} lineIndex
   *         The index of the line data to find closest value to
   *
   * @return {Number} The index number of the nearest x axis data
   */
  _findIndexOfNearestXAxisValue(boundaryElement, lineIndex) {
    const chart = this._chart;
    const { xAccessor } = this._config;
    const bisectXAxisData = d3.bisector(d => d[xAccessor]).right;
    const lineData = this.props.data[lineIndex];

    if (lineData.length === 1) {
      // Only one data value exists, no need to compute
      // early exit with an index of 0
      return 0;
    }

    if (lineData.length === 0) {
      // There is no data, return '-1' to indicate no index found
      return -1;
    }

    // Find the coordinates of the mouse cursor within boundary element
    // Then use this to retreive the x axis value
    const mouseCoords = d3.mouse(boundaryElement);
    const mouseXAxisValue = chart.xScale.invert(mouseCoords[0]);

    const lowestIndex = 1;
    const highestIndex = lineData.length - 1;
    const foundDataIndex = bisectXAxisData(
      lineData,
      mouseXAxisValue,
      lowestIndex,
      highestIndex
    );

    // Based off the preliminary index found by bisecting
    // Find which data value is actually closest to the Mouse's x Axis value
    const foundDataValue = lineData[foundDataIndex];
    const precedingDataIndex = foundDataIndex - 1;
    const precedingDataValue = lineData[precedingDataIndex];

    const precedingDiff = mouseXAxisValue - precedingDataValue[xAccessor];
    const foundDiff = foundDataValue[xAccessor] - mouseXAxisValue;

    // Determine which data is closest to the Mouse's x Axis value and return the index
    return precedingDiff > foundDiff ? foundDataIndex : precedingDataIndex;
  }

  /**
   * Opens a tooltip on the specified plot point and chart line
   *
   * @private
   * @method _showPlotPointTooltip
   * @param {Object} plotPoint
   *        @param {Number} data
   *               The data of the plot point
   *        @param {Number} index
   *               The index position of the plot point within the line
   *        @param {Number} node
   *               The DOM node reference for the plot point
   *
   * @param {Function} [templateFn]
   *        Callback function which returns tooltip template.
   *        The function gets passed the plot point data.
   *
   * @return {Promise<Tooltip>} A Promise that resolves when the tooltip is opened
   */
  _showPlotPointTooltip(plotPoint, templateFn) {
    // Early exit and don't open tooltip if plot point does not exist
    if (!plotPoint || !plotPoint.node) {
      return;
    }

    let template;

    if (typeof templateFn === 'function') {
      template = templateFn(plotPoint.data, plotPoint.index);
    } else {
      const { xAccessor, yAccessor } = this._config;
      // Default to basic template of point data
      template = (
        <div>
          <div>{plotPoint.data[xAccessor]}</div>
          <div>{plotPoint.data[yAccessor]}</div>
        </div>
      );
    }

    const { onTriggerTooltip } = this.props;
    onTriggerTooltip && onTriggerTooltip(true, plotPoint.node, template);
  }

  /**
   * Searches the specified line data to find the nearest plot point relative to the cursor
   *
   * @private
   * @method _findNearestPlotPointForLine
   * @param {Object} boundaryElement
   *        The boundary element where mouse/touch event occurred
   *
   * @param {Number} lineIndex
   *        The index of the line data to search
   *
   * @return {Object} A plot point object with properties of its value, location and whether hidden
   */
  _findNearestPlotPointForLine(boundaryElement, lineIndex) {
    var element = ReactDom.findDOMNode(this).parentNode;
    const plotPointIndex = this._findIndexOfNearestXAxisValue(
      boundaryElement,
      lineIndex
    );
    const plotPointNode = element.querySelectorAll(
      `.dp-plot-point-${lineIndex}`
    )[plotPointIndex];
    return {
      data: this.props.data[lineIndex][plotPointIndex],
      hidden: plotPointNode.classList.contains('dp-plot-point--hidden'),
      index: plotPointIndex,
      lineIndex,
      node: plotPointNode
    };
  }

  /**
   * Event callback that finds the nearest data point from event and displays a tooltip
   *
   * @private
   * @method _handleTooltipDisplay
   * @param {Any} d
   *        The current datum value from the Event
   * @param {Any} i
   *        The index of the datum value
   * @param {Array} nodes
   *        The closest group of nodes where the Event occurred
   *
   * @return {Promise<Tooltip>} A promise that resolves when the tooltip is opened
   */
  _handleTooltipDisplay(d, i, nodes) {
    const { tooltipConfig = {} } = this._config;
    const { tetherTo, templateFn } = tooltipConfig;
    // Retrieve the element from where the mouse event occurred
    const boundaryElement = nodes[0];
    let nearestPlotPoint;

    // When callback function defined, call this to determine which
    // line and plotpoint to show the tooltip on
    if (typeof tetherTo === 'function') {
      // Find the closest plotpoint on each data line
      const nearestPlotPoints = map(this.props.data, (value, lineIndex) => {
        return this._findNearestPlotPointForLine(boundaryElement, lineIndex);
      });
      nearestPlotPoint = tetherTo(nearestPlotPoints);
    } else {
      nearestPlotPoint = this._findNearestPlotPointForLine(
        boundaryElement,
        tetherTo
      );
    }

    return this._showPlotPointTooltip(nearestPlotPoint, templateFn);
  }

  /**
   * Closes the open tooltip unless the mouse is inside the tooltip
   *
   * @private
   * @method _handleTooltipMouseClose
   */
  _handleTooltipMouseClose() {
    const { onTriggerTooltip } = this.props;
    onTriggerTooltip && onTriggerTooltip(false);
    // const relatedTarget = angular.element(d3.event.relatedTarget)
    // const insideTooltip = relatedTarget.closest('.vd-popover-container').length ||
    // relatedTarget.hasClass('.vd-popover-container')

    // // Close open tooltip, unless cursor is inside the tooltip
    // if (!insideTooltip) {
    //     this._vdTooltip.close()
    // }
  }

  /**
   * Closes the open tooltip unless the touch occurred within the chart
   *
   * @private
   * @method _handleTooltipTouchClose
   * @param {Object} event
   *        The touchstart Event object
   */
  // _handleTooltipTouchClose (event) {
  //     console.log('_handleTooltipTouchClose', event);
  //     const relatedTarget = angular.element(event.target)
  //     const insideChart = relatedTarget.closest('.dp-line-chart').length

  //     // Close open tooltip, unless touch is inside the chart
  //     if (!insideChart) {
  //         this._vdTooltip.close()
  //     }
  // }

  /**
   * Called after the SVG is updated and drawn.
   * Binds tooltip event listeners if setup in the chart config
   *
   * @override
   * @method _bindEvents
   */
  _bindEvents() {
    const { tooltipConfig = {} } = this._config;

    if ('tetherTo' in tooltipConfig) {
      let touchTriggered;
      const handleTooltipDisplay = this._handleTooltipDisplay.bind(this);
      const handleTooltipMouseClose = this._handleTooltipMouseClose.bind(this);
      // const handleTooltipTouchClose = this._handleTooltipTouchClose.bind(this)
      const chartCanvas = this._chart.canvas;
      const throttledDisplay = throttle(
        handleTooltipDisplay,
        EVENT_MOUSEOVER_THROTTLE_LIMIT,
        { trailing: false }
      );

      // ====================== Mouse Events ====================== //
      chartCanvas
        .on('mouseleave', handleTooltipMouseClose)
        .on('mousemove', (d, i, nodes) => {
          if (!touchTriggered) {
            throttledDisplay(d, i, nodes);
          }

          touchTriggered = false;
        });

      // ====================== Touch Events ====================== //
      // const vdBodyElement = angular.element('.vd-body')

      // chartCanvas.on('touchstart', (d, i, nodes) => {
      //     d3.event.preventDefault()
      //     touchTriggered = true

      //     handleTooltipDisplay(d, i, nodes)
      //         .then(modal => {
      //                 vdBodyElement.on('touchstart', handleTooltipTouchClose)

      //                 modal.close.then(() => {
      //                 vdBodyElement.off('touchstart', handleTooltipTouchClose)
      //             })
      //         })
      // })
    }
  }

  render() {
    return <svg preserveAspectRatio="xMinYMid" className="dp-line-chart" />;
  }
}

export default RBLineChart;
