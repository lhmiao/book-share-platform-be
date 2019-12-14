import _ from 'lodash';

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
