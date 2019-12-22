import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  config.keys = appInfo.name + '_1575555836150_5185';

  config.middleware = ['processResBody', 'checkLogin'];

  config.checkLogin = {
    ignore: [ // 以下接口不检测登录状态
      '/api/v1/user/login', // 登录
      '/api/v1/user/register', // 注册
      '/api/v1/user/security_question', // 获取安全问题
      '/api/v1/user/password', // 修改密码
      '/api/v1/user/check_login', // 检查登录
      '/book/:bookId/preview', // 获取图书预览图
      ({ method, path }) => (method.toLowerCase() === 'get' && path === '/api/v1/book'), // 获取图书列表
    ],
  };

  config.processResBody = {
    ignore: [ // 获取图书预览图片接口无需加工 body
      '/book/:bookId/preview',
    ],
  };

  config.multipart = {
    mode: 'file',
  };

  return config;
};
