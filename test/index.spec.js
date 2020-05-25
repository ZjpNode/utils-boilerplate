/*
 * @Author       : jiapeng.Zheng
 * @Date         : 2020-04-17 15:57:49
 * @LastEditors  : jiapeng.Zheng
 * @LastEditTime : 2020-04-24 12:15:04
 * @Description  :
 */
import assert from 'assert';
import HxCore from '../src';

describe('src/index', () => {

  it('TEST CoreConst', () => {
    assert(HxCore.CoreConst.DataTypeEnum.DATA_TYPE_BOOLEAN === 'boolean');
    assert(HxCore.CoreConst.DataTypeEnum.DATA_TYPE_BOOLEAN2 === 'boolean2');
    assert(HxCore.CoreConst.DataTypeEnum.DATA_TYPE_STRING === 'string');
    assert(HxCore.CoreConst.DataTypeEnum.DATA_TYPE_ENUM === 'enum');
    assert(HxCore.CoreConst.DataTypeEnum.DATA_TYPE_MONITOR === 'monitor');
    assert(HxCore.CoreConst.DataTypeEnum.DATA_TYPE_DATETIME === 'time');
    assert(HxCore.CoreConst.DataTypeEnum.DATA_TYPE_SELECT === 'select');

    assert(HxCore.CoreConst.FilterTypeEnum.STAT_FILTER_NO === 0);
    assert(HxCore.CoreConst.FilterTypeEnum.STAT_FILTER_MAX_MIN === 1);
    assert(HxCore.CoreConst.FilterTypeEnum.STAT_FILTER_OTHER === 2);

    assert(HxCore.CoreConst.ShowLevelEnum.STAT_SHOW_LEVEL_DEVICE === 0);
    assert(HxCore.CoreConst.ShowLevelEnum.STAT_SHOW_LEVEL_STATION === 1);
    assert(HxCore.CoreConst.ShowLevelEnum.STAT_SHOW_LEVEL_PROJECT === 2);
    assert(HxCore.CoreConst.ShowLevelEnum.STAT_SHOW_LEVEL_ALL === 3);
  });

  it('TEST MqttData', () => {
    assert(typeof HxCore.MqttData._format === 'function');
    assert(typeof HxCore.MqttData.showFormat === 'function');
    assert(typeof HxCore.MqttData.outFormat === 'function');
    assert(typeof HxCore.MqttData.inFormat === 'function');
    assert(typeof HxCore.MqttData.unitFormat === 'function');
    assert(typeof HxCore.MqttData.getBaseUnit === 'function');
    assert(typeof HxCore.MqttData.booleanOutFormat === 'function');
    assert(typeof HxCore.MqttData.booleanInFormat === 'function');
    assert(typeof HxCore.MqttData.booleanShowFormat === 'function');
    assert(typeof HxCore.MqttData.boolean2OutFormat === 'function');
    assert(typeof HxCore.MqttData.boolean2InFormat === 'function');
    assert(typeof HxCore.MqttData.boolean2ShowFormat === 'function');
    assert(typeof HxCore.MqttData.stringOutFormat === 'function');
    assert(typeof HxCore.MqttData.stringInFormat === 'function');
    assert(typeof HxCore.MqttData.stringShowFormat === 'function');
    assert(typeof HxCore.MqttData.selectInFormat === 'function');
    assert(typeof HxCore.MqttData.selectShowFormat === 'function');
    assert(typeof HxCore.MqttData.timeOutFormat === 'function');
    assert(typeof HxCore.MqttData.timeInFormat === 'function');
    assert(typeof HxCore.MqttData.timeShowFormat === 'function');
    assert(typeof HxCore.MqttData.enumOutFormat === 'function');
    assert(typeof HxCore.MqttData.enumInFormat === 'function');
    assert(typeof HxCore.MqttData.enumShowFormat === 'function');
    assert(typeof HxCore.MqttData.monitorOutFormat === 'function');
    assert(typeof HxCore.MqttData.monitorInFormat === 'function');
    assert(typeof HxCore.MqttData.monitorShowFormat === 'function');
  });

  it('TEST Statistics', () => {
    assert(typeof HxCore.Statistics.DataFormat === 'function');
  });
});
