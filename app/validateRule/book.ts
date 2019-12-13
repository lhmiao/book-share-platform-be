import { RuleObject } from './index';

export default {
  get: {
    '/api/v1/book': {
      page: {
        type: 'string',
        format: /^[1-9]\d*$/,
        required: false,
      },
      pageSize: {
        type: 'string',
        format: /^[1-9]\d*$/,
        required: false,
      },
    },
    '/api/v1/book/:bookId': {
      bookId: 'id',
    },
  },
  post: {
    '/api/v1/book': {
      bookName: { type: 'string', max: 50 },
      intro: 'string',
    },
  },
  put: {
    '/api/v1/book/:bookId': {
      bookName: {
        type: 'string',
        max: 50,
        required: false,
      },
      intro: { type: 'string', required: false },
      keeperId: { type: 'number', required: false },
    },
  },
} as RuleObject;