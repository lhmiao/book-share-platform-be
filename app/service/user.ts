import { Service } from 'egg';

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
