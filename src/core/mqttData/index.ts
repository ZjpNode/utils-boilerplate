/*
 * @Author       : jiapeng.Zheng
 * @Date         : 2020-04-20 13:57:41
 * @LastEditors  : jiapeng.Zheng
 * @LastEditTime : 2020-05-07 17:17:29
 * @Description  : 根据数据的定义中的 Format 字段解析 mqtt 上传的数据
 */
import Validate from '@/utils/validate';
import FormatUtil from '@/utils/format';
import { DATA_TYPE_UNIT_CONFIG } from '@/config/unitConfig';
import { StringFormat, EnumFormat, BooleanFormat, SelectFormat, TimeFormat, DataTypeEnum, FormatObj, UnitObj, FormatFunction } from '@/core/mqttData/type';
import Formula from './formula';

// =========================================================== 单位格式化 =====================================================
/**
 * 根据单位 value, 获取 DATA_TYPE_UNIT_CONFIG 各组单位中的基本单位的某一属性(key)
 * @param   value   单位
 * @param   key     基本单位的属性，默认为 "value"
 * @description 基本单位的 format 一定是 { step: 1 }
 * ```
 * getBaseUnit('Time')    // -> s
 * getBaseUnit('["Time"]')    // -> s
 * getBaseUnit('["Time","s"]')    // -> s
 * getBaseUnit('["Time","y"]')    // -> s
 * getBaseUnit('Time','label')  // -> 秒
 * getBaseUnit('Time','format')    // -> { step: 1 }
 * ```
 */
const getBaseUnit = <T extends UnitObj[keyof UnitObj]>(value: string, key: keyof UnitObj = 'value'): T => {
  const valueObj = Validate.isJsonString(value) ? JSON.parse(value) : [`${value}`];
  const valueArray = FormatUtil.getCascaderObj(valueObj, DATA_TYPE_UNIT_CONFIG);
  const topObj = valueArray[0] ? valueArray[0] : { children: [] };

  const baseUnit = (topObj.children || []).find((ele) => {
    return ele.isBase === true;
  });

  return (baseUnit ? baseUnit[key] : '') as T;
};
/**
 * 根据 DATA_TYPE_UNIT_CONFIG 对单位 value 进行格式化
 * @param   value   要格式化的单位
 * @param   key     格式化后单位的属性， 默认为 "label"
 * @returns 格式化后单位的某一属性(key)
 *```
 * unitFormat('Time')    // -> undefined
 * unitFormat('["Time"]')    // -> undefined
 * unitFormat('["Time","s"]')    // -> 秒
 * unitFormat('["Time","s"]','format')    // -> { step: 1 }
 * unitFormat('["Time","y"]')    // -> 年
 * unitFormat('["Time","y"]','format')    // -> { step: 60 * 60 * 24 * 365 }
 * ```
 */
const unitFormat = <T extends UnitObj[keyof UnitObj]>(value: string, key: keyof UnitObj = 'label'): T => {
  const valueObj = Validate.isJsonString(value) ? JSON.parse(value) : [`${value}`];
  const valueArray = FormatUtil.getCascaderObj(valueObj, DATA_TYPE_UNIT_CONFIG);
  let result: UnitObj[keyof UnitObj] = '';
  if (valueArray && valueArray.length > 1 && valueArray[valueArray.length - 1] !== undefined) {
    result = (valueArray[valueArray.length - 1] as UnitObj)[key];
  }
  // const result = valueArray[valueArray.length - 1] ? valueArray[valueArray.length - 1][key] : '';
  return result as T;
};

// ================ 数据显示格式化（将从“设备”接收到的数据格式化为“前端组件”能处理的数据） ================
/**
 * 布尔类型数据输出格式化
 * @param   value       从设备接收到的数据
 * @param   formatObj   格式化对象
 * @returns 前端 switch 组件能够识别的数据(0或者1)
 * ```
 * booleanOutFormat(0,{0:"0",1:"1"}) // -> "0"
 * booleanOutFormat(1,{0:"0",1:"1"}) // -> "1"
 * booleanOutFormat(1,{0:"1",1:"2"}) // -> "0"
 * booleanOutFormat(2,{0:"1",1:"2"}) // -> "1"
 * booleanOutFormat(3,{0:"1",1:"2"}) // -> 3
 * ```
 */
const booleanOutFormat = (value: string | number = 0, formatObj: BooleanFormat): string | number => {
  let returnVal: string | number = value;
  for (const i in formatObj) {
    if (String(formatObj[i]) === String(value)) {
      returnVal = i;
    }
  }
  return returnVal;
};
/**
 * 字符类型数据输出格式化
 * @param value       从设备接收到的数据
 * @param formatObj   格式化对象
 * @returns 前端组件能够正确显示的数据
 * @description 主要是将数据缩小或放大一定倍数{@link StringFormat.step}，或经过一定的反向四则运算{@link StringFormat.formula}，再下发
 * ```
 * stringOutFormat(100,{step:10}) // -> 100/10 -> 10
 * stringOutFormat(52,{formula:[[1, 3],[2, 4]]}) // ->  52/4 - 3 = 10
 * ```
 */
const stringOutFormat = (value = 0, formatObj: StringFormat): number => {
  let returnVal = value;
  formatObj.formula = formatObj.formula || [];
  // formatObj.step = formatObj.step || 1
  if (Array.isArray(formatObj.formula) && formatObj.formula.length > 0) {
    returnVal = Formula.inverseOperation(value, formatObj.formula);
  } else if (formatObj.step) {
    returnVal = Number((value / formatObj.step).toFixed(3));
  }
  return returnVal;
};
/**
 * 时间类型数据输出格式化
 * @param   value   从设备接收到的数据，格式为“HH:mm:ss”
 * @returns 前端时间控件能够正确显示的数据
 * ```
 * const date = MqttData.timeOutFormat('15:49:30');
 * date.getHours() // -> 15
 * date.getMinutes() // -> 49
 * date.getSeconds() // -> 30
 * ```
 */
const timeOutFormat = (value: string /* ,formatObj */): Date | undefined => {
  // let date = $utils.dayConvert(Date.now());
  let date: string | Date | undefined = FormatUtil.dateFormat(new Date());
  date = new Date(`${date} ${value}`);
  if (isNaN(date.getTime())) {
    date = undefined;
  }
  return date;
};
/**
 * 枚举类型数据输出格式化
 * @param   value  从设备接收到的数据
 * @returns 不做任何处理，直接返回 value
 */
const enumOutFormat = <T>(value: T): T => {
  return value;
};

/**
 * 监控类型数据输出格式化，同{@link stringOutFormat}
 * @description 监控类型的输出逻辑与字符类型的输出逻辑一致
 * @description 监控类型数据与字符类型数据的唯一区别，就是监控类型只是用于展示，不能进行下发
 */
const monitorOutFormat = stringOutFormat;
/**
 * 下拉类型数据输出格式化
 * @param   value  从设备接收到的数据
 * @returns 不做任何处理，直接返回 value
 */
const selectOutFormat = (value = '' /**, formatObj */): string => {
  return value;
};
// ================ 数据控制格式化（将“用户”通过“前端组件”输入的数据格式为“设备”能处理的数据） ================
/**
 * 布尔类型数据输入格式化
 * @param   value       前端switch组件准备下发到设备的数据,只能是0或者1
 * @param   formatObj   格式化对象
 * @returns 设备能够识别的数据
 * ```
 * booleanInFormat(0,{0:"0",1:"1"}) // -> "0"
 * booleanInFormat(1,{0:"0",1:"1"}) // -> "1"
 * booleanInFormat(0,{0:0,1:1}) // -> 0
 * booleanInFormat(1,{0:0,1:1}) // -> 1
 * booleanInFormat(0,{0:"1",1:"2"}) // -> "1"
 * booleanInFormat(1,{0:"1",1:"2"}) // -> "2"
 * booleanInFormat(3,{0:"1",1:"2"}) // -> 3
 * ```
 */
const booleanInFormat = (value: string | number = 0, formatObj: BooleanFormat): number | string => {
  return formatObj[value] !== undefined ? formatObj[value] : value;
};
/**
 * 字符类型数据输入格式化
 * @param value       前端组件准备下发到设备的数据
 * @param formatObj   格式化对象
 * @returns 设备能够识别的数据
 * @description 主要是将数据放大或缩小一定倍数{@link StringFormat.step}，或经过一定的四则运算{@link StringFormat.formula}，再下发
 * ```
 * stringInFormat(10,{step:10}) // -> 10*10 -> 100
 * stringInFormat(10,{formula:[[1, 3],[2, 4]]}) // -> (10 + 3)*4 -> 52
 * ```
 */
const stringInFormat = (value = 0, formatObj: StringFormat): number => {
  let returnVal = value;
  formatObj.formula = formatObj.formula || [];
  // formatObj.step = formatObj.step || 1
  if (Array.isArray(formatObj.formula) && formatObj.formula.length > 0) {
    returnVal = Formula.operation(value, formatObj.formula);
  } else if (formatObj.step) {
    returnVal = Number((value * formatObj.step).toFixed(3));
  }

  return returnVal;
};
/**
 * 时间类型数据输入格式化
 * @param value       前端时间控件准备下发的值
 * @param formatObj   格式化对象
 * @description 主要是将Date类型的数据转换为字符串，并根据{@link TimeFormat.farmat} 进行格式化
 * ```
 * const date = new Date('2019-12-12 15:49:30');
 * timeInFormat(date) // -> '15:49:30'
 * timeInFormat(date,{ farmat: 'YYYY/MM/DD HH:mm:ss' }) // -> '2019/12/12 15:49:30'
 * ```
 */
const timeInFormat = (value: Date, formatObj: TimeFormat = { farmat: 'HH:mm:ss' }): string => {
  // return $utils.timeConvert(value, formatObj.farmat);
  return FormatUtil.dateFormat(value, formatObj.farmat || 'HH:mm:ss');
};
/**
 * 枚举类型数据输入格式化，同{@link enumOutFormat},直接返回原值
 */
const enumInFormat = enumOutFormat;
/**
 * 监控类型数据输入格式化，同{@link stringInFormat}
 * @description 监控类型数据与字符类型数据的唯一区别，就是监控类型只是用于展示，不能进行下发
 * @description 此处 monitorInFormat 引用 stringInFormat，只是为了保持监控类型数据与字符类型数据逻辑上的一致性
 */
const monitorInFormat = stringInFormat;
/**
 * 下拉类型数据输入格式化，同{@link selectOutFormat},直接返回原值
 */
const selectInFormat = selectOutFormat;

// ================ 数据展示格式化（将从“设备”接收到的数据格式化为能“直接展示（不带单位）”的数据） ================
/**
 * 布尔类型数据展示格式化
 * @param   value      从设备接收到的数据
 * @param   formatObj  格式化对象
 * @param   dict       0,1对应的字典,默认为{ '0': '关', '1': '开' }
 * @description 将接收到的数据根据formatObj转换为0或者1，再将0转换为"关"，1转换为"开"
 * ```
 * booleanShowFormat(0,{0:"0",1:"1"}) // -> "0" -> "关"
 * booleanShowFormat(1,{0:"0",1:"1"}) // -> "1" -> "开"
 * booleanShowFormat(1,{0:"1",1:"2"}) // -> "0" -> "关"
 * booleanShowFormat(2,{0:"1",1:"2"}) // -> "1" -> "开"
 * booleanShowFormat(3,{0:"1",1:"2"}) // -> 3 -> undefined
 * booleanShowFormat(0,{0:"0",1:"1"},{ 0: '关闭', 1: '开启' }) // -> "0" -> "关闭"
 * booleanShowFormat(1,{0:"0",1:"1"},{ 0: '关闭', 1: '开启' }) // -> "1" -> "开启"
 * ```
 */
const booleanShowFormat = (value: string | number = 0, formatObj: BooleanFormat, dict: { [boolKey: string]: string } = { 0: '关', 1: '开' }): string | undefined => {
  // const dict = { '0': locales[i18n.locale]['deviceOff'], '1': locales[i18n.locale]['deviceOn'] };
  // const dict: { [boolKey: string]: string } = { '0': '关', '1': '开' };
  value = booleanOutFormat(value, formatObj);
  // value = formatObj[value] || value;
  return dict[value];
};
/**
 * 字符类型数据展示格式化，同{@link stringOutFormat}
 */
const stringShowFormat = stringOutFormat;
/**
 * 时间类型数据展示格式化
 * @param value 从设备接收到的数据
 * @returns 不做任何处理，直接返回 value
 */
const timeShowFormat = (value: string /**formatObj */): string => {
  return value;
};

/**
 * 枚举类型数据展示格式化，同
 * @param   value       从设备接收到的数据
 * @param   formatObj   格式化对象
 * @description 根据枚举字典{@link EnumFormat}进行格式化
 * ```
 * const formatObj = {"0":"低水位","1":"中水位","2":"高水位"}
 * enumShowFormat(0, formatObj)  // -> '低水位'
 * enumShowFormat(1, formatObj)  // -> '中水位'
 * enumShowFormat(2, formatObj)  // -> '高水位'
 * enumShowFormat(3, formatObj)  // -> 3
 * ```
 */
const enumShowFormat = (value = '', formatObj: EnumFormat): string | number => {
  return formatObj[value] || value;
};
/**
 * 监控类型数据展示格式化，同{@link stringShowFormat}
 * @description 监控类型的展示逻辑与字符类型的展示逻辑一致
 * @description 监控类型数据与字符类型数据的唯一区别，就是监控类型只是用于展示，不能进行下发
 */
const monitorShowFormat = stringShowFormat;
/**
 * 下拉类型数据展示格式化
 * @param   value       从设备接收到的数据
 * @param   formatObj   格式化对象
 * @description 根据{@link SelectFormat.options} 格式化数据
 * ```
 * const format = {options:[{name:"开",value:"1"},{name:"关",value:"0"}]}
 * selectShowFormat("0",format) // -> "关"
 * selectShowFormat("1",format) // -> "开"
 * selectShowFormat("2",format) // -> "2"
 * selectShowFormat(0,format) // -> 0
 * selectShowFormat(1,format) // -> 1
 * selectShowFormat(2,format) // -> 2
 * ```
 */
const selectShowFormat = (value = '', formatObj: SelectFormat): string => {
  let opt;
  if (Array.isArray(formatObj.options)) {
    opt = formatObj.options.find((ele) => ele.value === value);
  }
  return opt ? opt.name : value;
};
// =========================================================================================================
/**
 * 将 Format 字符串 序列化 FormatObj 类型对象
 * @param Format 要序列化的字符串
 * ```
 * _format('{"options":[{"name":"开","value":"1"},{"name":"关","value":"0"}]}') // -> {"options":[{"name":"开","value":"1"},{"name":"关","value":"0"}]}
 * ```
 */
const _format = (Format: string): FormatObj => {
  return Validate.isJsonString(Format) ? JSON.parse(Format) : {};
};
/* eslint @typescript-eslint/no-use-before-define: 0 */
/**
 * 格式化接收到的设备数据，主要用来只显示（带单位）
 * @param   param0  格式化对象，`param0.Unit`->能够序列化的“单位”字符,`param0.Format`->能够序列化的“格式化”字符, `param0.DataType`->数据类型
 * @param   value   接收到的设备数据
 * @returns 能够直接显示的数据（带单位）
 * ```
 * showFormat({Unit:"",Format:"","string"})
 * ```
 */
const showFormat = function ({ Unit, Format, DataType }: { Unit: string; Format: string; DataType: DataTypeEnum }, value: string | number): string {
  const formatObj = _format(Format);
  const showFormat = FormatUtil.getProperty<FormatFunction>(FormatModule, `${DataType}ShowFormat`);
  return showFormat(value, formatObj) + unitFormat(Unit);
};
/**
 * 格式化接收到的设备数据
 * @param   param0  格式化对象，`param0.Format`->能够序列化的“格式化”字符, `param0.DataType`->数据类型
 * @param   value   接收到的设备数据
 * @returns 前端控件能够解析的数据
 */
const outFormat = function ({ Format, DataType }: { Format: string; DataType: DataTypeEnum }, value: string | number): string | number {
  const formatObj = _format(Format);
  const outFormat = FormatUtil.getProperty<FormatFunction>(FormatModule, `${DataType}OutFormat`);
  return outFormat(value, formatObj);
};
/**
 * 格式化将要下发到设备的数据
 * @param   param0  格式化对象，`param0.Format`->能够序列化的“格式化”字符, `param0.DataType`->数据类型
 * @param   value   前端控件生成的数据
 * @returns 设备能够接收的数据
 */
const inFormat = function ({ Format, DataType }: { Format: string; DataType: DataTypeEnum }, value: string | number): string | number {
  const formatObj = _format(Format);
  const inFormat = FormatUtil.getProperty<FormatFunction>(FormatModule, `${DataType}InFormat`);
  return inFormat(value, formatObj);
};

const FormatModule = {
  booleanOutFormat,
  booleanInFormat,
  booleanShowFormat,
  boolean2OutFormat: booleanOutFormat,
  boolean2InFormat: booleanInFormat,
  boolean2ShowFormat: booleanShowFormat,
  stringOutFormat,
  stringInFormat,
  stringShowFormat,
  selectOutFormat,
  selectInFormat,
  selectShowFormat,
  timeOutFormat,
  timeInFormat,
  timeShowFormat,
  enumOutFormat,
  enumInFormat,
  enumShowFormat,
  monitorOutFormat,
  monitorInFormat,
  monitorShowFormat,
};
export default {
  ...FormatModule,
  _format,
  showFormat,
  outFormat,
  inFormat,
  unitFormat,
  getBaseUnit,
};
