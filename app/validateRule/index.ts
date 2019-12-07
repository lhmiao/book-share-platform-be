import * as fs from 'fs';
import * as path from 'path';

export interface PathValidateRule {
  [path: string]: string|object;
}

export interface RuleObject {
  get?: PathValidateRule;
  post?: PathValidateRule;
  put?: PathValidateRule;
  patch?: PathValidateRule;
  delete?: PathValidateRule;
}

const ruleFilesName: string[] = fs
  .readdirSync(__dirname)
  .filter(fileName => fileName !== 'index.ts');

const ruleObject: RuleObject = {
  get: {},
  post: {},
  put: {},
  patch: {},
  delete: {},
};

ruleFilesName.forEach(fileName => {
  const filePath: string = path.join(__dirname, fileName);
  const fileModule: RuleObject = require(filePath).default as RuleObject;
  Object.entries(fileModule).forEach(([method, pathRule]) => {
    Object.assign(ruleObject[method], pathRule);
  });
});

export default ruleObject;
