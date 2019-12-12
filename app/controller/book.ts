import { Controller } from 'egg';
import _ from 'lodash';
import { ERROR_CODE } from '../constant';

export default class BookController extends Controller {
  async getBookList() {
    try {
      const { page = 1, pageSize = 10, ...restQuery } = this.ctx.query;
      const params = {
        page: Number(page),
        pageSize: Number(pageSize),
        ...restQuery,
      };
      this.ctx.body = await this.service.book.getBookList(params);
    } catch (error) {
      this.logger.error(error);
      this.ctx.body = {
        code: ERROR_CODE,
        message: error.name,
        data: '',
      };
    }
  }

  async getBookInfo() {
    try {
      const { bookId } = this.ctx.params;
      this.ctx.body = await this.service.book.getBookInfo(bookId);
    } catch (error) {
      this.logger.error(error);
      this.ctx.body = {
        code: ERROR_CODE,
        message: error.name,
        data: '',
      };
    }
  }

  async createBook() {
    try {
      const params = _.omit(this.ctx.request.body, ['id', 'recordChain', 'keeperId']);
      params.keeperId = this.service.user.getLoginCookie();
      params.recordChain = [];
      this.ctx.body = await this.service.book.createBook(params);
    } catch (error) {
      this.logger.error(error);
      this.ctx.body = {
        code: ERROR_CODE,
        message: error.name,
        data: '',
      };
    }
  }

  async updateBook() {
    try {
      const { bookId } = this.ctx.params;
      const params = _.omit(this.ctx.request.body, ['id', 'recordChain']);
      await this.service.book.updateBook(params, { id: bookId });
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
}
