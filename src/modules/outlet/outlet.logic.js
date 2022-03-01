import _ from 'lodash';
import { OUTLET, refine } from '../../constants/entityModels';
import { outletsSelector } from './index';
import { userIdSelector as activeUserIdSelector } from '../auth';
import { usersSelector } from '../user';

export const getMyOutlets = state => {
  const activeUserId = activeUserIdSelector(state);
  const users = usersSelector(state);
  const outlets = outletsSelector(state);
  const activeUser = _.find(users, { userId: activeUserId });
  if (!activeUser) return [];
  const restrictedOutletIds = activeUser.restrictedOutletIds;
  if (!restrictedOutletIds.length) {
    return outlets;
  }
  const filteredOutlets = _.filter(
    outlets,
    outlet => restrictedOutletIds.indexOf(outlet.outletId) > -1
  );
  return filteredOutlets.map(outlet => refineOutlet(outlet));
};

export const refineOutlet = (raw = {}) => refine(OUTLET, raw);

export const getOutletById = (state, id) => {
  if (!id) return refineOutlet();
  const outlets = outletsSelector(state);
  return _.find(outlets, outlets => outlets.outletId === id);
};
