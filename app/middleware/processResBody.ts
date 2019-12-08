import { Context } from 'egg';
import { SUCCESS_CODE, RES_BODY_KEYS } from '../constant';

export default function processResBody(): any {
  return async (ctx: Context, next: () => Promise<any>) => {
    await next();
    if (ctx.body === undefined) return;
    const bodyKeys: string[] = Object.keys(ctx.body);
    const needProcess: boolean = !RES_BODY_KEYS.every(key => bodyKeys.includes(key));
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
