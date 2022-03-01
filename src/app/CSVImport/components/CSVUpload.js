import React, { Component } from 'react';
import Papaparse from 'papaparse';
import { RBSection } from '../../../rombostrap';
import UploadReady from './UploadReady';
import UploadValidating from './UploadValidating';
import UploadSuccess from './UploadSuccess';
import UploadSending from './UploadSending';
import CSVMatchFields from './CSVMatchFields';
import ColumnStates from '../constants/columnStates';
import ConfirmColumnChangeDialog from './ConfirmColumnChangeDialog';
import MissingImportantColumnDialog from './MissingImportantColumnDialog';
import STATES from '../constants/importState';
import productImportService from '../managers/productImportManager';
import customerImportService from '../managers/customerImportManager';
import '../styles/index.css';

class CSVUpload extends Component {
  state = {
    state: STATES.ready,
    fileName: '',
    cards: [],
    resolvedColumnsDefinition: [],
    importedCount: 0
  };

  getEntityService() {
    const { entity } = this.props;
    if (entity === 'customer') return customerImportService;
    if (entity === 'product') return productImportService;
    return productImportService;
  }

  handleFileDrop = file => {
    this.setState({
      state: STATES.validating,
      fileName: file.name
    });
    this.parseCSVFile(file)
      .then(result => {
        if (result.meta.aborted || result.errors.length > 0) {
          this.setState({ state: STATES.parseError });
        } else {
          this.composeCards(result.data);
        }
      })
      .catch(error => {
        this.setState({ state: STATES.error });
      });
  };

  parseCSVFile(file) {
    return new Promise((resolve, reject) => {
      Papaparse.parse(file, {
        complete: function(results) {
          resolve(results);
        },
        error: function(error) {
          reject(error);
        }
      });
    });
  }

  composeCards(data) {
    var result = this.getEntityService().composeCards(data);
    var hasInvalidFields = result.cards.some(
      card => card.state !== ColumnStates.confirmed
    );
    this.setState({
      importedCount: (data || []).length,
      cards: result.cards,
      resolvedColumnsDefinition: result.resolvedColumnsDefinition,
      state: hasInvalidFields ? STATES.invalidFields : STATES.sending
    });
  }

  handleCardColumnChange = (card, column) => {
    var _entityService = this.getEntityService();
    var { cards } = this.state;
    var targetCard = _entityService.canSimplyChangeColumn(cards, card, column);

    if (!targetCard) {
      cards = _entityService.changeColumn(cards, card, column);
      this.setState({ cards });
    } else {
      this.confirmColumnChangeDialog.open(targetCard, card).then(confirmed => {
        if (confirmed) {
          cards = _entityService.exchangeColumn(cards, targetCard, card);
          this.setState({ cards });
        }
      });
    }
  };

  handleCardEdit = (e, card) => {
    e.preventDefault();

    var cards = this.getEntityService().transformIntoEditableCard(
      this.state.cards,
      card
    );
    this.setState({ cards });
  };

  handleCardIgnoreChange = (e, card) => {
    e.preventDefault();

    var cards = this.getEntityService().ignoreChangeCard(
      this.state.cards,
      card
    );
    this.setState({ cards });
  };

  handleCancel = e => {
    e.preventDefault();
    this.setState({
      state: STATES.ready,
      cards: []
    });
  };

  handleUploadContinue = e => {
    e.preventDefault();

    var { cards } = this.state;
    var missingColumns = this.getEntityService().assureImportantColumns(cards);
    if (missingColumns.length === 0) {
      this.setState({ state: STATES.success });
    } else {
      this.missingImportantColumnDialog.open(missingColumns).then(() => {});
    }
  };

  handleSend = e => {
    e.preventDefault();

    var { cards } = this.state;
    this.setState({ state: STATES.sending });

    var sanizitedCards = cards.reduce((memo, card) => {
      if (card.state === ColumnStates.ignored) return memo;
      if (card.state === ColumnStates.unmatched) return memo;
      memo.push(card);
      return memo;
    }, []);

    sanizitedCards = sanizitedCards.map(card => ({
      entity: card.matchedColumn.entity,
      data: card.sampleData,
      resolver: card.matchedColumn.resolver
    }));

    this.getEntityService()
      .import(sanizitedCards)
      .then(() => {
        this.setState({ state: STATES.ready });
      })
      .catch(err => {
        this.setState({ state: STATES.error });
      });
  };

  render() {
    const { state, cards } = this.state;
    return (
      <div>
        <RBSection>
          {state === STATES.ready && (
            <UploadReady
              subject={this.getEntityService().getEntityName(true)}
              onFileDrop={this.handleFileDrop}
            />
          )}
          {state === STATES.validating && <UploadValidating />}
        </RBSection>
        {state === STATES.invalidFields && (
          <CSVMatchFields
            fileName={this.state.fileName}
            cards={cards}
            entityColumnsDefinition={this.state.resolvedColumnsDefinition}
            onCardColumnChange={this.handleCardColumnChange}
            onCardEdit={this.handleCardEdit}
            onCardIgnoreChange={this.handleCardIgnoreChange}
            onCancel={this.handleCancel}
            onContinue={this.handleUploadContinue}
          />
        )}
        {state === STATES.success && (
          <UploadSuccess
            subject={this.getEntityService().getEntityName(true)}
            fileName={this.state.fileName}
            importedCount={this.state.importedCount}
            onCancel={this.handleCancel}
            onSend={this.handleSend}
          />
        )}
        {state === STATES.sending && <UploadSending />}
        <ConfirmColumnChangeDialog
          ref={c => (this.confirmColumnChangeDialog = c)}
        />
        <MissingImportantColumnDialog
          ref={c => (this.missingImportantColumnDialog = c)}
        />
      </div>
    );
  }
}

export default CSVUpload;
