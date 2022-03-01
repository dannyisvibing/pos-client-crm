import React, { Component } from 'react';
import STATES from '../../../../constants/states';
import { RBLoader } from '../../../../rombostrap';
import CountFeedItem from './CountFeedItem';
import entitiesManager from '../../../../modules/idb/managers/entities-manager';

class CountFeed extends Component {
  state = {
    stateCountFeed: STATES.inProgress,
    countFeed: []
  };

  componentWillMount() {
    this._initCountFeed();
  }

  _initCountFeed() {
    this.stocktakeId = this.props.stocktakeId;
    this.stocktakeCountsManager = entitiesManager.getStocktakeCountsManager();
    this.stocktakeCountsManager
      .getAll(this.stocktakeId)
      .then(counts => {
        this.setState({
          countFeed: counts,
          stateCountFeed: STATES.ready
        });
      })
      .catch(error => {
        this.setState({
          stateCountFeed: STATES.error
        });
      });
  }

  addFeedCount(stocktakeCount) {
    var { countFeed } = this.state;
    this.stocktakeCountsManager.insert(this.stocktakeId, stocktakeCount);
    countFeed.unshift(stocktakeCount);
    this.setState({ countFeed });
  }

  undoCount(index) {
    var { countFeed } = this.state;
    var stocktakeCount = countFeed.splice(index, 1)[0],
      negativeQuantity = -stocktakeCount.quantity.toString(),
      product = {};

    this.stocktakeCountsManager.delete(stocktakeCount.getId());

    if (stocktakeCount.productId) {
      product.id = stocktakeCount.productId;
      this.props.onUndoCount(product, negativeQuantity);
    }

    this.setState([countFeed]);
  }

  render() {
    const { stateCountFeed, countFeed } = this.state;
    return (
      <div className="count-feed" style={{ top: '50px' }}>
        <div className="count-feed-container">
          <div className="count-feed-title" style={{ top: '50px' }}>
            Your last counted items
          </div>
          {countFeed.map((item, i) => (
            <CountFeedItem
              key={i}
              item={item}
              onUndoCount={e => this.undoCount(i)}
            />
          ))}
          {stateCountFeed === STATES.ready &&
            !countFeed.length && (
              <div className="count-feed-info">
                <div className="ic-image ic-image-empty-count-feed" />
                <p>
                  Items that you count will appear here one-by-one to help you
                  keep track.
                </p>
              </div>
            )}
          {stateCountFeed === STATES.inProgress && (
            <div className="vd-section vd-align-center">
              <RBLoader />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default CountFeed;
