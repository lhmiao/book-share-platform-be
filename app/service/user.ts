import { Service } from 'egg';
import { LOGIN_COOKIE_MAX_AGE } from '../constant';

interface UserInfo {
  id?: number|string;
  username?: string;
  password?: string;
  securityQuestion?: string;
  securityAnswer?: string;
  phone?: string;
  qq?: string;
  wechat?: string;
  coin_number?: number;
  avatar?: Blob;
}

export default class UserService extends Service {
  setLoginCookie(userId: number|string) {
    this.ctx.cookies.set('user_id', `${userId}`, {
      httpOnly: true,
      encrypt: true,
      maxAge: LOGIN_COOKIE_MAX_AGE,
    });
  }

  clearLoginCookie() {
    this.ctx.cookies.set('user_id', '', { maxAge: 0 });
  }

  getLoginCookie(): string {
    return this.ctx.cookies.get('user_id', { encrypt: true });
  }

  async getUserInfo(where: UserInfo, opts: object = {}) {
    const record = await this.ctx.model.User.findOne({ where, ...opts });
    return record.get({ plain: true });
  }

  async create(record: UserInfo) {
    const result = await this.ctx.model.User.create(record);
    return result.get({ plain: true });
  }

  update(record: UserInfo, where: UserInfo) {
    return this.ctx.model.User.update(record, { where });
  }
}
