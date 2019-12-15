import { Controller } from 'egg';
import _ from 'lodash';

export default class UserController extends Controller {
  async login() {
    try {
      const { username, password } = this.ctx.request.body;
      const userInfo = await this.service.user.getUserInfo({ username });
      if (password !== userInfo.password) {
        this.ctx.body = {
          code: this.ctx.constant.ERROR_CODE,
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
        code: this.ctx.constant.ERROR_CODE,
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
        code: this.ctx.constant.ERROR_CODE,
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
      const userInfo = await this.service.user.createUser(params);
      this.service.user.setLoginCookie(userInfo.id);
      this.ctx.body = userInfo;
    } catch (error) {
      this.logger.error(error);
      const message = error.name === 'SequelizeUniqueConstraintError'
        ? '该用户名已存在'
        : error.name;
      this.ctx.body = {
        code: this.ctx.constant.ERROR_CODE,
        message,
        data: '',
      };
    }
  }

  async updateUser() {
    try {
      const updateUserKeys = ['username', 'phone', 'qq', 'wechat', 'avatar'];
      const params = _.omit(this.ctx.request.body, updateUserKeys);
      const userId = this.service.user.getLoginCookie();
      const where = { id: userId };
      await this.service.user.updateUserInfo(params, { where });
      this.ctx.body = params;
    } catch (error) {
      this.logger.error(error);
      this.ctx.body = {
        code: this.ctx.constant.ERROR_CODE,
        message: error.name,
        data: '',
      };
    }
  }

  async getSecurityQuestion() {
    try {
      const where = this.ctx.query;
      const userInfo = await this.service.user.getUserInfo(where);
      this.ctx.body = _.pick(userInfo, ['securityQuestion']);
    } catch (error) {
      this.logger.error(error);
      this.ctx.body = {
        code: this.ctx.constant.ERROR_CODE,
        message: error.name,
        data: '',
      };
    }
  }

  async updatePassword() {
    try {
      const userId = this.service.user.getLoginCookie();
      const where = { id: userId };
      const { securityAnswer: correctAnswer } = await this.service.user.getUserInfo(where);
      const { securityAnswer: needValidateAnswer, password } = this.ctx.request.body;
      if (correctAnswer !== needValidateAnswer) {
        this.ctx.body = {
          code: this.ctx.constant.ERROR_CODE,
          message: '安全问题答案错误',
          data: '',
        };
        return;
      }
      await this.service.user.updateUserInfo({ password }, { where });
      this.service.user.clearLoginCookie();
      this.ctx.body = '';
    } catch (error) {
      this.logger.error(error);
      this.ctx.body = {
        code: this.ctx.constant.ERROR_CODE,
        message: error.name,
        data: '',
      };
    }
  }
}
