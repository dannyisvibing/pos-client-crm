import React from 'react';
import { RBSection } from '../../../rombostrap';
import SKUInputSection from './SKUInput';
import { Input, Button } from '../../common/legacy/Basic';

const CompositeInventory = () => (
  <div>
    <SKUInputSection />
    <RBSection classes="vd-pln vd-prn">
      <h2 className="vd-header vd-header--section">Included Products</h2>
      <div className="vd-flex vd-flex--settings">
        <div className="vd-col-4 vd-flex vd-flex--column">
          <p className="vd-p">
            Composite products contain specified quantities of one or more
            standard products.
          </p>
          <div className="inventory relative box-2">
            <div className="vd-flex vd-flex--align-center">
              <div className="vd-flex ">
                <Input label="Product:" classes={{ root: 'vd-col-8' }} />
                <Input
                  label="Quantity:"
                  classes={{ root: 'vd-col-4 vd-mrl vd-mll' }}
                />
              </div>
              <Button primary>Add</Button>
            </div>
            <div className="hr line">
              <div className="table-wrapper">
                <table className="table-1 borderless item_list">
                  <tbody>
                    <tr className="composite-product">
                      <td className="no-side-padding name">
                        Luxury Mini Candle Gift Pack
                      </td>
                      <td className="input-row quantity">
                        <input type="text" value="1" />
                      </td>
                      <td className="no-side-padding">
                        <a className="circle-btn circle-btn--safe js-remove-composite-product">
                          <i className="icon-general-cross-white" />
                        </a>
                      </td>
                      <td className="size2of4">&nbsp;</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RBSection>
  </div>
);

export default CompositeInventory;
