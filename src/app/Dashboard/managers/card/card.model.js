import EventEmitter from 'tiny-emitter';

export const CardState = {
  Hidden: 'Hidden',
  Loading: 'Loading',
  Dismissed: 'Dismissed',
  Introducing: 'Introducing',
  Ready: 'Ready',
  Error: 'Error'
};

export class BaseCard extends EventEmitter {
  constructor(data, metadata) {
    super();

    this._defaultState = CardState.Hidden;
    this._data = data;
    this._metadata = metadata;
    this._state = this._metadata.initialState || this._defaultState;
  }

  /**
   * Get the data that came from the API.
   *
   * @method getData
   *
   */
  getData() {
    return this._data;
  }

  /**
   * Update the data with new data from the API. Emits the `update` event so that any components rendering the data
   * can re-render.
   *
   * @method updateData
   *
   * @param  {extends BaseCardData} data updated data from teh API
   */
  updateData(data) {
    this._data = data;
    this.emit('update');
  }

  /**
   * Get the current state of the card.
   *
   * @method getState
   * @return {CardState}
   */
  getState() {
    return this._state;
  }

  /**
   * Set the state of the card to the given CardState. Emits the `stateChange` event.
   *
   * @method setState
   * @param  {CardState} state
   *
   * @emits stateChange
   */
  setState(state) {
    const prevState = this._state;
    if (state !== prevState) {
      this._state = state;
      this.emit('stateChange', { state, prevState });
    }
  }

  /**
   * Get the metadata for the card.
   *
   * @method getMetaData
   * @return {extends BaseCardMetaData}
   */
  getMetaData() {
    return this._metadata;
  }

  /**
   * Whether the card is currently hidden.
   *
   * @method isHidden
   * @return {boolean}
   */
  isHidden() {
    return this._state === CardState.Hidden;
  }

  /**
   * Whether the card is currently loading.
   *
   * @method isLoading
   * @return {boolean}
   */
  isLoading() {
    return this._state === CardState.Loading;
  }

  /**
   * Whether the card is ready to be rendered.
   *
   * @method isReady
   * @return {boolean}
   */
  isReady() {
    return this._state === CardState.Ready;
  }

  /**
   * Whether the card has been dismissed.
   *
   * @method isDismissed
   * @return {boolean}
   */
  isDismissed() {
    return this._state === CardState.Dismissed;
  }
}
