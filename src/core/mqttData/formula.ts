/*
 * @Author       : jiapeng.Zheng
 * @Date         : 2020-04-24 13:45:56
 * @LastEditors  : jiapeng.Zheng
 * @LastEditTime : 2020-04-28 15:55:17
 * @Description  : 根据设备数据定义中的 Format 字段中的 formula 属性解析mqtt上传的数据
 */
import { FormulaOptionEnum, FormulaRule } from '@/core/mqttData/type';
import { assertType } from 'typescript-is';
/**
 * 四则运算
 * @param  val1   第一个操作数
 * @param  opt    操作符
 * @param  val2   第二个操作数
 * @returns 结果最多保留3位小数，因此会造成精度丢失
 * @example
 * ```
 * formulaRule(10, 1, 2)  // 12 -> 10 + 2
 * formulaRule(10, -1, 2) // 8 -> 10 - 2
 * formulaRule(10, 2, 2)  // 20 -> 10 * 2
 * formulaRule(10, -2, 2) // 5 -> 10 / 2
 * ```
 */
const formulaRule = (val1: number, opt: FormulaOptionEnum, val2: number): number => {
  let returnVal = val1;
  switch (opt) {
    case FormulaOptionEnum.Add:
      returnVal = val1 + val2;
      break;
    case FormulaOptionEnum.Subtract:
      returnVal = val1 - val2;
      break;
    case FormulaOptionEnum.Multiply:
      returnVal = val1 * val2;
      break;
    case FormulaOptionEnum.Divide:
      returnVal = val1 / val2;
      break;
    // default:
    //   returnVal = val1;
  }
  return Number(returnVal.toFixed(3));
};

/**
 * 对数据定义的format字段中的formula属性进行正向的四则运算运算
 * @param val   mqtt 上传的值
 * @param rule  运算规则
 * @returns 结果最多保留3位小数，因此会造成精度丢失
 * @throws 当 val 的类型不是 `number` 会抛出错误
 * @throws 当 rule 的类型不是 `Array<FormulaRule>` 会抛出错误 *
 * ```
 * operation(10, [[1, 3], [2, 4]])    // 52 -> (10 + 3)*4
 * operation(10, [[-1, 3], [-2, 4]])  // 1.75 -> (10 - 3)/4
 * operation(10, [[2, 3], [1, 4]])    // 34 -> 10 * 3 + 4
 * operation(10, [[-2, 3], [-1, 4]])  // -0.667 -> 10 / 3 - 4
 * ```
 */
const operation = (val: number, rule: Array<FormulaRule>): number => {
  assertType<Array<FormulaRule>>(rule);
  assertType<number>(val);
  let returnVal = val;
  for (const i of rule) {
    if (Array.isArray(i) && i.length === 2) {
      returnVal = formulaRule(returnVal * 1, i[0], i[1] * 1);
    }
  }
  return returnVal;
};
/**
 * 对数据定义的format字段中的formula属性进行逆向的四则运算运算
 * @param val   mqtt 上传的值
 * @param rule  运算规则
 * @returns 结果最多保留3位小数，因此会造成精度丢失
 * @throws 当 val 的类型不是 `number` 会抛出错误
 * @throws 当 rule 的类型不是 `Array<FormulaRule>` 会抛出错误
 * @example
 * ``` 
 * inverseOperation(52, [[1, 3], [2, 4]])       // 10 -> 52 / 4 - 3
 * inverseOperation(1.75, [[-1, 3], [-2, 4]])   // 10 -> 1.75 * 4 + 3 
 * inverseOperation(34, [[2, 3], [1, 4]])       // 10 -> (34 - 4) / 3
 * inverseOperation(-0.667, [[-2, 3], [-1, 4]])  // 10 -> (-0.667 + 4) * 3
 * ```
 */
const inverseOperation = (val: number, rule: Array<FormulaRule>): number => {
  assertType<Array<FormulaRule>>(rule);
  assertType<number>(val);
  let returnVal = val;
  // 通过 rule.reverse(),对 rule 进行逆向转换
  for (const i of rule.reverse()) {
    if (Array.isArray(i) && i.length === 2) {
      // i[0] * -1 即把加法转换为减法,减法转换为加法,乘法转换为除法，除法转换为乘法
      returnVal = formulaRule(returnVal * 1, i[0] * -1, i[1] * 1);
    }
  }
  return returnVal;
};

export default {
  // formulaRule,
  operation,
  inverseOperation,
};
