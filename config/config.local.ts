import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};

  config.sequelize = {
    dialect: 'mysql',
    database: 'book_share_platform',
    host: '127.0.0.1',
    username: 'root',
    password: '123456',
    define: {
      freezeTableName: true,
      timestamps: false,
      underscored: false,
    },
  };

  config.security = {
    csrf: { enable: false },
  };

  return config;
};
