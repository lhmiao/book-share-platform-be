import { RuleObject } from './index';

export default {
  get: {
    '/api/v1/book_comment/:bookId': {
      page: {
        type: 'string',
        format: /^\d+$/,
        required: false,
      },
      pageSize: {
        type: 'string',
        format: /^\d+$/,
        required: false,
      },
      bookId: 'id',
    },
  },
  post: {
    '/api/v1/book_comment/:bookId': {
      bookId: 'id',
      content: 'string',
    },
    '/api/v1/book_comment/:bookCommentId/action': {
      bookCommentId: 'id',
      action: {
        type: 'string',
        format: /^(like|dislike)$/,
      },
    },
  },
  put: {
    '/api/v1/book_comment/:bookCommentId': {
      bookCommentId: 'id',
      content: 'string',
    },
  },
} as RuleObject;
