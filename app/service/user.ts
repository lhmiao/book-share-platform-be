import { Service } from 'egg';

export interface UserInfo {
  id?: number|string;
  username?: string;
  password?: string;
  securityQuestion?: string;
  securityAnswer?: string;
  phone?: string;
  qq?: string;
  wechat?: string;
  coinNumber?: number;
  avatar?: Blob;
}

export default class UserService extends Service {
  setLoginCookie(userId: number|string) {
    this.ctx.cookies.set('user_id', `${userId}`, {
      httpOnly: true,
      encrypt: true,
      maxAge: this.ctx.constant.LOGIN_COOKIE_MAX_AGE,
    });
  }

  clearLoginCookie() {
    this.ctx.cookies.set('user_id', '', { maxAge: 0 });
  }

  getLoginCookie(): number {
    const userId = this.ctx.cookies.get('user_id', { encrypt: true });
    return Number(userId);
  }

  async getUserInfo(where: UserInfo) {
    const record = await this.ctx.model.User.findOne({ where });
    if (!record) return Promise.reject({ name: '用户不存在' });
    return record.get({ plain: true });
  }

  async createUser(record: UserInfo, opts: object = {}) {
    const result = await this.ctx.model.User.create(record, opts);
    return result.get({ plain: true });
  }

  updateUserInfo(record: UserInfo, opts: object) {
    return this.ctx.model.User.update(record, opts);
  }

  async updateUserCoinNumber(userId: number|string, changeNumber: number, opts: object = {}) {
    const where = { id: userId };
    const { coinNumber: originCoinNumber } = await this.getUserInfo(where);
    const coinNumber = originCoinNumber + changeNumber;
    await this.updateUserInfo({ coinNumber }, { where, ...opts });
    return { coinNumber };
  }
}
