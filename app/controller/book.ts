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

  async getBookRecordChain() {
    try {
      const { bookId } = this.ctx.params;
      this.ctx.body = await this.service.book.getBookRecordChain(bookId);
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
      const createBookKeys = ['bookName', 'intro', 'picture'];
      const params = _.pick(this.ctx.request.body, createBookKeys);
      params.keeperId = this.service.user.getLoginCookie();
      const chain = new this.ctx.Chain();
      chain.addBlock('创建图书');
      params.recordChain = chain.getValue();
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
      const updateBookKeys = ['bookName', 'intro', 'picture', 'keeperId'];
      const params = _.pick(this.ctx.request.body, updateBookKeys);
      const { recordChain, ...restInfo } = await this.service.book.getBookInfo(bookId, true);
      const diff = this.ctx.helper.diffObj(params, restInfo, ['picture']);
      if (diff) {
        const chain = new this.ctx.Chain(recordChain);
        const KEY_EXPLAIN = {
          bookName: '图书名',
          intro: '简介',
          keeperId: '持有者',
        };
        let prevKeeperUsername: string;
        let curKeeperUsername: string;
        if (diff.keeperId) {
          const [prevKeeperId, curKeeperId] = diff.keeperId.split(' => ');
          const [prevKeeper, curKeeper] = await Promise.all([
            this.service.user.getUserInfo({ id: prevKeeperId }),
            this.service.user.getUserInfo({ id: curKeeperId }),
          ]);
          prevKeeperUsername = prevKeeper.username;
          curKeeperUsername = curKeeper.username;
        }
        const data = Object.entries(diff).reduce((data, [key, diffInfo]) => {
          if (key === 'keeperId') {
            data += `${KEY_EXPLAIN[key]}: ${prevKeeperUsername} => ${curKeeperUsername};`;
          } else {
            data += `${KEY_EXPLAIN[key]}: ${diffInfo};`;
          }
          return data;
        }, '');
        chain.addBlock(data);
        params.recordChain = chain.getValue();
        await this.service.book.updateBook(params, { id: bookId });
      }
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
