import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  config.keys = appInfo.name + '_1575555836150_5185';

  config.middleware = ['processResBody', 'checkLogin'];

  config.checkLogin = {
    ignore: [ // 登录、注册、获取安全问题、修改密码、检查登录接口不检测登录状态
      '/api/v1/user/login',
      '/api/v1/user/register',
      '/api/v1/user/security_question',
      '/api/v1/user/password',
      '/api/v1/user/check_login',
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
