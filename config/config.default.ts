import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  config.keys = appInfo.name + '_1575555836150_5185';

  config.middleware = ['processResBody', 'checkLogin', 'validateParams'];

  config.checkLogin = {
    ignore: [ // 登录和注册接口不检测登录状态"
      '/api/v1/user/login',
      ({ path, method }) => (path === '/api/v1/user' && method === 'POST'),
    ],
  };

  return config;
};
