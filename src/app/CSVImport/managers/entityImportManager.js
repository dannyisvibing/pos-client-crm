import * as zipWith from 'lodash/zipWith';
import * as flatten from 'lodash/flatten';
import * as uniq from 'lodash/uniq';
import ColumnStates from '../constants/columnStates';

export default class EntityImportService {
  static composeCards(data = []) {
    if (data.length < 1) return [];

    var definition = this._resolveColumnsDefinition(data[0]);
    var columns = this._evaluateColumns(data, definition);

    var ignoreFirstRow =
      columns.findIndex(column => column.state === ColumnStates.confirmed) > -1;
    if (ignoreFirstRow) data.splice(0, 1);

    var sampleDataArr = zipWith(...data, function() {
      return Array.prototype.slice.call(arguments);
    });

    columns.forEach((column, i) => {
      column.sampleData = sampleDataArr[i];
      column.state = column.sampleData.some(item => !!item)
        ? column.state
        : ColumnStates.ignored;
    });

    return {
      cards: columns,
      resolvedColumnsDefinition: definition
    };
  }

  static canSimplyChangeColumn(cards, card, column) {
    if (!column.entity) {
      return true;
    } else {
      return cards.find(
        _card =>
          _card.index !== card.index &&
          (_card.matchedColumn || {}).entity === column.entity
      );
    }
  }

  static changeColumn(cards, card, column) {
    var index = cards.findIndex(_card => _card.index === card.index);
    if (index > -1) {
      if (!column.entity) {
        cards[index].matchedColumn = null;
        cards[index].state = ColumnStates.unmatched;
      } else {
        cards[index].matchedColumn = column;
        cards[index].state = ColumnStates.confirmed;
      }
    }

    return cards;
  }

  static exchangeColumn(cards, targetCard, sourceCard) {
    var targetIndex = cards.findIndex(
      _card => _card.index === targetCard.index
    );
    var sourceIndex = cards.findIndex(
      _card => _card.index === sourceCard.index
    );

    if (targetIndex > -1 && sourceIndex > -1) {
      cards[sourceIndex].matchedColumn = targetCard.matchedColumn;
      cards[sourceIndex].state = ColumnStates.confirmed;
      cards[targetIndex].matchedColumn = null;
      cards[targetIndex].state = ColumnStates.unmatched;
    }

    return cards;
  }

  static transformIntoEditableCard(cards, card) {
    var index = cards.findIndex(_card => _card.index === card.index);

    if (index > -1) {
      cards[index].state = ColumnStates.matchedEditable;
    }

    return cards;
  }

  static ignoreChangeCard(cards, card) {
    var index = cards.findIndex(_card => _card.index === card.index);

    if (index > -1) {
      if (card.state === ColumnStates.ignored) {
        cards[index].matchedColumn = null;
        cards[index].state = ColumnStates.unmatched;
      } else {
        cards[index].matchedColumn = null;
        cards[index].state = ColumnStates.ignored;
      }
    }

    return cards;
  }

  static assureImportantColumns(
    cards,
    importantColumns = [],
    entityColumnsDefinition
  ) {
    return importantColumns
      .filter(
        columnEntity =>
          cards.findIndex(
            card => (card.matchedColumn || {}).entity === columnEntity
          ) === -1
      )
      .map(columnEntity =>
        entityColumnsDefinition.find(column => column.entity === columnEntity)
      );
  }

  static _flattenColumnsDefinition(
    columnsData,
    entityColumnsDefinition,
    prefix
  ) {
    if (prefix) {
      var ids = uniq(
        columnsData
          .filter(columnName => columnName.startsWith(prefix))
          .map(columnName => {
            return (/_([\w-]*)__/g.exec(columnName) || [])[1] || '';
          })
      );
      var result = [];
      ids.forEach(id => {
        result = result.concat(
          flatten(
            entityColumnsDefinition.map(column => {
              if (column.type === 'array')
                return this._flattenColumnsDefinition(
                  columnsData,
                  column.entities,
                  `${prefix}_${id}__${column.prefix}`
                );
              return {
                name: `${column.name} For %name%`,
                entity: `${prefix}_${id}__${column.entity}`,
                resolver: {
                  entity: prefix,
                  id,
                  column: column.entity
                }
              };
            })
          )
        );
      });

      return result;
    } else {
      return flatten(
        entityColumnsDefinition.map(column => {
          if (column.type === 'array')
            return this._flattenColumnsDefinition(
              columnsData,
              column.entities,
              column.prefix
            );
          return column;
        })
      );
    }
  }

  static _evaluateColumns(data, entityColumnsDefinition) {
    var firstRow = data[0];
    return firstRow.map((col, index) => {
      var columnIndex = entityColumnsDefinition.findIndex(
        column => column.entity === col
      );

      if (columnIndex > -1) {
        return {
          index,
          entity: col,
          matchedColumn: entityColumnsDefinition[columnIndex],
          state: ColumnStates.confirmed,
          sampleData: []
        };
      } else {
        return {
          index,
          entity: col,
          state: ColumnStates.unmatched,
          sampleData: []
        };
      }
    });
  }
}
