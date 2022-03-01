import React, { PureComponent } from 'react';
import _ from 'lodash';
import update from 'react-addons-update';
import AutoComplete from './Autocomplete';
import classnames from 'classnames';
import Scrollable from './Scrollable';
import IDBadge, {
  Avatar,
  Header,
  Description
} from '../../../rombostrap/components/RBBadge/IDBadge';

const Badge = ({
  matchedName,
  possibleMatchName,
  variantCount,
  sku,
  price
}) => (
  <IDBadge modifiers={['small']} inlineImage="/img/sample/pic4.jpg">
    <Avatar />
    <Header>
      <header className="vd-flex vd-flex--justify-between">
        <span className="">
          <strong>{matchedName}</strong>
          {possibleMatchName}
        </span>
        <span className="vd-plm vd-flex--no-shrink">${price}</span>
      </header>
    </Header>
    <Description>
      {variantCount && <span>{variantCount} variants</span>}
      {sku && <span>{sku}</span>}
    </Description>
  </IDBadge>
);

const SuggestionItem = ({ active, onClick, ...props }) => (
  <li className="vd-suggestion" onClick={onClick}>
    <a
      className={classnames('vd-popover-list-item', {
        'vd-popover-list-item--active': active
      })}
      style={{ cursor: 'pointer' }}
    >
      <div className="vd-suggestion-badge vd-badge">
        <Badge {...props} />
      </div>
    </a>
  </li>
);

const ProductSuggestionList = ({ suggestions, onSelectSuggestion }) => (
  <div className="vd-suggestion-list-container">
    <Scrollable classes="vd-suggestion-list">
      <div className="vd-popover-list">
        <li className="vd-popover-list-header" />
        <li className="vd-popover-list-group">
          <ol className="vd-popover-list">
            {suggestions.map((suggestion, i) => (
              <SuggestionItem
                key={i}
                active={suggestion.active}
                onClick={e => onSelectSuggestion(suggestion)}
                {...suggestion}
              />
            ))}
          </ol>
        </li>
      </div>
    </Scrollable>
  </div>
);

class SearchForProducts extends PureComponent {
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
    const { products } = this.props;
    const typedName = e.target.value;
    const queryRE = new RegExp('^' + typedName.toLowerCase());
    const groupify = _.groupBy(products, 'productHandle');
    const matchedGroups = _.values(groupify).filter(group =>
      queryRE.test(group[0].name.toLowerCase())
    );
    let showSuggestions = false;
    let matchedName, possibleMatchName;
    let suggestions = [];

    if (typedName && matchedGroups.length > 0) {
      showSuggestions = true;
      matchedName = typedName;
      possibleMatchName = matchedGroups[0][0].name.substring(typedName.length);

      suggestions = matchedGroups.reduce((memo, group) => {
        if (group.length > 1) {
          var primaryItem =
            group.find(product => product.primaryItem) || group[0];
          var suggestion = {
            productId: primaryItem.id,
            matchedName: primaryItem.name.substring(0, typedName.length),
            possibleMatchName: primaryItem.name.substring(typedName.length),
            price: primaryItem.retailPrice,
            variantCount: group.length
          };

          memo.push(suggestion);
        }
        return memo;
      }, []);
    }

    var matchedProducts = products.filter(product =>
      queryRE.test(product.fullname.toLowerCase())
    );
    if (typedName && matchedProducts.length > 0) {
      if (!showSuggestions) {
        showSuggestions = true;
        matchedName = typedName;
        possibleMatchName = matchedProducts[0].fullname.substring(
          typedName.length
        );
      }

      suggestions = suggestions.concat(
        matchedProducts.reduce((memo, product) => {
          var suggestion = {
            productId: product.id,
            matchedName: product.fullname.substring(0, typedName.length),
            possibleMatchName: product.fullname.substring(typedName.length),
            price: product.retailPrice,
            sku: product.sku
          };

          memo.push(suggestion);
          return memo;
        }, [])
      );
    }

    if (suggestions.length > 0) {
      suggestions[0].active = true;
    }

    this.setState({
      typedName,
      showSuggestions,
      matchedName,
      possibleMatchName,
      suggestions,
      activeSuggestionIndex: 0
    });
  };

  handleSuggestionSelect = suggestion => {
    const { products, onSelectSuggestion } = this.props;
    var product = products.find(product => product.id === suggestion.productId);
    var fullName;
    if (suggestion.variantCount > 0) {
      fullName = product.name;
    } else {
      fullName = product.fullname;
    }

    this.setState({
      showSuggestions: false,
      typedName: fullName
    });

    onSelectSuggestion(suggestion);
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
        placeholder="Start typing or scanning..."
        label="Search for products"
        faIcon="fa fa-search"
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
        <ProductSuggestionList
          suggestions={this.state.suggestions}
          onSelectSuggestion={this.handleSuggestionSelect}
        />
      </AutoComplete>
    );
  }
}

export default SearchForProducts;
