import { Service } from 'egg';

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
      include: [
        {
          model: this.ctx.model.User,
          attributes: ['id', 'username', 'phone', 'qq', 'wechat', 'avatar'],
          as: 'user',
        },
      ],
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

  async getBookCommentInfo(bookCommentId: number|string) {
    const where = { id: bookCommentId };
    const record = await this.ctx.model.BookComment.findOne({ where });
    if (!record) return Promise.reject({ name: `id 为${bookCommentId}的评论不存在` });
    return record.get({ plain: true });
  }

  async createBookComment(record: BookCommentRecord) {
    const result = await this.ctx.model.BookComment.create(record);
    return result.get({ plain: true });
  }

  updateBookComment(record: BookCommentRecord, where: BookCommentRecord) {
    return this.ctx.model.BookComment.update(record, { where });
  }

  async processBookCommentAction(bookCommentId: string|number, action: BookCommentAction) {
    let { likeUserIdList, dislikeUserIdList } = await this.getBookCommentInfo(bookCommentId);
    const loginUserId = this.service.user.getLoginCookie();
    if (action === 'like') {
      likeUserIdList = [...new Set(likeUserIdList.concat(loginUserId))];
      dislikeUserIdList = dislikeUserIdList.filter((userId: string) => userId !== loginUserId);
    } else {
      likeUserIdList = likeUserIdList.filter((userId: string) => userId !== loginUserId);
      dislikeUserIdList = [...new Set(dislikeUserIdList.concat(loginUserId))];
    }
    await this.updateBookComment({ likeUserIdList, dislikeUserIdList }, { id: bookCommentId });
  }
}
