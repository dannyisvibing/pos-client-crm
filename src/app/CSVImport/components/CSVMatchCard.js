import React from 'react';
import classnames from 'classnames';
import { RBFlex, RBLink, RBSelect, RBActionBar } from '../../../rombostrap';
import RBField, {
  RBLabel,
  RBValue
} from '../../../rombostrap/components/RBField';
import RBTable, {
  RBTBody,
  RBTR,
  RBTH,
  RBTD
} from '../../../rombostrap/components/RBTable/RBTable';
import CSVMatchCardSampleData from './CSVMatchCardSampleData';
import ColumnStates from '../constants/columnStates';

const CSVMatchCard = ({
  card,
  entityColumnsDefinition,
  onCardColumnChange,
  onCardEdit,
  onCardIgnoreChange
}) => (
  <div className="vd-csv-match-card">
    <RBFlex
      classes={classnames('vd-card', {
        'csv-card-matching': true,
        'vd-card--active': false
      })}
      flex
      flexDirection="column"
      flexJustify="between"
    >
      <div className="vd-mll vd-mrl">
        <RBTable
          classes={classnames('csv-card-matching-sample-data-container', {
            'csv-card-matching-sample-data-container--ignored':
              card.state === ColumnStates.ignored
          })}
        >
          <RBTBody>
            <RBTR>
              <RBTH>
                {card.state !== ColumnStates.ignored && (
                  <div className="csv-card-matching-header">
                    {(card.state === ColumnStates.matchedEditable ||
                      card.state === ColumnStates.unmatched) && (
                      <div>
                        {card.state === ColumnStates.unmatched && (
                          <div className="vd-text-sub-heading vd-text--negative vd-mbl vd-align-center">
                            <i className="fa fa-exclamation-triangle vd-mrs" />
                            Unmatched Column
                          </div>
                        )}

                        {card.state === ColumnStates.matchedEditable && (
                          <div className="vd-text-sub-heading vd-align-center vd-mbl">
                            Change this match
                          </div>
                        )}

                        <RBField>
                          <RBLabel>Import "{card.entity}" as</RBLabel>
                          <RBValue>
                            <RBSelect
                              selectedEntity={
                                card.matchedColumn
                                  ? card.matchedColumn.entity
                                  : ''
                              }
                              nullLabel="Please select an option"
                              entities={entityColumnsDefinition}
                              onChange={column =>
                                onCardColumnChange(card, column)
                              }
                            />
                          </RBValue>
                        </RBField>
                      </div>
                    )}

                    {card.state === ColumnStates.confirmed && (
                      <div>
                        <div className="csv-card-matching-confirmed-header vd-align-center">
                          <div className="vd-text-sub-heading csv-card-matching-confirmed-field-name">
                            <i className="fa fa-check vd-mrs vd-text--success" />
                            {card.matchedColumn.name}
                          </div>
                          <RBLink
                            classes="vd-text--sub vd-mtm vd-mbm"
                            onClick={e => onCardEdit(e, card)}
                          >
                            Change this match?
                          </RBLink>
                        </div>
                        <strong className="vd-pr">
                          {card.matchedColumn.name}
                        </strong>
                        <div className="vd-text--sub vd-text--secondary">
                          {card.entity}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {card.state === ColumnStates.ignored && (
                  <div className="csv-card-matching-header">
                    <div className="vd-mbl vd-pbl vd-align-center">
                      <div className="vd-text-sub-heading">Don't import</div>
                    </div>
                    <strong>{card.entity}</strong>
                  </div>
                )}
              </RBTH>
            </RBTR>
            <RBTR>
              <RBTD>
                <CSVMatchCardSampleData data={card.sampleData} />
              </RBTD>
            </RBTR>
          </RBTBody>
        </RBTable>
      </div>
      <RBActionBar classes="vd-pal" inline>
        <span />
        <RBLink secondary onClick={e => onCardIgnoreChange(e, card)}>
          {card.state === ColumnStates.ignored ? 'Import' : "Don't Import"}
        </RBLink>
      </RBActionBar>
    </RBFlex>
  </div>
);

export default CSVMatchCard;
