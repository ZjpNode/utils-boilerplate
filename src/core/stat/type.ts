/*
 * @Author       : jiapeng.Zheng
 * @Date         : 2020-04-17 14:35:49
 * @LastEditors  : jiapeng.Zheng
 * @LastEditTime : 2020-05-11 09:42:29
 * @Description  :
 */

/**
 * 展示层级
 */
export enum ShowLevelEnum {
  /**
   * 只在“设备”上展示，不在“站场、项目、首页”上展示
   */
  STAT_SHOW_LEVEL_DEVICE = 0,
  /**
   * 只在“设备、站场”上展示，不在“项目、首页”上展示
   */
  STAT_SHOW_LEVEL_STATION = 1,
  /**
   * 只在“设备、站场、项目”上展示，不在“首页”上展示
   */
  STAT_SHOW_LEVEL_PROJECT = 2,
  /**
   * 在“首页、项目、站场、设备”上展示
   */
  STAT_SHOW_LEVEL_ALL = 3,
}
/**
 * 过滤方案
 */
export enum FilterTypeEnum {
  /**
   * 不过滤
   */
  STAT_FILTER_NO = 0,
  /**
   * 最大值最小值过滤
   */ STAT_FILTER_MAX_MIN = 1,
  // 其他方案
  STAT_FILTER_OTHER = 2,
}
/**
 * 统计显示分组
 */
export enum DisplayTypeEnum {
  /**
   * （默认）检测类型统计
   */
  STAT_TYPE_CHECK = 0,
  /**
   * 监测类型统计
   */
  STAT_TYPE_MONITOR = 1,
  /**
   * 状态类型统计
   */
  STAT_TYPE_STATE = 2,
}
/**
 * 统计配置
 */
export interface StatOption {
  /**
   * 当前层级，
   */
  showLevel: ShowLevelEnum;
  /**
   * 用户自定义的配置信息
   */
  statShowCof: { [statKey: string]: boolean };
  /**
   * 所有类型的配置信息
   */
  typeStatCof: {
    /**
     * 各个类型的配置
     */
    [typeId: string]: {
      /**
       * 当前类型下的统计配置
       */
      _StatisticsInfo: {
        /**
         * 当前类型下的各个统计配置
         */
        [statKey: string]: {
          /**
           * 展示层级
           */
          ShowState: ShowLevelEnum;
          /**
           * 过滤方案
           */
          FilterType: FilterTypeEnum;
          /**
           * 过滤内容
           */
          Filter?: string;
        };
      };
    };
  };
}
/**
 * 设备中的各种（电量、水量...）统计信息
 */
interface DeivceStatType {
  /**
   * 统计数据定义Key，用来区分电量、水量等统计
   */
  Key: string;
  /**
   * 实际值
   */
  Values: string;
  // StaticsType: 2;
  /**
   * 标准值
   */
  Standard: string;
  /**
   * 标准值单位
   */
  SUnit: string;
  /**
   * 统计名称
   */
  Name: string;
  /**
   * 实际值单位
   */
  Unit: string;
  /**
   * 数据定义Key对应的转换公式
   */
  Format: string; // '{"step":1}';
  /**
   * 统计种类
   */
  DisplayType: DisplayTypeEnum;
  /**
   * 展示层级
   */
  ShowState: ShowLevelEnum;
}
/**
 * DeviceStatInfo.Data 序列化后的类型
 */
export interface JsonStatData {
  /**
   * 设备序列号
   */
  DeviceSn: string;
  /**
   * 日期
   */
  Date: string;
  /**
   * 具体的统计数据
   */
  Data: Array<DeivceStatType>;
}
/**
 * 单台设备一天的统计内容
 */
export interface DeviceStatInfo {
  Id: string;
  /**
   * 设备序列号
   */
  DeviceSn: string;
  /**
   * 设备名称
   */
  DeviceName: string;
  /**
   * 设备所属的站场
   */
  ProjectId: number;
  /**
   * 设备类型ID
   */
  TypeId: number;
  /**
   * 统计日期
   */
  Date: string;
  /**
   * 统计数据，json字符串
   */
  Data: string;
}
/**
 * 统计数据
 */
interface StatData {
  /**
   * 日期
   */
  Date: string;
  /**
   * 标准值
   */
  Standard: string;
  /**
   * 实际值
   */
  Values: string;
}
/**
 * 设备每一天、每一月、每一年的统计数据
 */
interface DeviceStatData {
  data: { [YYYYMMDD: string]: StatData };
  yearData: { [YYYY: string]: StatData };
  monthData: { [YYYYMM: string]: StatData };
}
/**
 * 站场每一天、每一月、每一年的的统计数据，包含站场下所有的设备信息
 */
interface StationStatData {
  _deviceObj: { [DeviceSn: string]: DeviceStatInfo };
  data: { [YYYYMMDD: string]: StatData & { Device: { [DeviceSn: string]: DeivceStatType } } };
  yearData: { [YYYY: string]: StatData & { Device: { [DeviceSn: string]: DeivceStatType } } };
  monthData: { [YYYYMM: string]: StatData & { Device: { [DeviceSn: string]: DeivceStatType } } };
}
/**
 * 格式化后的统计内容
 */
export interface DeviceFormatStat {
  [statKey: string]: {
    id: string;
    station: { [projectId: string]: StationStatData };
    statName: string;
    _baseUnit: string; // 基本单位
    _isShow: boolean;
    displayType: DisplayTypeEnum;
  } & DeviceStatData;
}
