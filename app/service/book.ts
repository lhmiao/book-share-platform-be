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

  async getBookInfo(bookId: string|number, needRecordChain: boolean = false) {
    const exclude: string[] = ['keeperId'];
    if (!needRecordChain) exclude.push('recordChain');
    const record = await this.ctx.model.Book.findOne({
      where: { id: bookId },
      attributes: { exclude },
      include: [{
        model: this.ctx.model.User,
        attributes: ['id', 'username', 'phone', 'qq', 'wechat', 'avatar'],
        as: 'keeper',
      }],
    });
    if (!record) return Promise.reject({ name: `id 为${bookId}的图书不存在` });
    return record.get({ plain: true });
  }

  async getBookRecordChain(bookId: string|number) {
    const record = await this.ctx.model.Book.findOne({
      where: { id: bookId },
      attributes: ['recordChain'],
    });
    if (!record) return Promise.reject({ name: `id 为${bookId}的图书不存在` });
    const { recordChain } = record.get({ plain: true });
    return recordChain;
  }

  async createBook(record: BookInfo) {
    const result = await this.ctx.model.Book.create(record);
    return result.get({ plain: true });
  }

  updateBook(record: BookInfo, where: BookInfo) {
    return this.ctx.model.Book.update(record, { where });
  }
}
