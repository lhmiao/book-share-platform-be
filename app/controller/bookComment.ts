import { Controller } from 'egg';
import _ from 'lodash';
import moment from 'moment';

export default class BookCommentController extends Controller {
  async getBookCommentList() {
    try {
      const { page = 1, pageSize = 10 } = this.ctx.query;
      const params = {
        page: Number(page),
        pageSize: Number(pageSize),
        ...this.ctx.params,
      };
      this.ctx.body = await this.service.bookComment.getBookCommentList(params);
    } catch (error) {
      this.logger.error(error);
      this.ctx.body = {
        code: this.ctx.constant.ERROR_CODE,
        message: error.name,
        data: '',
      };
    }
  }

  async createBookComment() {
    try {
      const { bookId } = this.ctx.params;
      const { content } = this.ctx.request.body;
      const createdAt = moment().format('YYYY-MM-DD hh:mm:ss');
      const userId = this.service.user.getLoginCookie();
      const record = {
        content,
        userId,
        bookId,
        createdAt,
        likeUserIdList: [],
        dislikeUserIdList: [],
      };
      this.ctx.body = await this.service.bookComment.createBookComment(record);
    } catch (error) {
      this.logger.error(error);
      this.ctx.body = {
        code: this.ctx.constant.ERROR_CODE,
        message: error.name,
        data: '',
      };
    }
  }

  async updateBookComment() {
    try {
      const { bookCommentId } = this.ctx.params;
      const { userId } = await this.service.bookComment.getBookCommentInfo({ id: bookCommentId });
      const loginUserId = this.service.user.getLoginCookie();
      if (userId !== loginUserId) {
        this.ctx.body = {
          code: this.ctx.constant.NO_AUTH_CODE,
          message: '暂无权限',
          data: '',
        };
        return;
      }
      const { content } = this.ctx.request.body;
      const updatedAt = moment().format('YYYY-MM-DD hh:mm:ss');
      const record = { content, updatedAt };
      const where = { id: bookCommentId };
      await this.service.bookComment.updateBookComment(record, { where });
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

  async processBookCommentAction() {
    try {
      const { bookCommentId } = this.ctx.params;
      const { action } = this.ctx.request.body;
      await this.service.bookComment.processBookCommentAction(bookCommentId, action);
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
