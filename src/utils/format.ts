/*
 * @Author       : jiapeng.Zheng
 * @Date         : 2020-04-20 10:56:51
 * @LastEditors  : jiapeng.Zheng
 * @LastEditTime : 2020-05-07 14:27:19
 * @Description  : 校验工具
 */
import { assertType } from 'typescript-is';
import { UnitObj } from '@/core/mqttData/type';
/**
 * 保留N位小数
 * @param  num       要进行处理的数字
 * @param  digits    保留几位小数，默认 `2`
 * @param  isRound   是否四舍五入，默认 `true`
 * @example
 * ```
 * keepDecimal(10) // -> '10.00'
 * keepDecimal(10.125) // -> '10.13'
 * ```
 */
function keepDecimal(num = 0, digits = 2, isRound = true): string {
  num = isNaN(Number(num)) ? 0 : Number(num);
  digits = isNaN(Number(digits)) ? 2 : Number(digits);
  isRound = Boolean(isRound);

  const digitsStep = Math.pow(10, digits);
  const result = isRound ? Math.round(num * digitsStep) / digitsStep : Math.floor(num * digitsStep) / digitsStep;
  let resultStr = result.toString();
  let posDecimal = resultStr.indexOf('.');
  if (posDecimal < 0 && digits) {
    posDecimal = resultStr.length;
    resultStr += '.';
  }
  while (resultStr.length <= posDecimal + digits) {
    resultStr += '0';
  }
  return resultStr;
}
/**
 * 从 opt 数组中递归获取所有 opt[n].children[n+1]?.value === val[n+1] 的对象构成的数组
 * @param  val  由opt的value的值构成的数组
 * @param  opt  要递归的数组
 * @throws 当 val 的类型不是 `Array<string>` 会抛出错误
 * @throws 当 opt 的类型不是 `Array<UnitObj>` 会抛出错误
 * @example
 * ```
 * let opt = [
      { value: '1', label: 'val1', children: [{ value: '1-1', label: 'val1-1', children: [] }] },
      { value: '2', label: 'val2', children: [{ value: '2-1', label: 'val2-1', children: [] }] },
      { value: '3', label: 'val3', children: [] },
    ]
 * getCascaderObj(['1', '1-1'], opt) // -> [{ value: '1', label: 'val1', children: [{ value: '1-1', label: 'val1-1', children: [] }] },{ value: '1-1', label: 'val1-1', children: [] }]
 * getCascaderObj(['1', '2-1'], opt) // -> [{ value: '1', label: 'val1', children: [{ value: '1-1', label: 'val1-1', children: [] }] }, undefined]
 * getCascaderObj(['4', '1-1'], opt) // -> [undefined, undefined]
 * getCascaderObj(['4', '1-1','1-1-1'], opt) // -> [undefined, undefined, undefined]
 * ```
 */
function getCascaderObj(val: Array<string>, opt: Array<UnitObj>): (UnitObj | undefined)[] {
  assertType<Array<string>>(val);
  assertType<Array<UnitObj>>(opt);
  return val.map(function (value) {
    for (const itm of opt) {
      if (itm.value === value) {
        opt = itm.children || [];
        return itm;
      }
    }
  });
}

/**
 * 从 `obj` 中动态获取属性为 `key` 的值
 * @param obj 被获取的对象
 * @param key 要获取的属性
 * @example
 * ```javascript
 * getProperty({"a-1":"1","a-2":2},"a-1") // -> "1"
 * getProperty({"a-1":"1","a-2":2},"a-2") // -> 2
 * ```
 * ```typescript
 * getProperty<string>({"a-1":"1","a-2":"2"},"a-1") // -> "1"
 * getProperty<string>({"a-1":"1","a-2":2},"a") // -> The expected type comes from this index signature.
 * ```
 */
function getProperty<T>(obj: { [propName: string]: T }, key: string | number): T {
  return obj[key];
}

/**
 * 时间格式化
 * @param date 要格式化的时间，类型为`Date`
 * @param fmt 时间格式，默认为`YYYY-MM-DD`
 * @throws 当 date 的类型不是 `Date` 会抛出错误
 * @example
 * ```
 * let date = new Date('2020-11-12 01:12:30.009')
 * dateFormat(date) // -> '2020-11-12'
 * dateFormat(date,"YYYY/MM/DD HH:mm:ss.S") // -> '2020/11/12 01:12:30.9'
 * date = new Date('2020-11-12 01:12:30.9')
 * dateFormat(date,"YYYY/MM/DD HH:mm:ss.S") // -> '2020/11/12 01:12:30.900'
 * ```
 */
function dateFormat(date: Date, fmt = 'YYYY-MM-DD'): string {
  if (!(date instanceof Date)) {
    throw new Error('validation failed at date: expected a Date');
  }

  const o: { [index: string]: number } = {
    'M+': date.getMonth() + 1, //月份
    'D+': date.getDate(), //日
    'H+': date.getHours(), //小时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    //'q+': Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds(), //毫秒
  };
  if (/(Y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? String(o[k]) : ('00' + o[k]).substr(('' + o[k]).length));
    }
  }
  return fmt;
}
export default {
  keepDecimal,
  getCascaderObj,
  getProperty,
  dateFormat,
};
