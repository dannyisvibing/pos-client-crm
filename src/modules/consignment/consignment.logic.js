import { MANAGE_CONSIGNMENTS } from '../../constants/pageTags';

export const getPageToRenderFromRouteParam = ({ actionOrId, action }) => {
  if (!actionOrId && !action) {
    return { tag: MANAGE_CONSIGNMENTS.HOME };
  } else if (actionOrId === 'newSupplier' && !action) {
    return {
      tag: MANAGE_CONSIGNMENTS.CRUD,
      props: { create: true, type: 'supplierOrder' }
    };
  } else if (actionOrId === 'newReturn' && !action) {
    return {
      tag: MANAGE_CONSIGNMENTS.CRUD,
      props: { create: true, type: 'supplierReturn' }
    };
  } else if (actionOrId === 'newOutlet' && !action) {
    return {
      tag: MANAGE_CONSIGNMENTS.CRUD,
      props: { create: true, type: 'outletTransfer' }
    };
  } else if (actionOrId && !action) {
    return {
      tag: MANAGE_CONSIGNMENTS.VIEW,
      props: { id: actionOrId }
    };
  } else if (actionOrId && action === 'receive') {
    return {
      tag: MANAGE_CONSIGNMENTS.CRUD,
      props: { create: false, id: actionOrId, target: 'receive' }
    };
  } else if (actionOrId && action === 'edit') {
    return {
      tag: MANAGE_CONSIGNMENTS.CRUD,
      props: { create: false, id: actionOrId, target: 'entire' }
    };
  } else if (actionOrId && action === 'editDetails') {
    return {
      tag: MANAGE_CONSIGNMENTS.CRUD,
      props: { create: false, id: actionOrId, target: 'details' }
    };
  }
};
