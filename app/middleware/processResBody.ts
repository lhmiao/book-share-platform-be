import { Context } from 'egg';
import { SUCCESS_CODE, RES_BODY_KEYS } from '../constant';

export default function processResBody(): any {
  return async (ctx: Context, next: () => Promise<any>) => {
    await next();
    if (ctx.body === undefined) return;
    const needProcess: boolean = !Object
      .keys(ctx.body)
      .every(key => RES_BODY_KEYS.includes(key));
    if (needProcess) {
      const data: string|object = ctx.body;
      ctx.body = {
        code: SUCCESS_CODE,
        message: 'success',
        data,
      };
    }
  };
}
