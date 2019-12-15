import { Service } from 'egg';

export interface BookInfo {
  id?: number|string;
  bookName?: string;
  intro?: string;
  pictrue?: Blob;
  recordChain?: any[];
  keeperId?: number;
  price?: number;
  onSell?: boolean;
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

  async createBook(record: BookInfo, opts: object = {}) {
    const result = await this.ctx.model.transaction(async t => {
      const loginUserId = this.service.user.getLoginCookie();

      const [result] = await Promise.all([
        this.ctx.model.Book.create(record, { ...opts, transaction: t }),
        this.service.user.updateUserCoinNumber(
          loginUserId,
          this.ctx.constant.CREATE_BOOK_CHANGE_NUMBER,
          { transaction: t },
        ),
      ]);

      return result;
    });

    return result.get({ plain: true });
  }

  updateBook(record: BookInfo, opts: object) {
    return this.ctx.model.Book.update(record, opts);
  }

  async buyBook(bookId: number|string) {
    const loginUserId = this.service.user.getLoginCookie();

    const { keeper: { id: keeperId }, recordChain, price, onSell } = await this.service.book.getBookInfo(bookId, true);
    if (!onSell) return Promise.reject({ name: '该图书未在售' });
    if (loginUserId === keeperId) return Promise.reject({ name: '买卖双方是同一人' });

    const { coinNumber, username: buyerName } = await this.service.user.getUserInfo({ id: loginUserId });
    if (coinNumber < price) return Promise.reject({ name: '图书币余额不足' });

    const { username: sellerName } = await this.service.user.getUserInfo({ id: keeperId });
    const chain = new this.ctx.Chain(recordChain);
    chain.addBlock(`${sellerName}(id ${keeperId})将书以${price}图书币的价格卖给了${buyerName}(id ${loginUserId})`);

    return this.ctx.model.transaction(t => Promise.all([
      this.service.book.updateBook(
        {
          keeperId: loginUserId,
          onSell: false,
          recordChain: chain.getValue(),
        },
        {
          where: { id: bookId },
          transaction: t,
        },
      ),
      this.service.user.updateUserCoinNumber(
        loginUserId,
        -price,
        { transaction: t },
      ),
      this.service.user.updateUserCoinNumber(
        keeperId,
        price,
        { transaction: t },
      ),
    ]));
  }
}
