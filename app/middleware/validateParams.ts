import { Context } from 'egg';
import * as _ from 'lodash';
import { ERROR_CODE } from '../constant';
import validateRuleObject, { PathValidateRule } from '../validateRule';

export default function validateParams(): any {
  return async (ctx: Context, next: () => Promise<any>) => {
    try {
      const { method, path } = ctx;
      const rule: PathValidateRule|undefined = _.get(
        validateRuleObject,
        `[${method.toLocaleLowerCase()}][${path}]`,
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
