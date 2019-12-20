import SHA256 from 'crypto-js/sha256';
import ms from 'ms';

// 记录链节点
interface ChainBlock {
  prevHash: string;
  timestamp: number;
  data: string;
  hash: string;
}

// 记录链类
export class Chain {
  constructor(recordChain?: ChainBlock[]) {
    if (recordChain) {
      this.recordChain = recordChain;
    }
  }

  private recordChain: ChainBlock[] = [];

  addBlock(data: string) {
    let prevHash: string = '';
    const prevBlock = this.getLastBlock();
    if (prevBlock) prevHash = prevBlock.hash;
    const timestamp = Date.now();
    const hash = this.calculateHash(prevHash, timestamp, data);
    this.recordChain.push({ prevHash, timestamp, data, hash });
  }

  calculateHash(prevHash: string, timestamp: number, data: string): string {
    return SHA256(`${prevHash}${timestamp}${data}`).toString();
  }

  getLastBlock(): ChainBlock|undefined {
    const { length } = this.recordChain;
    if (length) return this.recordChain[length - 1];
    return undefined;
  }

  getValue(): ChainBlock[] {
    return this.recordChain;
  }
}

export const constant = {
  SUCCESS_CODE: 0, // 成功响应代码
  ERROR_CODE: 1, // 失败响应代码
  NEED_LOGIN_CODE: 2, // 未登录响应代码
  NO_AUTH_CODE: 3, // 暂无权限响应代码
  RES_BODY_KEYS: ['code', 'message', 'data'], // response body 结构的 key
  LOGIN_COOKIE_MAX_AGE: ms('7d'), // 登录 cookie 有效期
  CREATE_BOOK_BUSINESS_CHANGE_NUMBER: 5, // 完成交易奖励的图书币数额
  CREATE_BOOK_COMMENT_CHANGE_NUMBER: 3, // 第一次评论某个图书奖励的图书币数额
  CREATE_BOOK_COMMENT_ACTION_CHANGE_NUMBER: 1, // 评价某个评论奖励的图书币数额
  // 图书预览图片上传路径
  BOOK_PREVIEW_FILE_PATH: '/Users/lhm/Documents/project/book-share-file-service/book-preview',
  // 用户头像上传路径
  USER_AVATAR_FILE_PATH: '/Users/lhm/Documents/project/book-share-file-service/user-avatar',
};
