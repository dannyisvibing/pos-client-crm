import React, { PureComponent } from 'react';
import moment from 'moment';
import { Content, Heading, Section, LeftPart, RightPart } from './Layout';
import WarnPermanentAction from './WarnPermanentAction';
import { RBInputErrorMessageSection } from '../../../rombostrap/components/RBInput';
import {
  ClassicNameInput,
  ClassicDateOfBirth,
  ClassicSex,
  ClassicInput,
  ClassicCheckbox,
  ClassicNormalCheckbox,
  ClassicSelect,
  ClassicButton
} from '../../common/legacy/Basic';
import Countries from './constants/countryCode';
import '../styles/LegacyCRUDCustomersPage.css';

class ManageCustomer extends PureComponent {
  state = {
    action: '',
    customerId: '',
    firstname: '',
    lastname: '',
    company: '',
    code: '',
    group: '',
    groups: [],
    enableLoyalty: true,
    day: '',
    month: '',
    year: '',
    sex: '',
    phone: '',
    mobile: '',
    fax: '',
    email: '',
    website: '',
    twitter: '',
    optDirectMail: false,
    physicalStreet1: '',
    physicalStreet2: '',
    physicalSuburb: '',
    physicalCity: '',
    physicalPostcode: '',
    physicalState: '',
    physicalCountry: '',
    postalStreet1: '',
    postalStreet2: '',
    postalSuburb: '',
    postalCity: '',
    postalPostcode: '',
    postalState: '',
    postalCountry: '',
    customField1: '',
    customField2: '',
    customField3: '',
    customField4: '',
    note: '',
    invalidName: false
  };

  componentWillMount() {
    this.setState({
      groups: this.props.customerGroups
    });
    const { params } = this.props;
    if (params.create) {
      this.setState({ action: 'create' });
    } else {
      this.setState({ action: 'edit', customerId: params.customerId }, () =>
        this.fillOutCustomerForm(this.props)
      );
    }
  }

  fillOutCustomerForm(props) {
    var customer = props.customer;
    var enableLoyalty = props.customer ? props.customer.enableLoyalty : true;
    if (customer) {
      this.setState({
        firstname: customer.firstname,
        lastname: customer.lastname,
        company: customer.company,
        code: customer.code,
        group: customer.customerGroupId,
        enableLoyalty: enableLoyalty,
        day: customer.birthday ? moment(customer.birthday).day() : '',
        month: customer.birthday ? moment(customer.birthday).month() : '',
        year: customer.birthday ? moment(customer.birthday).year() : '',
        sex: customer.sex,
        phone: customer.phone,
        mobile: customer.mobile,
        fax: customer.fax,
        email: customer.email,
        website: customer.website,
        twitter: customer.twitter,
        optDirectMail: customer.optDirectMail,
        physicalStreet1: customer.physicalStreet1,
        physicalStreet2: customer.physicalStreet2,
        physicalSuburb: customer.physicalSuburb,
        physicalCity: customer.physicalCity,
        physicalPostcode: customer.physicalPostcode,
        physicalState: customer.physicalState,
        physicalCountry: customer.physicalCountry,
        postalStreet1: customer.postalStreet1,
        postalStreet2: customer.postalStreet2,
        postalSuburb: customer.postalSuburb,
        postalCity: customer.postalCity,
        postalPostcode: customer.postalPostcode,
        postalState: customer.postalState,
        postalCountry: customer.postalCountry,
        customField1: customer.customField1,
        customField2: customer.customField2,
        customField3: customer.customField3,
        customField4: customer.customField4,
        note: customer.customerNote
      });
    }
  }

  handleCustomerInfoChange = (key, value) => {
    this.setState({ [key]: value });
  };

  handleAddCustomer = async e => {
    if (!this.state.firstname || !this.state.lastname) {
      this.setState({ invalidName: true });
      return;
    }

    var info = Object.assign({}, this.state);
    if (info.group === 'customer:all') {
      delete info.group;
    }

    if (info.year && info.month && info.day) {
      info.birthday = moment()
        .set('year', info.year)
        .set('month', info.month - 1)
        .set('date', info.day)
        .valueOf();
      info.birthday = new Date(info.birthday);
    }

    delete info.day;
    delete info.month;
    delete info.year;

    if (this.state.action === 'create') {
      await this.props.createCustomer({
        ...info,
        customerGroupId: info.group
      });
      this.props.routerReplace('/customer');
    } else {
      await this.props.updateCustomer({
        ...info,
        id: this.props.params.customerId
      });
      this.props.routerReplace('/customer');
    }
  };

  handleOpenDeleteCustomer = e => {
    e.preventDefault();

    this.setState({ openDeleteDialog: true });
  };

  handleDeleteCustomer = async e => {
    e.preventDefault();

    this.setState({ openDeleteDialog: false });
    await this.props.deleteCustomer(this.state.customerId);
    this.props.routerReplace('/customer');
  };

  handleCloseDialog = e => {
    e.preventDefault();
    this.setState({ openDeleteDialog: false });
  };

  handleCancel = e => {
    e.preventDefault();
    this.props.routerReplace('/customer');
  };

  render() {
    const { retailerSettings } = this.props;
    const { invalidName } = this.state;

    const customerGroups = this.state.groups.map(group => ({
      label: group.name,
      value: group.id
    }));

    return (
      <Content>
        <Heading
          title={
            this.state.action === 'create'
              ? 'New Customer'
              : `Edit Customer: ${this.state.company}`
          }
        />
        <Section label="Customer Details" classes="line">
          <LeftPart>
            <ClassicNameInput
              label="Contact name"
              firstname={this.state.firstname}
              lastname={this.state.lastname}
              onChangeFirstname={e =>
                this.handleCustomerInfoChange('firstname', e.target.value)
              }
              onChangeLastname={e =>
                this.handleCustomerInfoChange('lastname', e.target.value)
              }
            />
            {invalidName && (
              <RBInputErrorMessageSection>Required</RBInputErrorMessageSection>
            )}
            <ClassicInput
              label="Company"
              value={this.state.company}
              onChange={e =>
                this.handleCustomerInfoChange('company', e.target.value)
              }
            />
            <ClassicInput
              label="Customer code"
              value={this.state.code}
              onChange={e =>
                this.handleCustomerInfoChange('code', e.target.value)
              }
            />
            <ClassicSelect
              label="Customer group"
              options={[{ label: 'All Customers', value: '' }].concat(
                customerGroups
              )}
              value={this.state.group}
              onChange={e =>
                this.handleCustomerInfoChange('group', e.target.value)
              }
            />
            {!!retailerSettings.loyaltyEnabled && (
              <ClassicCheckbox
                title="Enable Loyalty for this customer"
                checked={this.state.enableLoyalty}
                onChange={e =>
                  this.handleCustomerInfoChange(
                    'enableLoyalty',
                    e.target.checked
                  )
                }
              />
            )}
          </LeftPart>
          <RightPart>
            <ClassicDateOfBirth
              day={this.state.day}
              month={this.state.month}
              year={this.state.year}
              onChange={this.handleCustomerInfoChange}
            />
            <ClassicSex
              value={this.state.sex}
              onChange={e =>
                this.handleCustomerInfoChange('sex', e.target.value)
              }
            />
          </RightPart>
        </Section>
        <Section label="Contact Information" classes="line">
          <LeftPart>
            <ClassicInput
              label="Phone"
              value={this.state.phone}
              onChange={e =>
                this.handleCustomerInfoChange('phone', e.target.value)
              }
            />
            <ClassicInput
              label="Mobile"
              value={this.state.mobile}
              onChange={e =>
                this.handleCustomerInfoChange('mobile', e.target.value)
              }
            />
            <ClassicInput
              label="Fax"
              value={this.state.fax}
              onChange={e =>
                this.handleCustomerInfoChange('fax', e.target.value)
              }
            />
          </LeftPart>
          <RightPart>
            <ClassicInput
              label="Email"
              value={this.state.email}
              onChange={e =>
                this.handleCustomerInfoChange('email', e.target.value)
              }
            />
            <ClassicInput
              label="Website"
              value={this.state.website}
              onChange={e =>
                this.handleCustomerInfoChange('website', e.target.value)
              }
            />
            <ClassicInput
              label="Twitter"
              value={this.state.twitter}
              onChange={e =>
                this.handleCustomerInfoChange('twitter', e.target.value)
              }
            />
            <ClassicNormalCheckbox
              classes="contains-checkbox"
              label="This customer has opted out of direct mail communications"
              value={e =>
                this.handleCustomerInfoChange(
                  'optDirectMail',
                  !this.state.optDirectMail
                )
              }
            />
          </RightPart>
        </Section>
        <Section label="Address" classes="line">
          <LeftPart subhead="Physical Address">
            <ClassicInput
              label="Street"
              value={this.state.physicalStreet1}
              onChange={e =>
                this.handleCustomerInfoChange('physicalStreet1', e.target.value)
              }
            />
            <ClassicInput
              label="Street"
              value={this.state.physicalStreet2}
              onChange={e =>
                this.handleCustomerInfoChange('physicalStreet2', e.target.value)
              }
            />
            <ClassicInput
              label="Suburb"
              value={this.state.physicalSuburb}
              onChange={e =>
                this.handleCustomerInfoChange('physicalSuburb', e.target.value)
              }
            />
            <ClassicInput
              label="City"
              value={this.state.physicalCity}
              onChange={e =>
                this.handleCustomerInfoChange('physicalCity', e.target.value)
              }
            />
            <ClassicInput
              label="Postcode"
              value={this.state.physicalPostcode}
              onChange={e =>
                this.handleCustomerInfoChange(
                  'physicalPostcode',
                  e.target.value
                )
              }
            />
            <ClassicInput
              label="State"
              value={this.state.physicalState}
              onChange={e =>
                this.handleCustomerInfoChange('physicalState', e.target.value)
              }
            />
            <ClassicSelect
              label="Country"
              options={Countries}
              value={this.state.physicalCountry}
              onChange={e =>
                this.handleCustomerInfoChange('physicalCountry', e.target.value)
              }
            />
          </LeftPart>
          <RightPart subhead="Postal Address">
            <ClassicInput
              label="Street"
              value={this.state.postalStreet1}
              onChange={e =>
                this.handleCustomerInfoChange('postalStreet1', e.target.value)
              }
            />
            <ClassicInput
              label="Street"
              value={this.state.postalStreet2}
              onChange={e =>
                this.handleCustomerInfoChange('postalStreet2', e.target.value)
              }
            />
            <ClassicInput
              label="Suburb"
              value={this.state.postalSuburb}
              onChange={e =>
                this.handleCustomerInfoChange('postalSuburb', e.target.value)
              }
            />
            <ClassicInput
              label="City"
              value={this.state.postalCity}
              onChange={e =>
                this.handleCustomerInfoChange('postalCity', e.target.value)
              }
            />
            <ClassicInput
              label="Postcode"
              value={this.state.postalPostcode}
              onChange={e =>
                this.handleCustomerInfoChange('postalPostcode', e.target.value)
              }
            />
            <ClassicInput
              label="State"
              value={this.state.postalState}
              onChange={e =>
                this.handleCustomerInfoChange('postalState', e.target.value)
              }
            />
            <ClassicSelect
              label="Country"
              options={Countries}
              value={this.state.postalCountry}
              onChange={e =>
                this.handleCustomerInfoChange('postalCountry', e.target.value)
              }
            />
          </RightPart>
        </Section>
        <Section label="Additional Information" classes="line">
          <LeftPart>
            <ClassicInput
              label="Custom field 1"
              value={this.state.customField1}
              onChange={e =>
                this.handleCustomerInfoChange('customField1', e.target.value)
              }
            />
            <ClassicInput
              label="Custom field 2"
              value={this.state.customField2}
              onChange={e =>
                this.handleCustomerInfoChange('customField2', e.target.value)
              }
            />
            <ClassicInput
              label="Custom field 3"
              value={this.state.customField3}
              onChange={e =>
                this.handleCustomerInfoChange('customField3', e.target.value)
              }
            />
            <ClassicInput
              label="Custom field 4"
              value={this.state.customField4}
              onChange={e =>
                this.handleCustomerInfoChange('customField4', e.target.value)
              }
            />
          </LeftPart>
          <RightPart>
            <ClassicInput
              label="Note"
              value={this.state.note}
              onChange={e =>
                this.handleCustomerInfoChange('note', e.target.value)
              }
            />
          </RightPart>
        </Section>
        <div className="vd-flex vd-flex--justify-end">
          <ClassicButton label="Cancel" onClick={this.handleCancel} />
          {this.state.action === 'edit' && (
            <ClassicButton
              label="Delete Customer"
              onClick={this.handleOpenDeleteCustomer}
            />
          )}
          <ClassicButton
            label="Save Customer"
            onClick={this.handleAddCustomer}
          />
        </div>
        <WarnPermanentAction
          open={this.state.openDeleteDialog}
          onRequestClose={this.handleCloseDialog}
          onConfirm={this.handleDeleteCustomer}
        />
      </Content>
    );
  }
}

export default ManageCustomer;
