import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  config.keys = appInfo.name + '_1575555836150_5185';

  config.middleware = ['processResBody', 'checkLogin'];

  config.checkLogin = {
    ignore: [ // 登录、注册、获取安全问题接口不检测登录状态
      '/api/v1/user/login',
      '/api/v1/user/register',
      '/api/v1/user/security_question',
    ],
  };

  return config;
};
