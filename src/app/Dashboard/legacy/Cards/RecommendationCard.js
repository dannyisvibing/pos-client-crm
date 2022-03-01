import React, { Component } from 'react';
import { CardState } from '../../managers/card/card.model';

class RecommendationCard extends Component {
  state = {};

  componentDidMount() {
    const { card } = this.props;
    card.setState(CardState.Ready);
  }

  render() {
    return <div className="ds-card-component">Hey, RecommendationCard</div>;
  }
}

export default RecommendationCard;
