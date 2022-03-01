import * as forEach from 'lodash/forEach';
import { BaseCard } from './card.model';
import CARDS from './card.constants';

export const PRIMARY_PERFORMANCE = { id: '0', type: 'performance.primary' }; // CardData

/**
 * Create a collection of Card instances from the given collection of CardData filtering out any cards that are not
 * registered in CARDS.
 *
 * @param {CardData[]} cardDatas
 * @return {Card[]}
 */
function createCardCollection(cardDatas) {
  var cards = [];

  forEach(cardDatas || [], cardData => {
    if (CARDS.hasOwnProperty(cardData.type)) {
      cards.push(new Card(cardData, CARDS[cardData.type]));
    }
  });

  return cards;
}

/**
 * Manages the state and data for a card displayed on the dashboard.
 *
 * @class Card
 * @extends {BaseCard}
 */
export class Card extends BaseCard {
  /**
   * Creates an instance of Card.
   *
   * @constructor
   * @param {CardData} card
   * @param {CardMetaData} metaData
   */
  constructor(card, metadata) {
    super(card, metadata);
    this._size = this._metadata.size;
  }

  /**
   * Get the configured size of the Card (a number from 1 to 4).
   *
   * @method getSize
   * @return {number}
   */
  getSize() {
    return this._size;
  }

  /**
   * Set the size of the card.
   *
   * @method setSize
   * @param  {number} size The size of the card to set (a number from 1 to 4)
   */
  setSize(size) {
    const prevSize = this._size;
    if (size !== prevSize) {
      this._size = size;
      this.emit('sizeChange', { size, prevSize });
    }
  }
}

/**
 * Service for managing the cards that are displayed on the dashboard.
 *
 * @export
 * @class CardService
 */
export default class RBCardService {
  constructor() {
    this._primaryCard = new Card(
      PRIMARY_PERFORMANCE,
      CARDS[PRIMARY_PERFORMANCE.type]
    );
    this._cards = []; // Card[]
  }

  /**
   * Register the given dashboard data. This enables components to retrieve the instance of a
   * registered Card using the card's name.
   *
   * @method register
   * @param  {DashboardData} dashboardData
   */
  register(dashboardData) {
    this._cards = createCardCollection(dashboardData.cards);
  }

  /**
   * Get the list of cards to display on the dashboard.
   *
   * @method getCards
   *
   * @return {Card[]}
   */
  getCards() {
    return this._cards;
  }

  /**
   * Get the primary Card to display on the dashboard.
   *
   * @method getPrimaryCard
   *
   * @return {Card}
   */
  getPrimaryCard() {
    return this._primaryCard;
  }

  //To Do - remove later
  //only register function should be called
  setPrimaryCard() {
    this._primaryCard = new Card(
      PRIMARY_PERFORMANCE,
      CARDS[PRIMARY_PERFORMANCE.type]
    );
  }
}
