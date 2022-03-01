import React, { PureComponent } from 'react';
import update from 'react-addons-update';
import classnames from 'classnames';
import AutoComplete from './Autocomplete';
import Scrollable from './Scrollable';
import CustomerBadge from './CustomerBadge';

const CustomerSuggestion = ({
  active,
  name,
  group,
  customerCode,
  countryCode,
  onClick
}) => (
  <li className="vd-suggestion">
    <a
      className={classnames('vd-popover-list-item', {
        'vd-popover-list-item--active': active
      })}
      style={{ cursor: 'pointer' }}
    >
      <CustomerBadge
        classes="vd-suggestion-badge"
        name={name}
        group={group}
        customerCode={customerCode}
        countryCode={countryCode}
        onClick={onClick}
      />
    </a>
  </li>
);

const CustomerSuggestionList = ({ suggestions, onSelectSuggestion }) => (
  <div className="vd-suggestion-list-container">
    {/* To Do - Add footer when is ready to add new customer */}
    {/* <Scrollable classes='vd-suggestion-list vd-suggestion-list--with-footer'> */}
    <Scrollable classes="vd-suggestion-list">
      <div className="vd-popover-list">
        <li className="vd-popover-list-header" />
        <li className="vd-popover-list-group">
          <ol className="vd-popover-list">
            {suggestions.map((suggestion, index) => (
              <CustomerSuggestion
                key={index}
                {...suggestion}
                onClick={() => onSelectSuggestion(suggestion)}
              />
            ))}
          </ol>
        </li>
        {/* To Do - Add customer flexibly */}
        {/* <Suggestion
            footer
            component='li'>
            <PopoverListItem active>
              <SuggestionQueryContainer
                classes='vd-colour-do'
                component='span'>
                <i className='fa fa-plus-circle vd-mrs'/>
                {`Add "${typedName}" as new customer`}
              </SuggestionQueryContainer>
            </PopoverListItem>
        </Suggestion> */}
      </div>
    </Scrollable>
  </div>
);

class SearchForCustomers extends PureComponent {
  state = {
    showSuggestions: false,
    typedName: '',
    matchedName: '',
    possibleMatchName: '',
    suggestions: [],
    activeSuggestionIndex: 0
  };

  handleSuggestionsClose = e => {
    this.setState({ showSuggestions: false });
  };

  handleTypedNameChange = e => {
    const { customers } = this.props;
    var showSuggestions = false;
    var typedName = e.target.value;
    var matchedName, possibleMatchName;
    var suggestions = [];
    var queryRE = new RegExp('^' + typedName.toLowerCase());
    var matchedCustomers = customers.filter(customer =>
      queryRE.test(`${customer.firstname} ${customer.lastname}`.toLowerCase())
    );
    if (typedName && matchedCustomers.length > 0) {
      showSuggestions = true;
      matchedName = typedName;
      possibleMatchName = `${matchedCustomers[0].firstname} ${
        matchedCustomers[0].lastname
      }`.substring(typedName.length);

      suggestions = matchedCustomers.reduce((memo, customer) => {
        var suggestion = {
          id: customer.id,
          name: `${customer.firstname} ${customer.lastname}`,
          group: customer.customerGroup || 'All Customers',
          customerCode: customer.code,
          countryCode: customer.physicalCountry
        };

        memo.push(suggestion);
        return memo;
      }, []);
    }

    if (suggestions.length > 0) {
      suggestions[0].active = true;
    }

    this.setState({
      name: e.target.value,
      showSuggestions,
      typedName,
      matchedName,
      possibleMatchName,
      suggestions
    });
  };

  handleSuggestionSelect = suggestion => {
    this.setState({ showSuggestions: false }, () => {
      this.props.onSelectSuggestion(suggestion);
    });
  };

  handleEnterKeyPressd = () => {
    const { activeSuggestionIndex, suggestions } = this.state;
    if (suggestions.length === 0) return;
    this.handleSuggestionSelect(suggestions[activeSuggestionIndex]);
  };

  handleUpPressed = () => {
    const { activeSuggestionIndex, suggestions } = this.state;
    if (suggestions.length === 0) return;
    var nextIndex = suggestions.length - 1;
    if (activeSuggestionIndex > 0) {
      nextIndex = activeSuggestionIndex - 1;
    }
    this.replaceActive(activeSuggestionIndex, nextIndex);
  };

  handleDownPressed = () => {
    const { activeSuggestionIndex, suggestions } = this.state;
    if (suggestions.length === 0) return;
    var nextIndex = 0;
    if (suggestions.length > activeSuggestionIndex + 1) {
      nextIndex = activeSuggestionIndex + 1;
    }
    this.replaceActive(activeSuggestionIndex, nextIndex);
  };

  replaceActive(currIndex, nextIndex) {
    this.setState({
      suggestions: update(this.state.suggestions, {
        [currIndex]: {
          active: { $set: false }
        },
        [nextIndex]: {
          active: { $set: true }
        }
      }),
      activeSuggestionIndex: nextIndex
    });
  }

  render() {
    return (
      <AutoComplete
        placeholder="Add a customer"
        faIcon="fa fa-user"
        open={this.state.showSuggestions}
        value={this.state.typedName}
        match={this.state.matchedName}
        possibleMatch={this.state.possibleMatchName}
        onRequestClose={this.handleSuggestionsClose}
        onChange={this.handleTypedNameChange}
        onEnterKeyPressed={this.handleEnterKeyPressd}
        onUpPressed={this.handleUpPressed}
        onDownPressed={this.handleDownPressed}
      >
        <CustomerSuggestionList
          suggestions={this.state.suggestions}
          onSelectSuggestion={this.handleSelectSuggestion}
        />
      </AutoComplete>
    );
  }
}

export default SearchForCustomers;
