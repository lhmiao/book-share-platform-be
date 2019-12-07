import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  validate: {
    enable: true,
    package: 'egg-validate',
  },
  sequelize: {
    enable: true,
    package: 'egg-sequelize',
  },
};

export default plugin;
