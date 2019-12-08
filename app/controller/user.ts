import { Controller } from 'egg';
import _ from 'lodash';
import { ERROR_CODE, LOGIN_COOKIE_MAX_AGE } from '../constant';

export default class UserController extends Controller {
  private setLoginCookie(userId: number|string) {
    this.ctx.cookies.set('user_id', `${userId}`, {
      httpOnly: true,
      encrypt: true,
      maxAge: LOGIN_COOKIE_MAX_AGE,
    });
  }

  private clearLoginCookie() {
    this.ctx.cookies.set('user_id', '', { maxAge: 0 });
  }

  private getLoginCookie(): string {
    return this.ctx.cookies.get('user_id', { encrypt: true });
  }

  async login() {
    try {
      const where = this.ctx.request.body;
      const opts = {
        attributes: { exclude: ['securityAnswer', 'password'] },
      };
      const userInfo = await this.service.user.getUserInfo(where, opts);
      this.setLoginCookie(userInfo.id);
      this.ctx.body = userInfo;
    } catch (error) {
      this.logger.error(error);
      this.ctx.body = {
        code: ERROR_CODE,
        message: error.name,
        data: '',
      };
    }
  }

  async logout() {
    try {
      this.clearLoginCookie();
      this.ctx.body = '';
    } catch (error) {
      this.logger.error(error);
      this.ctx.body = {
        code: ERROR_CODE,
        message: error.name,
        data: '',
      };
    }
  }

  async createUser() {
    try {
      const params = _.omit(this.ctx.request.body, ['id', 'coinNumber']);
      const userInfo = await this.service.user.create(params);
      this.setLoginCookie(userInfo.id);
      this.ctx.body = userInfo;
    } catch (error) {
      this.logger.error(error);
      this.ctx.body = {
        code: ERROR_CODE,
        message: error.name,
        data: '',
      };
    }
  }

  async updateUser() {
    try {
      const params = _.omit(this.ctx.request.body, ['id', 'securityQuestion', 'securityAnswer', 'coinNumber']);
      const userId = this.getLoginCookie();
      await this.service.user.update(params, { id: userId });
      this.ctx.body = params;
    } catch (error) {
      this.logger.error(error);
      this.ctx.body = {
        code: ERROR_CODE,
        message: error.name,
        data: '',
      };
    }
  }

  async getSecurityQuestion() {
    try {
      const where = this.ctx.query;
      const opts = { attributes: ['securityQuestion'] };
      this.ctx.body = await this.service.user.getUserInfo(where, opts);
    } catch (error) {
      this.logger.error(error);
      this.ctx.body = {
        code: ERROR_CODE,
        message: error.name,
        data: '',
      };
    }
  }

  async updatePassword() {
    try {
      const userId = this.getLoginCookie();
      const where = { id: userId };
      const opts = { attributes: ['securityAnswer'] };
      const { securityAnswer: correctAnswer } = await this.service.user.getUserInfo(where, opts);
      const { securityAnswer: needValidateAnswer, password } = this.ctx.request.body;
      if (correctAnswer !== needValidateAnswer) {
        this.ctx.body = {
          code: ERROR_CODE,
          message: '安全问题答案错误',
          data: '',
        };
        return;
      }
      await this.service.user.update({ password }, where);
      this.clearLoginCookie();
      this.ctx.body = '';
    } catch (error) {
      this.logger.error(error);
      this.ctx.body = {
        code: ERROR_CODE,
        message: error.name,
        data: '',
      };
    }
  }
}
