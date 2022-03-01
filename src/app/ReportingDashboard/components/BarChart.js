import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

class BarChart extends Component {
  state = {};

  componentDidMount() {
    const { data, config, margin, barHeight, transitionDuration } = this.props;
    try {
      var target = ReactDOM.findDOMNode(this);
      var width = d3.select(target.parentElement).node().offsetWidth;
      var height = barHeight;
      var graphWidth = width - margin.left - margin.right;
      this.x = d3.scaleLinear().range([0, graphWidth]);
      this.xAxis = d3.axisTop(this.x);
      this.svg = d3
        .select(target)
        .append('svg')
        .attr('width', width)
        .attr('height', height + margin.top + margin.bottom)
        .attr('class', 'bar-label chart bar-chart')
        .attr('font-family', 'sans-serif')
        .attr('font-size', '11px')
        .attr('fill', 'black')
        .attr('perserveAspectRatio', 'xMinYMid');
      this.chart = this.svg
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
      this.bars = this.chart.append('g').attr('class', 'bars');
      this.chart.append('g').attr('class', 'y axis');
      this.redraw(data, config, margin, barHeight, transitionDuration);
    } catch (error) {
      console.log('error', error);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.redraw(
      nextProps.data,
      nextProps.config,
      nextProps.margin,
      nextProps.barHeight,
      nextProps.transitionDuration
    );
  }

  redraw(data, config, margin, barHeight, transitionDuration) {
    var target = ReactDOM.findDOMNode(this);
    var barContainers, max, selection, yAxis;
    max = d3.max(data, this.valueFn);
    var height = data.length * barHeight + margin.top + margin.bottom;
    var width = d3.select(target.parentElement).node().offsetWidth;
    var graphWidth = width - margin.left - margin.right;
    var maxBarWidth = graphWidth;
    if (maxBarWidth < 0) {
      maxBarWidth = 0;
    }

    this.svg
      .attr('height', height + margin.top + margin.bottom)
      .attr('width', width)
      .attr('viewBox', '0 0 ' + width + ' ' + height);
    this.y = d3
      .scaleBand()
      .range([0, height])
      .padding(0.32);
    this.x = d3.scaleLinear().range([0, graphWidth]);
    yAxis = d3
      .axisRight(this.y)
      .tickSize(0)
      .tickPadding(10);
    this.x.domain([0, max + max / 3]);
    this.chart
      .select('.x.axis')
      .transition()
      .duration(transitionDuration)
      .ease(d3.easeSinInOut)
      .call(this.xAxis);
    this.y.domain(data.map(this.nameFn));
    this.chart
      .select('.y.axis')
      .transition()
      .duration(transitionDuration)
      .ease(d3.easeSinInOut)
      .call(yAxis);

    selection = this.bars.selectAll('.barContainer').data(data, this.nameFn);
    barContainers = selection
      .enter()
      .append('g')
      .attr('class', 'barContainer');
    barContainers
      .append('rect')
      .attr('class', 'bar-chart-background')
      .attr('x', this.zeroFn)
      .attr('y', this.y.bandwidth())
      .attr('rx', 2)
      .attr('ry', 2)
      .attr('width', function(d, i) {
        return maxBarWidth;
      });
    barContainers
      .append('rect')
      .attr('class', 'bar positive')
      .attr('x', this.zeroFn)
      .text(this.valueFn);
    barContainers
      .append('rect')
      .attr('width', 1)
      .attr('class', 'top');
    var self = this;
    barContainers
      .append('text')
      .text(function(d) {
        return self.labelFormatter(d.val);
      })
      .attr('x', 0)
      .attr('width', width)
      .attr('dy', 12)
      .attr('class', 'bar-label')
      .attr('text-anchor', 'end');

    selection
      .enter()
      .selectAll('text.bar-label')
      .attr('x', function(d, i) {
        return width - margin.left - margin.right - 10;
      });

    selection
      .enter()
      .selectAll('text.bar-label')
      .attr('y', function(d) {
        return self.y(d.key) + 3;
      })
      .text(function(d) {
        return config.valFormatter(d.val);
      });

    selection
      .enter()
      .selectAll('.bar')
      .transition()
      .duration(transitionDuration)
      .attr('width', function(d) {
        return Math.abs(self.x(d.val));
      })
      .attr('y', function(d) {
        return self.y(d.key);
      })
      .attr('height', self.y.bandwidth());

    selection
      .enter()
      .selectAll('.top')
      .transition()
      .duration(transitionDuration)
      .attr('x', function(d) {
        return Math.floor(self.x(d.val));
      })
      .attr('y', function(d) {
        return self.y(d.key);
      })
      .attr('height', self.y.bandwidth());

    selection
      .enter()
      .selectAll('.bar-chart-background')
      .attr('y', function(d) {
        return self.y(d.key);
      })
      .attr('height', self.y.bandwidth())
      .attr('width', maxBarWidth);

    selection.exit().remove();
  }

  labelFormatter(d) {
    return d;
  }

  valueFn(d) {
    return d.val;
  }

  nameFn(d) {
    return d.key;
  }

  xValue(d) {
    return this.x(d.val);
  }

  zeroFn() {
    return 0;
  }

  render() {
    return <div />;
  }
}

BarChart.propTypes = {
  data: PropTypes.array,
  config: PropTypes.shape({
    valFormatter: PropTypes.func
  }),
  margin: PropTypes.shape({
    top: PropTypes.number,
    right: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number
  }),
  barHeight: PropTypes.number,
  transitionDuration: PropTypes.number
};

BarChart.defaultProps = {
  config: {
    valFormatter: x => x
  },
  margin: {
    right: 20,
    bottom: 20,
    top: 0,
    left: 20
  },
  barHeight: 25,
  transitionDuration: 500
};

export default BarChart;
