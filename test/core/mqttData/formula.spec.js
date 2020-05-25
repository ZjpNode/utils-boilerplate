/*
 * @Author       : jiapeng.Zheng
 * @Date         : 2020-04-28 14:30:46
 * @LastEditors  : jiapeng.Zheng
 * @LastEditTime : 2020-04-28 16:00:05
 * @Description  :
 */
import assert from 'assert';
import Formula from '@/core/mqttData/formula';
import { TypeGuardError } from 'typescript-is';
describe('src/core/mqttData/formula', () => {
  it('TEST operation', () => {
    // (10 + 3)*4 = 52
    assert(
      Formula.operation(10, [
        [1, 3],
        [2, 4],
      ]) === 52
    );
    // (10 - 3)/4 = 1.75
    assert(
      Formula.operation(10, [
        [-1, 3],
        [-2, 4],
      ]) === 1.75
    );
    // 10 * 3 + 4 = 34
    assert(
      Formula.operation(10, [
        [2, 3],
        [1, 4],
      ]) === 34
    );
    // 10 / 3 - 4 = -0.667
    assert(
      Formula.operation(10, [
        [-2, 3],
        [-1, 4],
      ]) === -0.667
    );
    try {
      Formula.operation(10, [
        [1, 3],
        [-4, 4],
      ]);
    } catch (error) {
      assert(error instanceof TypeGuardError);
      assert(error.reason.type === 'union');
      assert(error.message === 'validation failed at rule.[1].[0]: there are no valid alternatives');
    }
  });
  it('TEST inverseOperation', () => {
    // 10 = 52 / 4 - 3
    assert(
      Formula.inverseOperation(52, [
        [1, 3],
        [2, 4],
      ]) === 10
    );
    // 10 = 1.75 * 4 + 3
    assert(
      Formula.inverseOperation(1.75, [
        [-1, 3],
        [-2, 4],
      ]) === 10
    );
    // 10 = (34 - 4) / 3
    assert(
      Formula.inverseOperation(34, [
        [2, 3],
        [1, 4],
      ]) === 10
    );
    // 9.999 = (-0.667 + 4) * 3
    assert(
      Formula.inverseOperation(-0.667, [
        [-2, 3],
        [-1, 4],
      ]) === 9.999
    );
    try {
      Formula.inverseOperation(52, [
        [4, 3],
        [1, 4],
      ]);
    } catch (error) {
      assert(error instanceof TypeGuardError);
      assert(error.reason.type === 'union');
      assert(error.message === 'validation failed at rule.[0].[0]: there are no valid alternatives');
    }
  });
  it('TEST operation and inverseOperation', () => {
    let val = 10;
    let rule = [
      [1, 3],
      [2, 4],
    ];
    assert(Formula.inverseOperation(Formula.operation(val, rule), rule) === val);
    val = 10;
    rule = [
      [-2, 3],
      [-1, 4],
    ];
    // 由于浮点数的精度丢失，故val经过两次运算无法等于原来的值
    assert(Formula.inverseOperation(Formula.operation(val, rule), rule) !== val);
  });
});
