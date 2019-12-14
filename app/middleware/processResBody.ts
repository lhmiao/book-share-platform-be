import { Context } from 'egg';

export default function processResBody(): any {
  return async (ctx: Context, next: () => Promise<any>) => {
    await next();
    if (ctx.body === undefined) return;
    const bodyKeys: string[] = Object.keys(ctx.body);
    const needProcess: boolean = !ctx.constant.RES_BODY_KEYS.every(key => bodyKeys.includes(key));
    if (needProcess) {
      const data: string|object = ctx.body;
      ctx.body = {
        code: ctx.constant.SUCCESS_CODE,
        message: 'success',
        data,
      };
    }
  };
}
