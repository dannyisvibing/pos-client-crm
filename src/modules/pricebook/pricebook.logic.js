import _ from 'lodash';
import { MANAGE_PRICEBOOKS } from '../../constants/pageTags';
import {
  PRICEBOOK,
  PRICEBOOK_ITEM,
  refine
} from '../../constants/entityModels';

export const getPageToRenderFromRouteParam = ({ action, id }) => {
  if (!action && !id) {
    return { tag: MANAGE_PRICEBOOKS.HOME };
  } else if (action === 'new' && !id) {
    return {
      tag: MANAGE_PRICEBOOKS.CRUD,
      props: { create: true }
    };
  } else if (action === 'edit' && !!id) {
    return {
      tag: MANAGE_PRICEBOOKS.CRUD,
      props: { edit: true, bookId: id }
    };
  } else if (action === 'show' && !!id) {
    return {
      tag: MANAGE_PRICEBOOKS.VIEW,
      props: { bookId: id }
    };
  }
};

export const refinePricebook = (raw = {}) => refine(PRICEBOOK, raw);

export const refinePricebookItem = (raw = {}) => refine(PRICEBOOK_ITEM, raw);

export const getPricebookById = (pricebooks, id) => {
  if (!id) return refinePricebook();
  const pricebook = _.find(pricebooks, pricebook => pricebook.bookId === id);
  let composedPricebook = refinePricebook(pricebook);
  composedPricebook.items = composedPricebook.items.map(item =>
    refinePricebookItem(item)
  );
  return composedPricebook;
};
