import React from 'react';
import { RBInput } from '../../../rombostrap';

const VariantInventoryTable = ({
  inventoryTracking,
  onChangeTrackingDetail,
  onFormElementStateChange
}) => (
  <div>
    <table className="vd-table vd-table--compact vd-table--fixed">
      <thead>
        <tr>
          <th className="vd-no-pad-l" width="40%">
            Outlet
          </th>
          <th width="20%">Current Inventory</th>
          <th width="20%">Reorder point</th>
          <th width="20%">Reorder amount</th>
        </tr>
      </thead>
      <tbody>
        {inventoryTracking &&
          inventoryTracking.map((tracking, i) => (
            <tr key={i}>
              <td className="vd-no-pad-l">{tracking.outletName}</td>
              <td className="vd-align-right">
                <RBInput
                  rbNumberEnabled
                  rbNumberOptions={{ decimalPlaces: 0, stripNonNumeric: true }}
                  value={tracking.currentInventoryCount || 0}
                  onInputChange={value =>
                    onChangeTrackingDetail(
                      tracking.outletId,
                      'currentInventoryCount',
                      value
                    )
                  }
                  onStateChange={state =>
                    onFormElementStateChange(
                      `${tracking.outletId}-currentInventoryCount`,
                      state
                    )
                  }
                />
              </td>
              <td className="vd-align-right">
                <RBInput
                  rbNumberEnabled
                  rbNumberOptions={{ decimalPlaces: 0, stripNonNumeric: true }}
                  value={tracking.reorderPointCount || 0}
                  onInputChange={value =>
                    onChangeTrackingDetail(
                      tracking.outletId,
                      'reorderPointCount',
                      value
                    )
                  }
                  onStateChange={state =>
                    onFormElementStateChange(
                      `${tracking.outletId}-reorderPointCount`,
                      state
                    )
                  }
                />
              </td>
              <td className="vd-align-right">
                <RBInput
                  rbNumberEnabled
                  rbNumberOptions={{ decimalPlaces: 0, stripNonNumeric: true }}
                  value={tracking.reorderAmountCount || 0}
                  onInputChange={value =>
                    onChangeTrackingDetail(
                      tracking.outletId,
                      'reorderAmountCount',
                      value
                    )
                  }
                  onStateChange={state =>
                    onFormElementStateChange(
                      `${tracking.outletId}-reorderAmountCount`,
                      state
                    )
                  }
                />
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>
);

export default VariantInventoryTable;
