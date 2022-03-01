import React, { Component } from 'react';
import { RBSection, RBHeader, RBFlex, RBInput } from '../../../rombostrap';
import RBField, { RBValue } from '../../../rombostrap/components/RBField';

// import rbStoreResource from '../../../../services/store/store.resource';

class SKUInput extends Component {
  state = {
    available: true
  };

  handleChange = sku => {
    // this.props.onChange(sku);
    // rbStoreResource.isSkuAvailable(sku)
    //   .then(available => {
    //     this.setState({available});
    //   });
  };

  render() {
    return (
      <div>
        <RBSection classes="vd-pln vd-prn">
          <RBFlex flex>
            <div className="vd-col-6">
              <RBHeader category="section">Stock keeping unit (SKU)</RBHeader>
              <RBField>
                <RBValue>
                  <RBInput
                    value={this.props.value}
                    modelOptions={{ updateOn: 'blur' }}
                    rbNumberEnabled
                    rbNumberOptions={{
                      decimalPlaces: 0,
                      stripNonNumeric: true
                    }}
                    placeholder="Stock keeping unit (SKU)"
                    onInputChange={this.handleChange}
                  />

                  {/* <input className='vd-input' placeholder='Stock keeping unit (SKU)'
                      value={this.props.value}
                      onChange={this.handleChange}/> */}
                  {!this.state.available && (
                    <div className="vd-input-error-message-section">
                      <i className="fa fa-exclamation-triangle" />
                      <span className="vd-input-error-message-text">
                        Product SKU already exists
                      </span>
                    </div>
                  )}
                </RBValue>
              </RBField>
            </div>
            <div className="vd-col-6" />
          </RBFlex>
        </RBSection>
        <hr className="vd-hr" />
      </div>
    );
  }
}

export default SKUInput;
