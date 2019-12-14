import { Controller } from 'egg';
import _ from 'lodash';
import { ERROR_CODE } from '../constant';

export default class UserController extends Controller {
  async login() {
    try {
      const { username, password } = this.ctx.request.body;
      const userInfo = await this.service.user.getUserInfo({ username });
      if (!userInfo) {
        this.ctx.body = {
          code: ERROR_CODE,
          message: '用户不存在',
          data: '',
        };
        return;
      }
      if (password !== userInfo.password) {
        this.ctx.body = {
          code: ERROR_CODE,
          message: '密码错误',
          data: '',
        };
        return;
      }
      this.service.user.setLoginCookie(userInfo.id);
      this.ctx.body = _.omit(userInfo, ['securityAnswer', 'password']);
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
      this.service.user.clearLoginCookie();
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
      const createUserKeys = [
        'username', 'password', 'securityQuestion', 'securityAnswer',
        'phone', 'qq', 'wechat', 'avatar',
      ];
      const params = _.pick(this.ctx.request.body, createUserKeys);
      const userInfo = await this.service.user.create(params);
      this.service.user.setLoginCookie(userInfo.id);
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
      const updateUserKeys = ['username', 'phone', 'qq', 'wechat', 'avatar'];
      const params = _.omit(this.ctx.request.body, updateUserKeys);
      const userId = this.service.user.getLoginCookie();
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
      const userId = this.service.user.getLoginCookie();
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
      this.service.user.clearLoginCookie();
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
