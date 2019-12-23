import { Service } from 'egg';
import _ from 'lodash';

export interface BookCommentRecord {
  id?: number|string;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: number|string;
  bookId?: number|string;
  likeUserIdList?: string[];
  dislikeUserIdList?: string[];
}

export interface GetBookCommentListParams {
  page: number;
  pageSize: number;
  bookId: number|string;
}

export type BookCommentAction = 'like'|'dislike';

export default class BookCommentService extends Service {
  async getBookCommentList(params: GetBookCommentListParams) {
    const { page, pageSize, bookId } = params;
    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    const { rows, count } = await this.ctx.model.BookComment.findAndCountAll({
      where: { bookId },
      attributes: { exclude: ['userId', 'bookId'] },
      offset,
      limit,
      include: [{
        model: this.ctx.model.User,
        attributes: ['id', 'username', 'phone', 'qq', 'wechat', 'avatar'],
        as: 'commentUser',
      }],
    });

    const loginUserId = this.service.user.getLoginCookie();
    const bookCommentList = rows.map(record => {
      const { likeUserIdList, dislikeUserIdList, ...rest } = record.get({ plain: true });
      const likeUserNumber = likeUserIdList.length;
      const dislikeUserNumber = dislikeUserIdList.length;
      const isLoginUserLike = likeUserIdList.includes(loginUserId);
      const isLoginUserDislike = dislikeUserIdList.includes(loginUserId);
      let loginUserAction: string|undefined;
      if (isLoginUserLike || isLoginUserDislike) {
        loginUserAction = isLoginUserLike ? 'like' : 'dislike';
      }
      return {
        likeUserNumber,
        dislikeUserNumber,
        loginUserAction,
        ...rest,
      };
    });

    const pageInfo = {
      page,
      total: count,
      pageSize,
    };

    return { bookCommentList, pageInfo };
  }

  async getBookCommentInfo(where: object) {
    const record = await this.ctx.model.BookComment.findOne({ where });
    if (!record) return Promise.reject({ name: '该评论不存在' });
    return record.get({ plain: true });
  }

  async createBookComment(record: BookCommentRecord, opts: object = {}) {
    let isFirstCommentThisBook: boolean;
    try {
      const where = _.pick(record, ['bookId', 'userId']);
      await this.getBookCommentInfo(where);
      isFirstCommentThisBook = false;
    } catch (error) {
      isFirstCommentThisBook = true;
    }
    const result = await this.ctx.model.transaction(async t => {
      const result = await this.ctx.model.BookComment.create(record, { ...opts, transaction: t });
      if (isFirstCommentThisBook) {
        const loginUserId = this.service.user.getLoginCookie();
        await this.service.user.updateUserCoinNumber(
          loginUserId,
          this.ctx.constant.CREATE_BOOK_COMMENT_CHANGE_NUMBER,
          { transaction: t },
        );
      }
      return result;
    });
    return result.get({ plain: true });
  }

  updateBookComment(record: BookCommentRecord, opts: object) {
    return this.ctx.model.BookComment.update(record, opts);
  }

  async processBookCommentAction(bookCommentId: string|number, action: BookCommentAction) {
    let { likeUserIdList, dislikeUserIdList, userId } = await this.getBookCommentInfo({ id: bookCommentId });
    const loginUserId = this.service.user.getLoginCookie();
    let isFirstCommentAction: boolean = true;
    if (likeUserIdList.includes(loginUserId) || dislikeUserIdList.includes(loginUserId)) {
      isFirstCommentAction = false;
    }
    if (action === 'like') {
      likeUserIdList = [...new Set(likeUserIdList.concat(loginUserId))];
      dislikeUserIdList = dislikeUserIdList.filter((userId: number) => userId !== loginUserId);
    } else {
      likeUserIdList = likeUserIdList.filter((userId: number) => userId !== loginUserId);
      dislikeUserIdList = [...new Set(dislikeUserIdList.concat(loginUserId))];
    }
    const where = { id: bookCommentId };
    return this.ctx.model.transaction(async t => {
      await this.updateBookComment({ likeUserIdList, dislikeUserIdList }, { where, transaction: t });
      // 自己评价自己的评论、已评价过，不增加图书币
      if (userId === loginUserId || !isFirstCommentAction) return;
      // 给作出评价的人增加图书币
      await this.service.user.updateUserCoinNumber(
        loginUserId,
        this.ctx.constant.CREATE_BOOK_COMMENT_ACTION_CHANGE_NUMBER,
        { transaction: t },
      );
      // 如果是点赞，给发布评论的人增加图书币
      if (action === 'like') {
        await this.service.user.updateUserCoinNumber(
          userId,
          this.ctx.constant.CREATE_BOOK_COMMENT_ACTION_CHANGE_NUMBER,
          { transaction: t },
        );
      }
    });
  }
}
