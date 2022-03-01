import _ from 'lodash';
import { REGISTER, refine } from '../../constants/entityModels';
import myLocalStorage from '../../utils/localStorage';
import { registersSelector } from './index';
import { CURRENT_REGISTER_ID } from '../../constants/storage';

export const refineRegister = (raw = {}) => refine(REGISTER, raw);

export const getRegisterById = (state, id) => {
  const registers = registersSelector(state);
  const register = _.find(registers, { registerId: id });
  return refineRegister(register);
};

export const getCurrentRegisterFromState = state => {
  const registers = registersSelector(state);
  return getCurrentRegisterFromApi(registers);
};

export const getCurrentRegisterFromApi = registers => {
  const currentRegisterId = myLocalStorage.get(CURRENT_REGISTER_ID);
  let currentRegister = _.find(registers, { registerId: currentRegisterId });
  if (!currentRegister) {
    currentRegister = _.find(registers, { isPrimary: 1 });
    if (currentRegister)
      myLocalStorage.save(CURRENT_REGISTER_ID, currentRegister.registerId);
  }
  return currentRegister;
};

export const setCurrentRegister = registerId => {
  myLocalStorage.save(CURRENT_REGISTER_ID, registerId);
};
