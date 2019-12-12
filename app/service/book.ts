import { Service } from 'egg';

export interface BookInfo {
  id?: number|string;
  bookName?: string;
  intro?: string;
  pictrue?: Blob;
  recordChain?: JSON;
  keeperId?: number|string;
}

export interface GetBookListParams {
  page: number;
  pageSize: number;
  bookName?: string;
}

export default class BookService extends Service {
  async getBookList(params: GetBookListParams) {
    const { page, pageSize, bookName } = params;
    const { Op } = this.ctx.model;
    const where = {} as any;
    if (bookName) {
      where.bookName = { [Op.like]: `%${bookName}%` };
    }
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    const { rows, count } = await this.ctx.model.Book.findAndCountAll({
      where,
      attributes: { exclude: ['recordChain', 'keeperId'] },
      offset,
      limit,
    });
    const bookList = rows.map(record => record.get({ plain: true }));
    const pageInfo = {
      page,
      total: count,
      pageSize,
    };
    return { bookList, pageInfo };
  }

  async getBookInfo(bookId: string|number) {
    const record = await this.ctx.model.Book.findOne({
      where: { id: bookId },
      attributes: { exclude: ['keeperId'] },
      include: [{
        model: this.ctx.model.User,
        attributes: ['id', 'username', 'phone', 'qq', 'wechat', 'avatar'],
        as: 'keeper',
      }],
    });
    return record && record.get({ plain: true });
  }

  async createBook(record: BookInfo) {
    const result = await this.ctx.model.Book.create(record);
    return result.get({ plain: true });
  }

  updateBook(record: BookInfo, where: BookInfo) {
    return this.ctx.model.Book.update(record, { where });
  }
}
