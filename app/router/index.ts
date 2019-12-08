import fs from 'fs';
import path from 'path';
import { Application } from 'egg';

export type RouterFileModule = (app: Application) => void;

export default (app: Application) => {
  const routerFilesName = fs
    .readdirSync(__dirname)
    .filter(fileName => fileName !== 'index.ts');

  routerFilesName.forEach(fileName => {
    const filePath: string = path.join(__dirname, fileName);
    (require(filePath).default as RouterFileModule)(app);
  });
};
