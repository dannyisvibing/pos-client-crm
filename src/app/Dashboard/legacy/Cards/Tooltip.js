import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
// import Popover, {
//   PopoverContainer,
//   PopoverContent,
//   PopoverTarget
// } from '../../../common/legacy/Popover';

class Tooltip extends Component {
  state = {
    open: false
  };

  componentDidMount() {
    const { id } = this.props;
    this.tooltip = d3
      .select('body')
      .append('aside')
      .attr('class', 'popover')
      .attr('id', id)
      .style('display', 'none');
  }

  open(trigger, template) {
    var boundingRect, x, y, /*width, height,*/ tooltipMount, tooltipSize;
    const { id } = this.props;

    boundingRect = trigger.getBoundingClientRect();
    x = boundingRect.x;
    y = boundingRect.y;
    tooltipMount = document.getElementById(id);
    ReactDOM.render(template, tooltipMount);
    tooltipSize = tooltipMount.getBoundingClientRect();
    x += 5;
    y -= tooltipSize.height + 10;
    this.tooltip
      .style('left', x + 'px')
      .style('top', y + 'px')
      .style('display', 'block');
  }

  close() {
    this.tooltip.style('display', 'none');
  }

  render() {
    return <div />;
  }
}

export default Tooltip;
