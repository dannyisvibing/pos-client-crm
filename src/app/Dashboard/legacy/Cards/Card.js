import React, { Component } from 'react';
import classnames from 'classnames';
import { RBLoader } from '../../../../rombostrap';
import { CardState } from '../../managers/card/card.model';

export const DISPLAYABLE_STATES = [CardState.Ready, CardState.Error]; // CardState

class Card extends Component {
  state = {};

  componentWillMount() {
    const { card } = this.props;
    this._onStateChange = event => this._setState(event.state, event.prevState);
    card.on('stateChange', this._onStateChange);
    this._onSizeChange = event => this.setSizeClass(event.size, event.prevSize);
    card.on('sizeChange', this._onSizeChange);
    this._onUpdate = () => this.forceUpdate();
    card.on('update', this._onUpdate);
  }

  componentDidMount() {
    if (!!this.cardRef) {
      this.cardRef.classList.add('vd-g-col');
      this.cardRef.classList.add('vd-g-xs-12');
    }
    const { card } = this.props;
    this._setState(card.getState());
    this.setSizeClass(card.getSize());
  }

  componentWillUnmount() {
    const { card } = this.props;
    card.off('stateChange', this._onStateChange);
    card.off('sizeChange', this._onSizeChange);
    card.off('update', this._onUpdate);
  }

  _setState(state, prevState) {
    if (state === CardState.Dismissed) {
      this.cardRef.classList.add('ds-dismissed');
      setTimeout(() => {
        this.cardRef.classList.add('hidden');
      }, 500);
      return;
    }

    if (state === CardState.Introducing) {
      this.cardRef.classList.add('ds-card--introducing');
      setTimeout(() => {
        this.cardRef.classList.remove('ds-card--introducing');
        this.props.card.setState(CardState.Ready);
      }, 500);
      return;
    }

    if (
      DISPLAYABLE_STATES.indexOf(prevState) > -1 &&
      state === CardState.Loading
    ) {
      // Capture the current height of the card
      const cardHeight = this.cardRef.clientHeight;
      this.setState({
        loadingStyles: { height: `${cardHeight}px` },
        state
      });
    } else {
      this.setState({
        loadingStyles: {},
        state
      });
    }

    if (!!this.cardRef) {
      this.cardRef.classList.toggle('hidden', state === CardState.Hidden);
    }
  }

  setSizeClass(size, prevSize) {
    if (!!this.cardRef) {
      if (prevSize) {
        this.getSizeClass(prevSize).map(className =>
          this.cardRef.classList.remove(className)
        );
      }

      this.getSizeClass(size).map(className =>
        this.cardRef.classList.add(className)
      );
    }
  }

  getSizeClass(size) {
    switch (size) {
      case 4:
      case 3:
        return ['vd-g-s-12'];
      case 2:
        return ['vd-g-l-8', 'vd-g-s-12'];
      default:
        return ['vd-g-l-4', 'vd-g-s-6'];
    }
  }

  render() {
    const { state } = this.state;
    const { card } = this.props;
    const ChildComponent = card.getMetaData().Component;

    return (
      <div ref={c => (this.cardRef = c)}>
        {state === CardState.Loading && (
          <div
            style={this.state.loadingStyles}
            className="vd-card ds-card-loading"
          >
            <RBLoader />
          </div>
        )}
        <div
          className={classnames(
            'vd-card ds-card-container',
            card.getMetaData().cssClass,
            {
              hidden: DISPLAYABLE_STATES.indexOf(state) === -1
            }
          )}
        >
          <ChildComponent card={card} />
        </div>
      </div>
    );
  }
}

export default Card;
