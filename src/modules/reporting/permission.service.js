// import rbActiveUser from '../active-user';

export default class PermissionService {
  static canViewDashboard() {
    // @tricky
    return true;
    // return rbActiveUser.isAdmin() || rbActiveUser.isManager();
  }

  static canAccessDashboard() {
    return true;
  }

  static isTrialAccount() {
    return true;
  }

  static isDemoAccount() {
    return false;
  }
}
