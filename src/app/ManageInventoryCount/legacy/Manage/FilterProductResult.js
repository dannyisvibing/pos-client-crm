import React from 'react';

const FilterProductResult = ({ productResults }) => (
  <table className="vd-table">
    <thead>
      <tr>
        <td className="vd-no-pad-l clickable">Product</td>
      </tr>
    </thead>
    <tbody>
      {productResults.map((product, i) => (
        <tr key={i}>
          <td className="vd-no-pad-l">
            {product.getName()}
            <div className="vd-text--sub vd-mts">{product.sku}</div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default FilterProductResult;
