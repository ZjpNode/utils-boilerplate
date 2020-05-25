/*
 * @Author       : jiapeng.Zheng
 * @Date         : 2020-04-20 14:28:27
 * @LastEditors  : jiapeng.Zheng
 * @LastEditTime : 2020-04-28 17:34:19
 * @Description  :
 */
/**
 * [枚举]数据定义类型
 */
export enum DataTypeEnum {
  DATA_TYPE_BOOLEAN = 'boolean',
  DATA_TYPE_BOOLEAN2 = 'boolean2',
  DATA_TYPE_STRING = 'string',
  DATA_TYPE_ENUM = 'enum',
  DATA_TYPE_MONITOR = 'monitor',
  DATA_TYPE_DATETIME = 'time',
  DATA_TYPE_SELECT = 'select',
}
/**
 * [枚举]四则运算操作符
 */
export enum FormulaOptionEnum {
  /**
   * 加法操作
   */
  Add = 1,
  /**
   * 减法操作
   */
  Subtract = -1,
  /**
   * 乘法操作
   */
  Multiply = 2,
  /**
   * 除法操作
   */
  Divide = -2,
}
export type FormulaRule = [FormulaOptionEnum, number];
export interface UnitObj {
  label: string;
  value: string;
  format?: FormatObj;
  max?: number;
  isBase?: boolean;
  children?: Array<UnitObj>;
}
export interface SelectFormat {
  options?: Array<{ value: string; name: string }>;
}
export interface TimeFormat {
  farmat?: string;
}
export interface BooleanFormat {
  [boolKey: string]: number | string;
}
export interface EnumFormat {
  [EnumKey: string]: string | number;
}
export interface StringFormat {
  step?: number;
  formula?: Array<FormulaRule>;
}
export type FormatObj = TimeFormat & BooleanFormat & StringFormat & EnumFormat & SelectFormat;

/* eslint @typescript-eslint/no-explicit-any: 0 */
export interface FormatFunction {
  (value: any, format: FormatObj): any;
}
