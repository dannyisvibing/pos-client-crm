import React from 'react';
import classnames from 'classnames';

// color: red, yellow, orange, green, blue, purple, white
// type: quick-key, blank

const QuickKey = ({ label, image, color, type, isTarget, locked, onClick }) => (
  <div
    className={classnames('vd-quick-key', {
      [`vd-quick-key--${color}`]: color,
      [`vd-quick-key--${type}`]: type,
      'vd-quick-key--target': isTarget,
      'vd-quick-key--locked': locked
    })}
    onClick={onClick}
  >
    {type !== 'blank' && (
      <div
        className={classnames('vd-quick-key-inner', {
          'vd-quick-key-inner--with-image': !!image
        })}
      >
        <div
          className="vd-quick-key-image"
          style={{ backgroundImage: "url('/img/sample/pic3.jpg')" }}
        />
        <span className="vd-quick-key-label">{label}</span>
      </div>
    )}
  </div>
);

const QuickKeys = ({
  classes,
  edit,
  qkKeys = [],
  productsHash,
  targetIndex,
  onTargetIndexChange,
  onSelectKey
}) => {
  // The order of quick key in the layout UI is left to right, top to bottom
  var qks = [];
  for (var i = 0; i < 5; i++) {
    var column = [];
    for (var j = 0; j < 5; j++) {
      column.push({
        type: 'blank',
        order: 5 * j + i
      });
    }

    qks.push(column);
  }

  qkKeys.forEach(key => {
    var order = key.qkOrder;
    var row = parseInt(order / 5, 10),
      col = order % 5;
    qks[col][row] = {
      qkId: key.qkId,
      productId: key.productId,
      type: 'quick-key',
      order: order,
      label: key.qkLabel,
      image: productsHash[key.productId]
        ? productsHash[key.productId].image
        : null,
      color: key.qkColor
    };
  });

  if (edit && targetIndex === -1) {
    targetIndex = 0;
    for (var index = 0; index < 25; index++) {
      var row = parseInt(index / 5, 10),
        col = index % 5;
      if (qks[col][row].type === 'blank') {
        targetIndex = index;
        break;
      }
    }

    onTargetIndexChange(targetIndex);
  }

  return (
    <div
      className={classnames('vd-quick-keys', classes, {
        'vd-quick-keys--edit-mode': edit
      })}
    >
      <div className="vd-quick-key-grid">
        <div className="vd-quick-key-page">
          {qks.map((column, i) => (
            <div key={i} className="vd-quick-key-page-column">
              {column.map((qk, j) => (
                <QuickKey
                  key={j}
                  isTarget={5 * j + i === targetIndex}
                  locked={false}
                  {...qk}
                  onClick={e => onSelectKey(qk)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickKeys;
