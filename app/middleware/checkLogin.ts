import { Context } from 'egg';
import { NEED_LOGIN_CODE } from '../constant';

export default function checkLogin(): any {
  return async (ctx: Context, next: () => Promise<any>) => {
    const userId: string = ctx.service.user.getLoginCookie();
    if (!userId) {
      ctx.body = {
        code: NEED_LOGIN_CODE,
        message: '请先登录',
        data: '',
      };
      return;
    }
    await next();
  };
}
