import { Controller } from 'egg';
import _ from 'lodash';

export default class BookController extends Controller {
  async getBookList() {
    try {
      const { page = 1, pageSize = 10, onlyOnSell = 0 } = this.ctx.query;
      const params = {
        page: Number(page),
        pageSize: Number(pageSize),
        onlyOnSell: Number(onlyOnSell),
      };
      this.ctx.body = await this.service.book.getBookList(params);
    } catch (error) {
      this.logger.error(error);
      this.ctx.body = {
        code: this.ctx.constant.ERROR_CODE,
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
        code: this.ctx.constant.ERROR_CODE,
        message: error.name,
        data: '',
      };
    }
  }

  async getBookRecordChain() {
    try {
      const { bookId } = this.ctx.params;
      const recordChain = await this.service.book.getBookRecordChain(bookId);
      this.ctx.body = recordChain.map(({ data, timestamp }) => ({ data, timestamp }));
    } catch (error) {
      this.logger.error(error);
      this.ctx.body = {
        code: this.ctx.constant.ERROR_CODE,
        message: error.name,
        data: '',
      };
    }
  }

  async createBook() {
    try {
      const createBookKeys = ['bookName', 'intro', 'picture', 'price', 'onSell'];
      const params = _.pick(this.ctx.request.body, createBookKeys);
      params.keeperId = this.service.user.getLoginCookie();
      const chain = new this.ctx.Chain();
      chain.addBlock('创建图书');
      params.recordChain = chain.getValue();
      const record = await this.service.book.createBook(params);
      this.ctx.body = _.omit(record, ['recordChain']);
    } catch (error) {
      this.logger.error(error);
      this.ctx.body = {
        code: this.ctx.constant.ERROR_CODE,
        message: error.name,
        data: '',
      };
    }
  }

  async updateBook() {
    try {
      const { bookId } = this.ctx.params;
      const updateBookKeys = ['bookName', 'intro', 'picture', 'price', 'onSell'];
      const params = _.pick(this.ctx.request.body, updateBookKeys);
      const { recordChain, ...restInfo } = await this.service.book.getBookInfo(bookId, true);
      const loginUserId = this.service.user.getLoginCookie();
      if (loginUserId !== restInfo.keeperId) {
        this.ctx.body = {
          code: this.ctx.constant.NO_AUTH_CODE,
          message: '暂无权限',
          data: '',
        };
        return;
      }
      const diff = this.ctx.helper.diffObj(params, restInfo, ['picture']);
      if (diff) {
        const chain = new this.ctx.Chain(recordChain);
        const KEY_EXPLAIN = {
          bookName: '图书名',
          intro: '简介',
          price: '价格',
        };
        const data = Object.entries(diff).reduce((data, [key, diffInfo]) => {
          data += `${KEY_EXPLAIN[key]}: ${diffInfo};`;
          return data;
        }, '');
        chain.addBlock(data);
        params.recordChain = chain.getValue();
        const where = { id: bookId };
        await this.service.book.updateBook(params, { where });
      }
      this.ctx.body = _.omit(params, ['recordChain']);
    } catch (error) {
      this.logger.error(error);
      this.ctx.body = {
        code: this.ctx.constant.ERROR_CODE,
        message: error.name,
        data: '',
      };
    }
  }

  async buyBook() {
    try {
      const { bookId } = this.ctx.params;
      await this.service.book.buyBook(bookId);
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
