/*
 * @Author       : jiapeng.Zheng
 * @Date         : 2020-04-24 09:03:54
 * @LastEditors  : jiapeng.Zheng
 * @LastEditTime : 2020-04-24 14:48:24
 * @Description  :
 */

import assert from 'assert';
import ValidateUtil from '@/utils/validate';

describe('src/utils/validate', () => {
  it('TEST isJsonString', () => {
    assert(ValidateUtil.isJsonString('{"a":"123"}') === true);
    assert(ValidateUtil.isJsonString('["1"]') === true);
    assert(ValidateUtil.isJsonString('[1]') === true);
    assert(ValidateUtil.isJsonString('[]') === true);
    assert(ValidateUtil.isJsonString('{}') === true);
    assert(ValidateUtil.isJsonString('{a:"123"}') === false);
    assert(ValidateUtil.isJsonString("{'a':'123'}") === false);
    assert(ValidateUtil.isJsonString('null') === false);
    assert(ValidateUtil.isJsonString('"1"') === false);
    assert(ValidateUtil.isJsonString("'true'") === false);
    assert(ValidateUtil.isJsonString(true) === false);
    assert(ValidateUtil.isJsonString({ a: '123' }) === false);
    assert(ValidateUtil.isJsonString({}) === false);
    assert(ValidateUtil.isJsonString([]) === false);
    assert(ValidateUtil.isJsonString(['1']) === false);
    assert(ValidateUtil.isJsonString([1]) === false);
  });
});
