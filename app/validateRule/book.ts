import { RuleObject } from './index';

export default {
  get: {
    '/api/v1/book': {
      page: {
        type: 'string',
        format: /^\d*$/,
        required: false,
      },
      pageSize: {
        type: 'string',
        format: /^\d*$/,
        required: false,
      },
      bookName: { type: 'string', required: false },
      onlyOnSell: {
        type: 'string',
        format: /^0|1$/,
        required: false,
      },
    },
    '/api/v1/book/:bookId': {
      bookId: 'id',
    },
    '/api/v1/book/:bookId/record_chain': {
      bookId: 'id',
    },
  },
  post: {
    '/api/v1/book': {
      bookName: { type: 'string', max: 50 },
      intro: 'string',
      price: { type: 'number', min: 0 },
      onSell: 'boolean',
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
      price: { type: 'number', min: 0, required: false },
      onSell: { type: 'boolean', required: false },
    },
  },
} as RuleObject;
