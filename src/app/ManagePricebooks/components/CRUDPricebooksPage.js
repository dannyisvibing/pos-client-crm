import React, { PureComponent } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { FieldArray } from 'formik';
import {
  RBHeader,
  RBSectionBack,
  RBSave,
  RBCheckbox,
  RBSelect,
  RBFlex
} from '../../../rombostrap';
import RBSection, {
  RBSectionActionBar
} from '../../../rombostrap/components/RBSection';
import RBField, {
  RBLabel,
  RBValue
} from '../../../rombostrap/components/RBField';
import RBInput, {
  RBInputErrorMessageSection
} from '../../../rombostrap/components/RBInput';
import DescriptionSection from '../../common/components/DescriptionSection';
import SimpleDatePicker from '../../common/components/SimpleDatePicker';
import SearchForProducts from '../../common/containers/SearchForProductsContainer';
import PricebookItemsTable from '../containers/PricebookItemsTableContainer';
import { getProductById } from '../../../modules/product';
import { refinePricebookItem } from '../../../modules/pricebook';
import { logRender } from '../../../utils/debug';
import ModalTypes from '../../../constants/modalTypes';

class CRUDPricebooksPage extends PureComponent {
  constructor(props) {
    super(props);
    this.handleDeletePricebook = this.handleDeletePricebook.bind(this);
    this.handleSelectSuggestion = this.handleSelectSuggestion.bind(this);
    this.handleDeletePricebookItem = this.handleDeletePricebookItem.bind(this);
  }

  handleDeletePricebook(e) {
    e.preventDefault();
    const { openModal, deletePricebook, params, routerReplace } = this.props;
    openModal({
      type: ModalTypes.WARN_PERMANENT_ACTION,
      confirmHandler: async () => {
        await deletePricebook(params.bookId);
        routerReplace('/product/price_book');
      }
    });
  }

  handleSelectSuggestion(suggestion) {
    const { productId } = suggestion;
    const { values, products, setFieldTouched } = this.props;
    const product = getProductById(products, productId);
    const pricebookItem = refinePricebookItem({
      ...product,
      bookId: values.bookId,
      productId
    });
    this.fieldArrayHelpers.push(pricebookItem);
    setFieldTouched('items', {});
  }

  handleDeletePricebookItem(e, itemIndex) {
    e.preventDefault();
    this.fieldArrayHelpers.remove(itemIndex);
  }

  render() {
    logRender('render CRUDPricebooksPage');
    const {
      params,
      values,
      touched,
      errors,
      customerGroups,
      outlets,
      isSubmitting
    } = this.props;
    return (
      <div>
        <RBSection>
          <RBHeader category="page">
            <RBSectionBack href="/product/price_book" />
            {params.create ? 'New Price Book' : values.name}
          </RBHeader>
        </RBSection>
        <form className="vd-mbxl" onSubmit={this.props.handleSubmit}>
          <RBSection type="action-bar">
            <RBSectionActionBar type="about">
              {params.create && (
                <div>Fill out the form to create a new price book</div>
              )}
              {!params.create && (
                <div>Change information of the price book</div>
              )}
            </RBSectionActionBar>
            <RBSectionActionBar type="actions">
              <RBSave
                lastUpdated={values.updatedAt}
                form={{ dirty: Object.keys(touched).length > 0 }}
                saving={isSubmitting}
              />
            </RBSectionActionBar>
          </RBSection>
          <RBSection classes="vd-mtl">
            <DescriptionSection
              title="General"
              description="Change general information for this price book"
            >
              <div className="vd-g-row">
                <RBField>
                  <RBLabel>Name</RBLabel>
                  <RBValue>
                    <RBInput
                      value={values.name}
                      onInputChange={name =>
                        this.props.setFieldValue('name', name)
                      }
                      onBlur={() => this.props.setFieldTouched('name', true)}
                      placeholder="Enter price book name"
                    />
                    {touched.name &&
                      errors.name && (
                        <RBInputErrorMessageSection>
                          Required
                        </RBInputErrorMessageSection>
                      )}
                  </RBValue>
                </RBField>
                <RBField classes="vd-mll">
                  <RBLabel>Valid On</RBLabel>
                  <RBValue classes="vd-mts">
                    <RBFlex flex flexJustify="between" flexAlign="center">
                      <RBCheckbox
                        name="validOnInStore"
                        label="In Store"
                        checked={values.validOnInStore}
                        onChange={e =>
                          this.props.setFieldValue(
                            'validOnInStore',
                            e.target.checked
                          )
                        }
                      />
                      <RBCheckbox
                        name="validOnEcommerce"
                        label="Ecommerce"
                        checked={values.validOnEcommerce}
                        onChange={e =>
                          this.props.setFieldValue(
                            'validOnEcommerce',
                            e.target.checked
                          )
                        }
                      />
                    </RBFlex>
                  </RBValue>
                </RBField>
              </div>
              <div className="vd-g-row">
                <RBField>
                  <RBLabel>
                    <div>Customer Group</div>
                    <div className="vd-text-mini-copy">In Store Only</div>
                  </RBLabel>
                  <RBValue>
                    <RBSelect
                      entities={customerGroups}
                      selectedEntity={values.customerGroupId}
                      entityKey="name"
                      entityValue="id"
                      nullLabel="All Customers"
                      onChange={option =>
                        this.props.setFieldValue('customerGroupId', option.id)
                      }
                      onBlur={() =>
                        this.props.setFieldTouched('customerGroupId', true)
                      }
                    />
                  </RBValue>
                </RBField>
                <RBField classes="vd-mll">
                  <RBLabel>
                    Outlet
                    <div className="vd-text-mini-copy">In Store Only</div>
                  </RBLabel>
                  <RBValue>
                    <RBSelect
                      entities={outlets}
                      entityKey="outletName"
                      entityValue="outletId"
                      selectedEntity={values.restrictedOutletId}
                      onChange={outlet =>
                        this.props.setFieldValue(
                          'restrictedOutletId',
                          outlet.outletId
                        )
                      }
                      onBlur={() =>
                        this.props.setFieldTouched('restrictedOutletId', true)
                      }
                      nullLabel="All Outlets"
                    />
                  </RBValue>
                </RBField>
              </div>
              <div className="vd-g-row">
                <RBField>
                  <RBLabel>Valid from</RBLabel>
                  <RBValue>
                    <SimpleDatePicker
                      date={moment(values.validFrom).toDate()}
                      onSelectDay={day =>
                        this.props.setFieldValue('validFrom', day)
                      }
                      onBlur={() =>
                        this.props.setFieldTouched('validFrom', true)
                      }
                    />
                  </RBValue>
                </RBField>
                <RBField classes="vd-mll">
                  <RBLabel>Valid to</RBLabel>
                  <RBValue>
                    <SimpleDatePicker
                      date={moment(values.validTo).toDate()}
                      onSelectDay={day =>
                        this.props.setFieldValue('validTo', day)
                      }
                      onBlur={() => this.props.setFieldTouched('validTo', true)}
                    />
                  </RBValue>
                </RBField>
              </div>
            </DescriptionSection>
            {!params.create && (
              <FieldArray
                name="items"
                render={arrayHelpers => {
                  this.fieldArrayHelpers = arrayHelpers;
                  return (
                    <div>
                      <hr className="vd-hr vd-mtl vd-mbl" />
                      <DescriptionSection
                        title="Products"
                        description="Add multiple products to create price books"
                      >
                        <SearchForProducts
                          handler={this.handleSelectSuggestion}
                        />
                      </DescriptionSection>
                      <RBField classes="vd-mll">
                        {!params.create && (
                          <PricebookItemsTable
                            items={values.items}
                            onDeleteItem={this.handleDeletePricebookItem}
                          />
                        )}
                      </RBField>
                    </div>
                  );
                }}
              />
            )}
          </RBSection>
          {!params.create && (
            <RBSection>
              <hr className="vd-hr" />
              <a
                className="vd-text--negative"
                href=""
                onClick={this.handleDeletePricebook}
              >
                Delete
              </a>
            </RBSection>
          )}
        </form>
      </div>
    );
  }
}

const { object } = PropTypes;
CRUDPricebooksPage.propTypes = {
  params: object.isRequired
};

export default CRUDPricebooksPage;
