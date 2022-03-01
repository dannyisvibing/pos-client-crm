import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import $ from 'jquery';

class ChartTimeline extends Component {
  state = {};
  componentDidMount() {
    const {
      data,
      margin,
      leftGap,
      rightGap,
      xAxisHeight,
      transitionDuration,
      config
    } = this.props;
    // var d3 = window.d3;
    var width =
      d3.select(ReactDOM.findDOMNode(this).parentElement).node().offsetWidth -
      margin.left -
      margin.right;
    var height = parseInt(this.props.height, 10) - margin.top - margin.bottom;
    this.x = d3.scaleUtc().range([leftGap, width - rightGap]);
    this.y = d3.scaleLinear().range([height - xAxisHeight, 0]);
    this.yAxis = d3
      .axisRight(this.y)
      .ticks(4)
      .tickFormat(function(d) {
        if (d > 1000) {
          return d3.format('.1dk')(d / 1000) + 'k';
        } else {
          return d;
        }
      });
    this.line = d3
      .line()
      .x(this.dateFn)
      .y(this.valueFn)
      .curve(d3.curveLinear);
    this.area = d3
      .area()
      .x(this.dateFn)
      .y0(height - xAxisHeight)
      .y1(this.valueFn);
    this.svg = d3
      .select(ReactDOM.findDOMNode(this))
      .append('svg')
      .style('width', '100%')
      .attr('height', height)
      .attr('perserveAspectRatio', 'xMinYMid')
      .attr('class', 'line-chart chart');
    this.svg
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    this.chart = d3.select(ReactDOM.findDOMNode(this)).select('svg');
    this.svg
      .append('rect')
      .attr('class', 'bg')
      .attr('width', '100%')
      .attr('height', height - xAxisHeight);

    this.svg
      .selectAll('line.horizontalGrid')
      .data(this.y.ticks(4))
      .enter()
      .append('line')
      .attr('class', 'horizontalGrid')
      .attr('x1', 0)
      .attr('x2', width - margin.left - margin.right)
      .attr('y1', d => this.y(d))
      .attr('y2', d => this.y(d))
      .attr('fill', 'none')
      .attr('shape-rendering', 'crispEdges')
      .attr('stroke', '#D7D7D7')
      .attr('stroke-width', '1px');
    this.linePath = this.svg.append('path');
    this.fillPath = this.svg.append('path');
    this.svg
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0, ' + (height - xAxisHeight) + ')');
    this.linePath
      .data([])
      .attr('class', 'line')
      .attr('d', this.line);
    this.fillPath
      .data([])
      .attr('class', 'fill')
      .attr('d', this.area);
    this.svg.append('g').attr('class', 'y axis');
    this.tooltip = d3
      .select('body')
      .append('aside')
      .attr('class', 'popover')
      .style('display', 'none');
    this.bisectDate = d3.bisector(function(d) {
      return d.key;
    }).right;

    var self = this;
    var mousemove = function() {
      var d, d0, d1, i, left, offset, top, x0;
      var curData = self.props.data;
      var config = self.props.config;
      offset = $(self.svg.nodes()[0]).offset();
      x0 = self.x.invert(d3.mouse(this)[0]);
      i = self.bisectDate(curData, x0, 1);
      if (i === 1) {
        i = 2;
      }
      if (i === curData.length) {
        i = curData.length;
      }
      d0 = curData[i - 1];
      d1 = curData[i];
      if (!d1) {
        return;
      }
      d = x0 - d0.key > d1.key - x0 ? d1 : d0;
      self.tooltip.html(
        '<h1>' +
          config.tooltipValueFormatter(d.val) +
          '</h1><h2>' +
          config.tooltipDateFormatter(d.key) +
          '</h2>'
      );
      left = self.x(d.key) + offset.left;
      top = self.y(d.val) + offset.top + 15;
      // self.tooltip.nodes()[0].getBoundingClientRect().height;
      self.tooltip
        .style('margin-top', height * -1 + 14 + 'px')
        .style('left', left + 'px')
        .style('top', top + 'px');
    };
    var showToolTip = function() {
      self.tooltip.style('display', 'block');
      // return Metrics.increment('widget_tooltip', {
      //     tags: ['interaction:hover']
      // });
    };

    this.svg
      .append('rect')
      .attr('class', 'overlay')
      .attr('width', '100%')
      .attr('height', 'height')
      .on('mouseover', function() {
        return showToolTip();
      })
      .on('mouseout', function() {
        return self.tooltip.style('display', 'none');
      })
      .on('mousemove', mousemove);

    this.redraw(data, margin, leftGap, rightGap, transitionDuration, config);
  }

  componentWillReceiveProps(nextProps) {
    this.redraw(
      nextProps.data,
      nextProps.margin,
      nextProps.leftGap,
      nextProps.rightGap,
      nextProps.transitionDuration,
      nextProps.config
    );
  }

  redraw(data, margin, leftGap, rightGap, transitionDuration, config) {
    if (!data) {
      return;
    }
    try {
      var width =
        d3.select(ReactDOM.findDOMNode(this).parentElement).node().offsetWidth -
        margin.left -
        margin.right;
      this.x = d3.scaleUtc().range([leftGap, width - rightGap]);
      var t = d3.extent(data, function(d) {
        return d.key;
      });
      this.x.domain(t);
      var xAxisScale = d3
        .scaleUtc()
        .domain(t)
        .range([leftGap, width - rightGap]);
      var tickValues = data.map(d => d.key);

      var xAxis = d3
        .axisBottom(xAxisScale)
        .tickValues(tickValues)
        .tickFormat(function(d) {
          return config.xAxisTickFormatter(d);
        });
      var max = d3.max(data, function(d) {
        return d.val;
      });
      var min = d3.min(data, function(d) {
        return d.val;
      });
      this.y.domain([min, max * 1.1]);
      this.svg.selectAll('circle.dot').remove();
      this.linePath
        .datum(data)
        .attr('class', 'line')
        .attr('d', this.line);
      this.fillPath
        .datum(data)
        .attr('class', 'fill')
        .attr('d', this.area);

      this.svg
        .select('.x.axis')
        .call(xAxis)
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '-.1em')
        .attr('transform', function(d) {
          return 'rotate(-45)';
        })
        .attr('opacity', 0)
        .transition()
        .duration(transitionDuration)
        .ease(d3.easeSinInOut)
        .attr('opacity', 1);
      this.svg
        .select('.y.axis')
        .transition()
        .duration(transitionDuration)
        .ease(d3.easeSinInOut)
        .call(this.yAxis);
      this.svg.selectAll('line.horizontalGrid').attr({
        x2: width - margin.left - margin.right
      });
      this.svg.select('rect.bg').attr({
        width: '100%'
      });
      var selection = this.svg.selectAll('.dot').data(data);
      selection
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('r', 4)
        .attr('cx', this.dateFn)
        .attr('cy', this.valueFn);
      selection.exit().remove();
    } catch (error) {
      // console.log("error", error);
    }
  }

  dateFn = d => {
    return this.x(d.key);
  };

  valueFn = d => {
    return this.y(d.val);
  };

  render() {
    return <div />;
  }
}

ChartTimeline.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      val: PropTypes.number
    })
  ),
  config: PropTypes.shape({
    tooltipDateFormatter: PropTypes.func,
    tooltipValueFormatter: PropTypes.func,
    xAxisTickFormatter: PropTypes.func
  }),
  margin: PropTypes.shape({
    top: PropTypes.number,
    right: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number
  }),
  rightGap: PropTypes.number,
  leftGap: PropTypes.number,
  height: PropTypes.number,
  xAxisHeight: PropTypes.number,
  transitionDuration: PropTypes.number
};

ChartTimeline.defaultProps = {
  data: [],
  config: {
    tooltipDateFormatter: x => x,
    tooltipValueFormatter: x => x,
    xAxisTickFormatter: x => x
  },
  margin: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  rightGap: 25,
  leftGap: -10,
  xAxisHeight: 45,
  transitionDuration: 500
};

export default ChartTimeline;
