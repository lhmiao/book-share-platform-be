import { Context } from 'egg';
import _ from 'lodash';
import { ERROR_CODE } from '../constant';
import validateRuleObject from '../validateRule';

// 这个中间件用在 router
export default function validateParams(): any {
  return async (ctx: Context, next: () => Promise<any>) => {
    try {
      const { method, _matchedRoute } = ctx;
      const rule: object|undefined = _.get(
        validateRuleObject,
        `[${method.toLocaleLowerCase()}][${_matchedRoute}]`,
      );
      if (rule) {
        const params: object = {
          ...ctx.query,
          ...ctx.request.body,
          ...ctx.params,
        };
        ctx.validate(rule, params);
      }
      await next();
    } catch (error) {
      ctx.logger.error(error);
      ctx.body = {
        code: ERROR_CODE,
        message: '请求参数校验失败',
        data: error.errors,
      };
    }
  };
}
