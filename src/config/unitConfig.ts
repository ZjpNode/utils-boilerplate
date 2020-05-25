/*
 * @Author       : jiapeng.Zheng
 * @Date         : 2020-04-20 14:17:38
 * @LastEditors  : jiapeng.Zheng
 * @LastEditTime : 2020-04-28 17:26:34
 * @Description  :
 */

import { UnitObj } from '@/core/mqttData/type';
/**
 * 频率类型的单位，不能更改该字段的值
 */
export const UNIT_FREQ = 'frequency';
/**
 * 时间类型的单位，不能更改该字段的值
 */
export const UNIT_TIME = 'Time';
export const UNIT_TIME_S = 's'; // 秒，不能更改该字段的值
/**
 * 数据定义单位配置：
 * @description  不能更改该字段的 value 属性，数据库中以 value 作为单位标识
 * @description  只能更改 label 的值或者添加新的单位；
 */
export const DATA_TYPE_UNIT_CONFIG: Array<UnitObj> = [
  { label: '', value: '-', format: { step: 1 } },
  {
    label: '时间',
    value: UNIT_TIME,
    children: [
      { label: '秒', value: UNIT_TIME_S, format: { step: 1 }, isBase: true },
      { label: '分', value: 'm', format: { step: 60 } },
      { label: '时', value: 'h', format: { step: 60 * 60 } },
      { label: '日', value: 'd', format: { step: 60 * 60 * 24 } },
      { label: '月', value: 'M', format: { step: 60 * 60 * 24 * 30 } },
      { label: '年', value: 'y', format: { step: 60 * 60 * 24 * 365 } },
    ],
  },
  { label: '电量', value: 'Energy', children: [{ label: 'kW·h', value: 'kW·h', format: { step: 1 }, isBase: true }] },
  {
    label: '流量',
    value: 'Flow',
    children: [
      { label: 'm³', value: 'm3', format: { step: 1 }, isBase: true },
      { label: 'm³/d', value: 'm3/d', format: { step: 1 } },
      { label: 'm³/H', value: 'm3/H', format: { step: 24 } },
    ],
  },
  {
    label: '浓度',
    value: 'concentration',
    children: [
      { label: 'mg/L', value: 'mg/L', format: { step: 1 }, isBase: true },
      { label: 'g/L', value: 'g/L', format: { step: 1000 } },
    ],
  },
  {
    label: 'ppm浓度',
    value: 'ppm',
    children: [{ label: 'ppm', value: 'ppm', format: { step: 1 }, isBase: true }],
  },
  {
    label: '气压',
    value: 'airPressure',
    children: [
      { label: 'KPa', value: 'KPa', format: { step: 1 }, isBase: true },
      { label: 'Pa', value: 'Pa', format: { step: 1 / 1000 } },
      { label: 'MPa', value: 'MPa', format: { step: 1000 } },
    ],
  },
  {
    label: '电压',
    value: 'Voltage',
    children: [
      { label: 'mV', value: 'mV', format: { step: 1 }, isBase: true },
      { label: 'V', value: 'V', format: { step: 1000 } },
    ],
  },
  {
    label: '电流',
    value: 'Current',
    children: [
      { label: 'mA', value: 'mA', format: { step: 1 }, isBase: true },
      { label: 'A', value: 'A', format: { step: 1000 } },
    ],
  },
  {
    label: '频率',
    value: UNIT_FREQ,
    children: [
      { label: 'HZ', value: 'HZ', format: { step: 1 }, max: 50, isBase: true },
      { label: 'KHZ', value: 'KHZ', format: { step: 1000 } },
      { label: 'MHZ', value: 'MHZ', format: { step: 1000 * 1000 } },
    ],
  },
  {
    label: '功率',
    value: 'power',
    children: [
      { label: 'W', value: 'W', format: { step: 1 }, isBase: true },
      { label: 'KW', value: 'KW', format: { step: 1000 } },
      { label: 'MW', value: 'MW', format: { step: 1000 * 1000 } },
    ],
  },
  { label: '温度', value: 'temperature', children: [{ label: '℃', value: '℃', format: { step: 1 }, isBase: true }] },
  { label: '湿度', value: 'humidity', children: [{ label: '%', value: '%', format: { step: 1 }, isBase: true }] },
]; // 60 * 60 * 24 * 365 // 60 * 60 * 24 * 30 //  60 * 60 * 24 // 60 * 60 // 设备的默认时间单位为秒 // 设备的默认电量单位为kW·h // 设备的默认电压单位为V // 设备的默认电流单位为mA // 设备的默认频率单位为HZ
