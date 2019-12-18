import { RuleObject } from './index';

export default {
  get: {
    '/api/v1/user/security_question': {
      username: { type: 'string', max: 50 },
    },
  },
  post: {
    '/api/v1/user/login': {
      username: { type: 'string', max: 50 },
      password: { type: 'string', max: 50 },
    },
    '/api/v1/user/register': {
      username: { type: 'string', max: 50 },
      password: { type: 'string', max: 50 },
      securityQuestion: { type: 'string', max: 50 },
      securityAnswer: { type: 'string', max: 50 },
      phone: { type: 'string', format: /^\d{11}$/, required: false },
      qq: { type: 'string', format: /^\d{5,20}$/, required: false },
      wechat: { type: 'string', max: 20, required: false },
    },
  },
  put: {
    '/api/v1/user/password': {
      username: { type: 'string', max: 50, required: false },
      securityAnswer: { type: 'string', max: 50 },
      password: { type: 'string', max: 50 },
    },
  },
  patch: {
    '/api/v1/user': {
      username: { type: 'string', max: 50, required: false },
      phone: { type: 'string', format: /^\d{11}$/, required: false },
      qq: { type: 'string', format: /^\d{5,20}$/, required: false },
      wechat: { type: 'string', max: 20, required: false },
    },
  },
} as RuleObject;
