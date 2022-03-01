import EventEmitter from 'tiny-emitter';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';

import VD_VIEWPORT from './viewport';

const EVENTS = {
  visibilityChange: 'document:visibilitychange',
  viewportChange: 'viewport:change',
  resize: 'resize',
  online: 'online'
};

const ONLINE_DEBOUNCED_CHECK = 10000;

/**
 * Service for managing interactions with the window (and document) to reduce the number of repaints triggered by
 * inspecting the window/document.
 *
 * @module vdWindowDelegate
 * @class VdWindowDelegate
 * @extends EventEmitter
 * @constructor
 */

class RbWindowDelegate extends EventEmitter {
  constructor() {
    super();

    this._VD_VIEWPORT = VD_VIEWPORT;

    /**
     * The configuration of the viewport identifier DOM element.
     *
     * @property _viewportIdentifierConfig
     * @type {Object}
     */
    this._viewportIdentifierConfig = this._VD_VIEWPORT.identifier;

    /**
     * The viewport identifier element.
     *
     * @property _viewportIdentifierElement
     * @type {$element}
     */
    this._viewportIdentifierElement = this._getViewportIdentifierElement();

    /**
     * The current viewport size. For example 'small' or 'large'.
     *
     * @property _currentViewport
     * @type {String}
     */
    this._currentViewport = this._evaluateViewport();

    /**
     * Handler for responding to the window resize event.
     *
     * @property _onWindowResizeHandler
     * @type {Function}
     */
    this._onWindowResizeHandler = () => this._onWindowResize();

    /**
     * Handler for responding to the window online and offline events.
     *
     * @property _onOnlineOfflineHandler
     * @type {Function}
     */
    this._onOnlineOfflineHandler = () => this._onOnlineOffline();

    this._bindWindowEvents();
    this._bindDocumentEvents();
  }

  // ============================== Public API =============================== //

  static getInstance() {
    if (window.rbWindowDelegate) return window.rbWindowDelegate;
    window.rbWindowDelegate = new RbWindowDelegate();
    return window.rbWindowDelegate;
  }

  /**
   * The current viewport.
   *
   * @property currentViewport
   * @type {Object}
   */
  currentViewport() {
    return {
      viewport: this._currentViewport,
      data: this._VD_VIEWPORT.ranges[this._currentViewport]
    };
  }

  /**
   * The current connection state.
   *
   * @property isOnline
   * @type {Boolean}
   */
  isOnline() {
    return window.navigator.onLine;
  }

  /**
   * Compare the size of the current viewport to the given viewport to determine which is larger.
   *
   * @method compareToViewport
   *
   * @param  {String|ViewportData} viewport
   *         The name of the viewport to compare to or the VD_VIEWPORT.ranges instance of the viewport to compare to
   *
   * @return {Number} 0 if the two viewports are the same, -1 if the current viewport is smaller than the given
   *                  viewport, 1 if the current viewport is larger than the given viewport
   */
  compareToViewport(viewport) {
    const viewportData =
      typeof viewport === 'string'
        ? this._VD_VIEWPORT.ranges[viewport]
        : viewport;

    if (!viewportData || !viewportData.range) {
      throw new TypeError(
        `${viewport} must be a valid VD_VIEWPORT or the name of a valid VD_VIEWPORT.`
      );
    }

    const currViewportData = this._VD_VIEWPORT.ranges[this._currentViewport];

    if (isEqual(currViewportData, viewportData)) {
      return 0;
    }

    if (
      this._getViewportMax(currViewportData) <
      this._getViewportMin(viewportData)
    ) {
      return -1;
    }

    if (
      this._getViewportMin(currViewportData) >
      this._getViewportMax(viewportData)
    ) {
      return 1;
    }

    throw new Error(
      `Unable to compare ${viewport} with current viewport ${
        this._currentViewport
      }`
    );
  }

  // ============================== Events =============================== //

  /**
   * Emitted when an online / offline event occurs.
   *
   * @property EVENTS.online
   * @event window:online|offline
   *
   * @param {Boolean} event.online
   *        Whether the browser is online or offline
   */

  /**
   * Emitted when the visibility of the document changes.
   *
   * @property EVENTS.visibilityChange
   * @event document:visibilitychange
   *
   * @param {Boolean} event.hidden
   *        Whether the document is hidden or not
   */

  /**
   * Emitted when the viewport changes, trigged via a window resize. Additional child events are emitted for specific
   * viewport transitions; e.g. 'viewport:change:from-medium' or 'viewport:change:to-large'.
   *
   * @property EVENTS.viewportChange
   * @event window:resize
   *
   * @param {Object} event.data
   * 				@param {Object} event.data.from
   * 				       The viewport key and data for the 'from' viewport
   *
   * 				@param {Object} event.data.to
   * 				       The viewport key and data for the 'to' viewport
   */
  EVENTS() {
    return EVENTS;
  }

  // ============================== Private Methods =============================== //

  /**
   * Sets the current viewport and emits an event if the stored viewport does not match the current.
   *
   * @private
   * @method _updateViewport
   */
  _updateViewport() {
    const fromViewportKey = this._currentViewport;
    const toViewportKey = this._evaluateViewport();

    this.emit(EVENTS.resize, {
      currentViewport: toViewportKey,
      data: this._VD_VIEWPORT.ranges[toViewportKey]
    });

    if (fromViewportKey === toViewportKey) {
      return;
    }

    const fromViewport = {
      viewport: fromViewportKey,
      data: this._VD_VIEWPORT.ranges[fromViewportKey]
    };

    const toViewport = {
      viewport: toViewportKey,
      data: this._VD_VIEWPORT.ranges[toViewportKey]
    };

    const viewportChangeData = { from: fromViewport, to: toViewport };

    this.emit(EVENTS.viewportChange, viewportChangeData);
    // Emit events for specific transitions; e.g. 'viewport:change:from-medium' or 'viewport:change:to-large'
    this.emit(
      `${EVENTS.viewportChange}:from-${fromViewportKey}`,
      viewportChangeData
    );
    this.emit(
      `${EVENTS.viewportChange}:to-${toViewportKey}`,
      viewportChangeData
    );

    this._currentViewport = toViewportKey;
  }

  /**
   * Returns the viewport identifier element. This element is used to determine the current viewport. Media queries in
   * styles/viewport/_viewport-identifier changes it's pseudo element content to the current viewport key. For example
   * 'small' or 'medium'.
   *
   * @private
   * @method _getViewportIdentifierElement
   *
   * @return {element} The viewport identifier element
   */
  _getViewportIdentifierElement() {
    const { id } = this._viewportIdentifierConfig;
    let viewportElement = document.getElementById(id);

    if (viewportElement) {
      return viewportElement;
    } else {
      // Append element if not already present
      viewportElement = document.createElement('DIV');
      viewportElement.setAttribute('id', id);
      document.getElementsByTagName('body')[0].appendChild(viewportElement);

      return viewportElement;
    }
  }

  /**
   * Retrieves the current viewport (for example 'small' or 'medium') from the pseudo element of the viewport
   * identifier element.
   *
   * @private
   * @method _evaluateViewport
   *
   * @return {String} The current viewport, for example 'small' or 'medium'
   */
  _evaluateViewport() {
    const viewportElement = this._viewportIdentifierElement;
    const { pseudoElement, IEContentProp } = this._viewportIdentifierConfig;

    let viewport;
    // Retrieving the content of a pseudo element via getComputedStyle is only supported in IE >= 11 so we use
    // IE's proprietary 'currentStyle' to achieve the same result.
    if ('currentStyle' in viewportElement) {
      viewport = viewportElement.currentStyle[IEContentProp];
    } else {
      viewport = window.getComputedStyle(viewportElement, `::${pseudoElement}`)
        .content;
    }

    if (viewport) {
      // The string that getComputedStyle returns includes the quotes, and these could be single or double quotes
      // depending on the browser, so strip all quotes.
      return viewport.replace(/["']/g, '');
    }
  }

  /**
   * Handler for responding to the window resize event.
   *
   * @private
   * @method _onWindowResize
   */
  _onWindowResize() {
    this._updateViewport();
  }

  /**
   * Handler for responding to the window offline and online event.
   *
   * @private
   * @method _onOnlineOffline
   */
  _onOnlineOffline() {
    this.emit(EVENTS.online, this.isOnline);
  }

  /**
   * Bind to all the window events we're interested in.
   *
   * @private
   * @method _bindWindowEvents
   */
  _bindWindowEvents() {
    window.addEventListener(
      'resize',
      debounce(this._onWindowResizeHandler, 200)
    );
    window.addEventListener(
      'offline',
      debounce(this._onOnlineOfflineHandler, ONLINE_DEBOUNCED_CHECK)
    );
    window.addEventListener(
      'online',
      debounce(this._onOnlineOfflineHandler, ONLINE_DEBOUNCED_CHECK)
    );
  }

  /**
   * Bind to all the document events we're interested in.
   *
   * @private
   * @method _bindDocumentEvents
   */
  _bindDocumentEvents() {
    document.addEventListener('visibilitychange', event => {
      this.emit(EVENTS.visibilityChange, { hidden: event.target.hidden });
    });
  }

  /**
   * Get the maximum width for the given viewport data.
   *
   * @private
   * @method _getViewportMax
   *
   * @param {ViewportData} viewport
   *        The viewport data from VD_VIEWPORT.ranges
   *
   * @return {Number} the maximum width for the specified viewport
   */
  _getViewportMax(viewport) {
    return viewport.range.max || Number.POSITIVE_INFINITY;
  }

  /**
   * Get the minimum width for the given viewport data.
   *
   * @private
   * @method _getViewportMin
   *
   * @param {ViewportData} viewport
   *        The viewport data from VD_VIEWPORT.ranges
   *
   * @return {Number} the minimum width for the specified viewport
   */
  _getViewportMin(viewport) {
    return viewport.range.min || 0;
  }
}

export default RbWindowDelegate;
