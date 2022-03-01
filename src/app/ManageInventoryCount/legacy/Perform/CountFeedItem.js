import React from 'react';
import classnames from 'classnames';
import { RBFlex, RBButton } from '../../../../rombostrap';

const CountFeedItem = ({ item, onUndoCount }) => (
  <RBFlex
    classes={classnames('count-feed-item', {
      'table-row--warning': !item.productId,
      'ic-highligh-feed': item.highlight
    })}
    flex
    flexJustify="between"
    flexAlign="center"
  >
    <div>
      <span
        className={classnames('count-feed-quantity', {
          'vd-text--negative': item.quantity < 0
        })}
      >
        {item.quantity.toString()}
      </span>
      {item.name}
    </div>
    <RBButton
      category="negative"
      modifiers={['icon', 'table']}
      onClick={onUndoCount}
    >
      <i className="fa fa-trash" />
    </RBButton>
  </RBFlex>
);

export default CountFeedItem;
