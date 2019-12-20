import _ from 'lodash';
import fs from 'fs';

export function diffObj(
  targetObj: object,
  originObj: object,
  ignoreKeys: string[] = [],
): object|undefined {
  const diff = {};
  Object
    .keys(targetObj)
    .forEach(key => {
      if (ignoreKeys.includes(key)) return;
      const targetValue = targetObj[key];
      const originValue = originObj[key];
      if (_.isEqual(targetValue, originValue)) return;
      diff[key] = `${originValue} => ${targetValue}`;
    });
  return _.isEqual(diff, {}) ? undefined : diff;
}

export function fsRename(oldPath: string, newPath: string): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.rename(oldPath, newPath, error => {
      error ? reject(error) : resolve();
    });
  });
}

export function fsReadFile(filePath: string): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (error, fileData) => {
      error ? reject(error) : resolve(fileData);
    });
  });
}
