import React, { Component } from 'react';
import _ from 'lodash';
import PrimaryContentLayout, {
  HeaderComponent,
  BodyComponent
} from '../../common/legacy/PrimaryContent';
import RegisterClosuresFilter from './RegisterClosuresFilter';
import RegisterClosuresTable from './RegisterClosuresTable';

class RegisterClosures extends Component {
  state = {
    outletOptions: [],
    registerOptions: [],
    selectedOutlet: 'all',
    selectedRegister: 'all',
    data: []
  };

  componentWillMount() {
    var outlets = [{ label: 'All Outlets', value: 'all' }].concat(
      this.props.outlets.map(outlet => ({
        label: outlet.outletName,
        value: outlet.outletId
      }))
    );

    var registers = [{ label: 'All Registers', value: 'all' }].concat(
      this.props.registers.map(register => ({
        label: register.registerName,
        value: register.registerId
      }))
    );

    this.setState({
      outletOptions: outlets,
      registerOptions: registers
    });

    this.updateTable();
  }

  handleFilterChange = (key, value) => {
    const { registers, outlets } = this.props;
    const registersHash = _.keyBy(registers, 'register_id');
    const outletsHash = _.keyBy(outlets, 'outlet_id');
    var update = { [key]: value };
    if (key === 'selectedRegister') {
      if (value !== 'all') {
        var outlet = outletsHash[registersHash[value].outletId];
        update.outletOptions = [
          { label: outlet.outletName, value: outlet.outletId }
        ];
      } else {
        update.outletOptions = [{ label: 'All Outlets', value: 'all' }].concat(
          this.props.store.outlets.map(outlet => ({
            label: outlet.outletName,
            value: outlet.outletId
          }))
        );
      }
    } else if (key === 'selectedOutlet') {
      update.registerOptions = [
        { label: 'All Registers', value: 'all' }
      ].concat(
        registers
          .filter(
            register => (value === 'all' ? true : register.outletId === value)
          )
          .map(register => ({
            label: register.registerName,
            value: register.registerId
          }))
      );
    }

    this.setState(update);
  };

  updateTable() {
    // const { registersHash } = this.props.outlet;
    // AnalyseApi.registerClosures({outletId: this.state.selectedOutlet, registerId: this.state.selectedRegister})
    //     .then(data => {
    //         this.setState({data: data.map(datum => ({
    //             register: registersHash[datum.registerId].registerName,
    //             closureIndex: datum.closureIndex,
    //             openingTime: moment(datum.openingTime).format('D MMM YY H:m'),
    //             closingTime: datum.closingTime ? moment(datum.closingTime).format('D MMM YY H:m') : 'Still open',
    //             storeCredit: '-',
    //             totalCash: datum.totalCash,
    //             creditCard: '-',
    //             total: 0
    //         }))})
    //     })
    //     .catch(err => {});
  }

  render() {
    return (
      <PrimaryContentLayout title="Register Closures">
        <HeaderComponent>
          <RegisterClosuresFilter
            outlets={this.state.outletOptions}
            registers={this.state.registerOptions}
            selectedOutlet={this.state.selectedOutlet}
            selectedRegister={this.state.selectedRegister}
            onChange={this.handleFilterChange}
            onApply={() => this.updateTable()}
          />
        </HeaderComponent>
        <BodyComponent>
          <RegisterClosuresTable data={this.state.data} />
        </BodyComponent>
      </PrimaryContentLayout>
    );
  }
}

export default RegisterClosures;
