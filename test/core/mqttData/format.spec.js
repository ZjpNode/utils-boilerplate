/*
 * @Author       : jiapeng.Zheng
 * @Date         : 2020-05-06 11:11:28
 * @LastEditors  : jiapeng.Zheng
 * @LastEditTime : 2020-05-07 17:18:41
 * @Description  :
 */
import assert from 'assert';
import MqttData from '@/core/mqttData/index';
describe('src/core/mqttData/index BooleanFormat', () => {
  it('TEST booleanInFormat', () => {
    assert(MqttData.booleanInFormat(0, { 0: '0', 1: '1' }) === '0');
    assert(MqttData.booleanInFormat(1, { 0: '0', 1: '1' }) === '1');
    assert(MqttData.booleanInFormat(0, { 0: 0, 1: 1 }) === 0);
    assert(MqttData.booleanInFormat(1, { 0: 0, 1: 1 }) === 1);
    assert(MqttData.booleanInFormat(0, { 0: '1', 1: '2' }) === '1');
    assert(MqttData.booleanInFormat(1, { 0: '1', 1: '2' }) === '2');
    assert(MqttData.booleanInFormat(3, { 0: '1', 1: '2' }) === 3);
    assert(MqttData.booleanInFormat(undefined, { 0: '0', 1: '1' }) === '0');
    assert(MqttData.booleanInFormat(undefined, { 0: '1', 1: '2' }) === '1');
  });
  it('TEST booleanOutFormat', () => {
    assert(MqttData.booleanOutFormat(0, { 0: '0', 1: '1' }) === '0');
    assert(MqttData.booleanOutFormat(1, { 0: '0', 1: '1' }) === '1');
    assert(MqttData.booleanOutFormat(1, { 0: '1', 1: '2' }) === '0');
    assert(MqttData.booleanOutFormat(2, { 0: '1', 1: '2' }) === '1');
    assert(MqttData.booleanOutFormat(3, { 0: '1', 1: '2' }) === 3);
    assert(MqttData.booleanOutFormat(undefined, { 0: '1', 1: '2' }) === 0);
  });
  it('TEST booleanShowFormat', () => {
    assert(MqttData.booleanShowFormat(0, { 0: '0', 1: '1' }) === '关');
    assert(MqttData.booleanShowFormat(1, { 0: '0', 1: '1' }) === '开');
    assert(MqttData.booleanShowFormat(1, { 0: '1', 1: '2' }) === '关');
    assert(MqttData.booleanShowFormat(2, { 0: '1', 1: '2' }) === '开');
    assert(MqttData.booleanShowFormat(3, { 0: '1', 1: '2' }) === undefined);
    assert(MqttData.booleanShowFormat(undefined, { 0: '1', 1: '2' }) === '关');
    const dict = { 0: '关闭', 1: '开启' };
    assert(MqttData.booleanShowFormat(0, { 0: '0', 1: '1' }, dict) === '关闭');
    assert(MqttData.booleanShowFormat(1, { 0: '0', 1: '1' }, dict) === '开启');
    assert(MqttData.booleanShowFormat(1, { 0: '1', 1: '2' }, dict) === '关闭');
    assert(MqttData.booleanShowFormat(2, { 0: '1', 1: '2' }, dict) === '开启');
    assert(MqttData.booleanShowFormat(3, { 0: '1', 1: '2' }, dict) === undefined);
    assert(MqttData.booleanShowFormat(undefined, { 0: '1', 1: '2' }, dict) === '关闭');
  });
});
describe('src/core/mqttData/index StringFormat', () => {
  it('TEST stringInFormat', () => {
    assert(MqttData.stringInFormat(10, { step: 10 }) === 10 * 10);
    assert(
      MqttData.stringInFormat(10, {
        formula: [
          [1, 3],
          [2, 4],
        ],
      }) ===
        (10 + 3) * 4
    );
    assert(MqttData.stringInFormat(10, {}) === 10);
    assert(MqttData.stringInFormat(undefined, {}) === 0);
  });
  it('TEST stringOutFormat', () => {
    assert(MqttData.stringOutFormat(100, { step: 10 }) === 100 / 10);
    assert(
      MqttData.stringOutFormat(52, {
        formula: [
          [1, 3],
          [2, 4],
        ],
      }) ===
        52 / 4 - 3
    );
    assert(MqttData.stringOutFormat(100, {}) === 100);
    assert(MqttData.stringOutFormat(undefined, {}) === 0);
  });
  it('TEST stringShowFormat', () => {
    assert(MqttData.stringShowFormat === MqttData.stringOutFormat);
  });
});
describe('src/core/mqttData/index TimeFormat', () => {
  it('TEST timeInFormat', () => {
    const date = new Date('2019-12-12 15:49:30');
    assert(MqttData.timeInFormat(date) === '15:49:30');
    assert(MqttData.timeInFormat(date, {}) === '15:49:30');
    assert(MqttData.timeInFormat(date, { farmat: 'YYYY/MM/DD HH:mm:ss' }) === '2019/12/12 15:49:30');
  });
  it('TEST timeOutFormat', () => {
    const date = MqttData.timeOutFormat('15:49:30');
    assert(date.getHours() === 15);
    assert(date.getMinutes() === 49);
    assert(date.getSeconds() === 30);
    assert(MqttData.timeOutFormat('15:49:100') === undefined);
  });
  it('TEST timeShowFormat', () => {
    assert(MqttData.timeShowFormat('15:49:30') === '15:49:30');
    assert(MqttData.timeShowFormat() === undefined);
  });
});
describe('src/core/mqttData/index SelectFormat', () => {
  it('TEST selectInFormat', () => {
    assert(MqttData.selectInFormat === MqttData.selectOutFormat);
  });
  it('TEST selectOutFormat', () => {
    assert(MqttData.selectOutFormat() === '');
    assert(MqttData.selectOutFormat(1) === 1);
    assert(MqttData.selectOutFormat('1') === '1');
  });
  it('TEST selectShowFormat', () => {
    const format = {
      options: [
        { name: '开', value: '1' },
        { name: '关', value: '0' },
      ],
    };
    assert(MqttData.selectShowFormat('0', format) === '关');
    assert(MqttData.selectShowFormat('1', format) === '开');
    assert(MqttData.selectShowFormat('2', format) === '2');
    assert(MqttData.selectShowFormat(0, format) === 0);
    assert(MqttData.selectShowFormat(1, format) === 1);
    assert(MqttData.selectShowFormat(2, format) === 2);
    assert(MqttData.selectShowFormat(undefined, format) === '');
  });
});
describe('src/core/mqttData/index EnumFormat', () => {
  it('TEST enumOutFormat', () => {
    assert(MqttData.enumOutFormat(0) === 0);
    assert(MqttData.enumOutFormat('0') === '0');
    assert(MqttData.enumOutFormat(1) === 1);
    assert(MqttData.enumOutFormat('1') === '1');
  });
  it('TEST enumInFormat', () => {
    assert(MqttData.enumInFormat === MqttData.enumOutFormat);
  });
  it('TEST enumShowFormat', () => {
    const formatObj = { '0': '低水位', '1': '中水位', '2': '高水位' };
    assert(MqttData.enumShowFormat(0, formatObj) === '低水位');
    assert(MqttData.enumShowFormat(1, formatObj) === '中水位');
    assert(MqttData.enumShowFormat(2, formatObj) === '高水位');
    assert(MqttData.enumShowFormat(3, formatObj) === 3);
    assert(MqttData.enumShowFormat(undefined, formatObj) === '');
  });
});
describe('src/core/mqttData/index MontiorFormat', () => {
  it('TEST monitorInFormat', () => {
    assert(MqttData.monitorInFormat === MqttData.stringInFormat);
  });
  it('TEST monitorOutFormat', () => {
    assert(MqttData.monitorOutFormat === MqttData.stringOutFormat);
  });
  it('TEST monitorShowFormat', () => {
    assert(MqttData.monitorShowFormat === MqttData.stringShowFormat);
  });
});
describe('src/core/mqttData/index Format', () => {
  it('TEST _format', () => {
    assert(Object.keys(MqttData._format()).length === 0);
    const formatObj = MqttData._format('{"options":[{"name":"开","value":"1"},{"name":"关","value":"0"}]}');
    assert(formatObj.options.length === 2);
    assert(formatObj.options[0].name === '开');
    assert(formatObj.options[0].value === '1');
    assert(formatObj.options[1].name === '关');
    assert(formatObj.options[1].value === '0');
  });
  it('TEST inFormat', () => {
    assert(MqttData.inFormat({ DataType: 'string', Format: '{"step":10}' }, 10) === 100);
    assert(MqttData.inFormat({ DataType: 'boolean', Format: '{ "0": "1", "1": "2" }' }, 0) === '1');
    assert(MqttData.inFormat({ DataType: 'boolean', Format: '{ "0": "1", "1": "2" }' }, 1) === '2');
    const date = new Date('2019-12-12 15:49:30');
    assert(MqttData.inFormat({ DataType: 'time' }, date) === '15:49:30');
    assert(MqttData.inFormat({ DataType: 'time', Format: '{ "farmat": "YYYY/MM/DD HH:mm:ss" }' }, date) === '2019/12/12 15:49:30');
    assert(MqttData.inFormat({ DataType: 'select' }, '1') === '1');
    assert(MqttData.inFormat({ DataType: 'select' }, 1) === 1);
    assert(MqttData.inFormat({ DataType: 'enum' }, '1') === '1');
    assert(MqttData.inFormat({ DataType: 'enum' }, 1) === 1);
    assert(MqttData.inFormat({ DataType: 'monitor', Format: '{"step":10}' }, 10) === 100);
  });
  it('TEST showFormat', () => {
    assert(MqttData.showFormat({ DataType: 'string', Format: '{"step":10}', Unit: '["Flow","m3"]' }, 100) === '10m³');
    assert(MqttData.showFormat({ DataType: 'boolean', Format: '{ "0": "1", "1": "2" }' }, '1') === '关');
    assert(MqttData.showFormat({ DataType: 'boolean', Format: '{ "0": "1", "1": "2" }', Unit: '["Flow","m3"]' }, '1') === '关m³');
    assert(MqttData.showFormat({ DataType: 'boolean', Format: '{ "0": "1", "1": "2" }' }, '2') === '开');
    assert(MqttData.showFormat({ DataType: 'boolean', Format: '{ "0": "1", "1": "2" }', Unit: '["Flow","m3"]' }, '2') === '开m³');
    assert(MqttData.showFormat({ DataType: 'time' }, '15:49:30') === '15:49:30');
    assert(MqttData.showFormat({ DataType: 'time', Unit: '["Flow","m3"]' }, '15:49:30') === '15:49:30m³');
    assert(MqttData.showFormat({ DataType: 'time', Format: '{ "farmat": "YYYY/MM/DD HH:mm:ss" }' }, '15:49:30') === '15:49:30');
    assert(MqttData.showFormat({ DataType: 'time', Format: '{ "farmat": "YYYY/MM/DD HH:mm:ss" }', Unit: '["Flow","m3"]' }, '15:49:30') === '15:49:30m³');
    assert(MqttData.showFormat({ DataType: 'select', Format: '{"options":[{"name":"开","value":"1"},{"name":"关","value":"0"}]}' }, '1') === '开');
    assert(MqttData.showFormat({ DataType: 'select', Format: '{"options":[{"name":"开","value":"1"},{"name":"关","value":"0"}]}' }, '0') === '关');
    assert(MqttData.showFormat({ DataType: 'select', Format: '{"options":[{"name":"开","value":"1"},{"name":"关","value":"0"}]}' }, 1) === '1');
    assert(MqttData.showFormat({ DataType: 'select', Format: '{"options":[{"name":"开","value":"1"},{"name":"关","value":"0"}]}' }, 0) === '0');
    assert(MqttData.showFormat({ DataType: 'enum', Format: '{ "0": "低水位", "1": "高水位" }' }, '0') === '低水位');
    assert(MqttData.showFormat({ DataType: 'enum', Format: '{ "0": "低水位", "1": "高水位" }' }, '1') === '高水位');
    assert(MqttData.showFormat({ DataType: 'enum', Format: '{ "0": "低水位", "1": "高水位" }' }, 0) === '低水位');
    assert(MqttData.showFormat({ DataType: 'enum', Format: '{ "0": "低水位", "1": "高水位" }' }, 1) === '高水位');
    assert(MqttData.showFormat({ DataType: 'monitor', Format: '{"step":10}', Unit: '["Flow","m3"]' }, 100) === '10m³');
  });
  it('TEST outFormat', () => {
    assert(MqttData.outFormat({ DataType: 'string', Format: '{"step":10}' }, 100) === 10);
    assert(MqttData.outFormat({ DataType: 'boolean', Format: '{ "0": "1", "1": "2" }' }, '1') === '0');
    assert(MqttData.outFormat({ DataType: 'boolean', Format: '{ "0": "1", "1": "2" }' }, '2') === '1');
    const date = MqttData.outFormat({ DataType: 'time' }, '15:49:30');
    assert(date.getHours(15));
    assert(date.getMinutes(49));
    assert(date.getSeconds(30));
    assert(MqttData.outFormat({ DataType: 'select' }, '1') === '1');
    assert(MqttData.outFormat({ DataType: 'select' }, 1) === 1);
    assert(MqttData.outFormat({ DataType: 'enum' }, '1') === '1');
    assert(MqttData.outFormat({ DataType: 'enum' }, 1) === 1);
    assert(MqttData.outFormat({ DataType: 'monitor', Format: '{"step":10}' }, 100) === 10);
  });
});
