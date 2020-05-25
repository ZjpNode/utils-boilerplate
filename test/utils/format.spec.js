/*
 * @Author       : jiapeng.Zheng
 * @Date         : 2020-04-24 09:03:38
 * @LastEditors  : jiapeng.Zheng
 * @LastEditTime : 2020-04-28 16:10:28
 * @Description  :
 */
import assert from 'assert';
import FormatUtil from '@/utils/format';
import { TypeGuardError } from 'typescript-is';

describe('src/utils/validate', () => {
  it('TEST keepDecimal', () => {
    assert(FormatUtil.keepDecimal(10) === '10.00');
    assert(FormatUtil.keepDecimal('10') === '10.00');
    assert(FormatUtil.keepDecimal(10, 3) === '10.000');
    assert(FormatUtil.keepDecimal(10.125) === '10.13');
    assert(FormatUtil.keepDecimal(10.125, 3) === '10.125');
    assert(FormatUtil.keepDecimal(10.125, 2, false) === '10.12');
    assert(FormatUtil.keepDecimal(10.125, 2, true) === '10.13');
    assert(FormatUtil.keepDecimal(10.124, 2, false) === '10.12');
    assert(FormatUtil.keepDecimal(10.124, 2, true) === '10.12');
    assert(FormatUtil.keepDecimal(10.125, 3, false) === '10.125');
    assert(FormatUtil.keepDecimal(10.125, 3, true) === '10.125');
    assert(FormatUtil.keepDecimal(10.124, 3, false) === '10.124');
    assert(FormatUtil.keepDecimal(10.124, 3, true) === '10.124');

    assert(FormatUtil.keepDecimal('10x') === '0.00');
    assert(FormatUtil.keepDecimal() === '0.00');
    assert(FormatUtil.keepDecimal(10, '3.x') === '10.00');
  });
  it('TEST getCascaderObj', () => {
    const opt = [
      { value: '1', label: 'val1', children: [{ value: '1-1', label: 'val1-1', children: [] }] },
      { value: '2', label: 'val2', children: [{ value: '2-1', label: 'val2-1', children: [] }] },
      { value: '3', label: 'val3', children: [] },
    ];

    let r = FormatUtil.getCascaderObj(['1', '1-1'], opt);
    assert(r.length === 2);
    assert(r[0].value === '1');
    assert(r[0].label === 'val1');
    assert(r[1].value === '1-1');
    assert(r[1].label === 'val1-1');

    r = FormatUtil.getCascaderObj(['1', '2-1'], opt);
    assert(r.length === 2);
    assert(r[0].value === '1');
    assert(r[0].label === 'val1');
    assert(r[1] === undefined);

    r = FormatUtil.getCascaderObj(['4', '1-1'], opt);
    assert(r.length === 2);
    assert(r[0] === undefined);
    assert(r[1] === undefined);

    r = FormatUtil.getCascaderObj(['4', '1-1', '1-1-1'], opt);
    assert(r.length === 3);
    assert(r[0] === undefined);
    assert(r[1] === undefined);
    assert(r[2] === undefined);

    r = FormatUtil.getCascaderObj(['4'], []);
    assert(r.length === 1);
    assert(r[0] === undefined);

    r = FormatUtil.getCascaderObj([], []);
    assert(r.length === 0);

    try {
      FormatUtil.getCascaderObj([4, '1-1', '1-1-1'], opt);
    } catch (error) {
      assert(error instanceof TypeGuardError);
      assert(error.reason.type === 'string');
    }

    try {
      FormatUtil.getCascaderObj(['4', '1-1', '1-1-1'], [{ value: '3', label2: 'val3', children: [] }]);
    } catch (error) {
      assert(error instanceof TypeGuardError);
      assert(error.reason.type === 'missing-property');
      assert(error.reason.property === 'label');
    }

    try {
      FormatUtil.getCascaderObj(['4', '1-1', '1-1-1'], [{ value2: '3', label: 'val3', children: [] }]);
    } catch (error) {
      assert(error instanceof TypeGuardError);
      assert(error.reason.type === 'missing-property');
      assert(error.reason.property === 'value');
    }
  });
  it('TEST getProperty', () => {
    const obj = { 'a-1': '1', 'a-2': '2' };
    let key = 'a-1';
    assert(FormatUtil.getProperty(obj, key) === '1');
    key = 'a-2';
    assert(FormatUtil.getProperty(obj, key) === '2');
    assert(FormatUtil.getProperty(obj, 'key') === undefined);
  });
  it('TEST dateFormat', () => {
    let datetime = new Date('2020-11-12 01:12:30.009');
    assert(FormatUtil.dateFormat(datetime) === '2020-11-12');
    assert(FormatUtil.dateFormat(datetime, 'YYYY/MM/DD HH:mm:ss.S') === '2020/11/12 01:12:30.9');
    assert(FormatUtil.dateFormat(datetime, 'YYYY/MM/DD') === '2020/11/12');
    assert(FormatUtil.dateFormat(datetime, 'YYYY/MM/DD HH:mm:ss') === '2020/11/12 01:12:30');
    assert(FormatUtil.dateFormat(datetime, 'HH:mm:ss.S') === '01:12:30.9');
    datetime = new Date('2020-11-12 01:12:30.9');
    assert(FormatUtil.dateFormat(datetime, 'HH:mm:ss.S') === '01:12:30.900');
    datetime = new Date('2019-11-12 21:12:30.109');
    assert(FormatUtil.dateFormat(datetime, 'H:mm:ss.S') === '21:12:30.109');
    assert(FormatUtil.dateFormat(datetime, 'H:m:s.S') === '21:12:30.109');
    assert(FormatUtil.dateFormat(datetime, 'YYYY/MM/DD') === '2019/11/12');
    assert(FormatUtil.dateFormat(datetime, 'YYY/M/D') === '019/11/12');
    assert(FormatUtil.dateFormat(datetime, 'YY/M/D') === '19/11/12');
    assert(FormatUtil.dateFormat(datetime, 'Y/M/D') === '9/11/12');
    try {
      FormatUtil.dateFormat('2020-11-12 01:12:30.009');
    } catch (error) {
      assert(error.message === 'validation failed at date: expected a Date');
    }
  });
});
