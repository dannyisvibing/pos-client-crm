import React, { Component } from 'react';
import { CardState } from '../../managers/card/card.model';

class Teaser3Card extends Component {
  state = {};

  componentDidMount() {
    const { card } = this.props;
    card.setState(CardState.Ready);
  }

  render() {
    return <div className="ds-card-component">Hey, Teaser3Card</div>;
  }
}

export default Teaser3Card;
