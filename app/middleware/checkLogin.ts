import { Context } from 'egg';

export default function checkLogin(): any {
  return async (ctx: Context, next: () => Promise<any>) => {
    const userId: number = ctx.service.user.getLoginCookie();
    if (!userId) {
      ctx.body = {
        code: ctx.constant.NEED_LOGIN_CODE,
        message: '请先登录',
        data: '',
      };
      return;
    }
    await next();
  };
}
