import fs from 'fs';
import path from 'path';
import { Application } from 'egg';
import validateParams from '../middleware/validateParams';

export type RouterFileModule = (app: Application) => void;

const ROUTER_VERBS = [
  'head',
  'options',
  'get',
  'post',
  'put',
  'patch',
  'delete',
  'del',
  'resources',
];

export default (app: Application) => {
  const { router } = app;

  // 只有注册路由时的中间件才能解析到路径参数，router.use 不行
  ROUTER_VERBS.forEach(verb => {
    router[`_${verb}`] = router[verb];
    router[verb] = (path, ...args) => {
      router[`_${verb}`](path, validateParams(), ...args);
    };
  });

  const routerFilesName = fs
    .readdirSync(__dirname)
    .filter(fileName => fileName !== 'index.ts');

  routerFilesName.forEach(fileName => {
    const filePath: string = path.join(__dirname, fileName);
    (require(filePath).default as RouterFileModule)(app);
  });
};
