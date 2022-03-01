export default class User {
  constructor(config = {}) {
    this.userId = config.userId;

    this.createdAt = config.createdAt;
    this.deletedAt = config.deletedAt;
    this.updatedAt = config.updatedAt;

    this.accountType = config.accountType;
    this.isPrimaryUser = config.isPrimaryUser;
    this.username = config.username;
    this.displayName = config.displayName;
    this.userEmail = config.userEmail;
    this.userAvatar = config.userAvatar;

    this.targetDaily = config.targetDaily;
    this.targetWeekly = config.targetWeekly;
    this.targetMonthly = config.targetMonthly;

    this.seenAt = config.seenAt;
    this.restrictedOutletIds = config.restrictedOutletIds;
    this.permissions = config.permissions;
    this.version = config.version;
  }
}
