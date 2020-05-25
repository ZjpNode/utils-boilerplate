/*
 * @Author       : jiapeng.Zheng
 * @Date         : 2020-04-17 09:18:57
 * @LastEditors  : jiapeng.Zheng
 * @LastEditTime : 2020-04-24 10:07:53
 * @Description  :
 */
import Validate from '@/utils/validate';
import Format from '@/utils/format';
import $mqttData from '@/core/mqttData';
import { DataTypeEnum, FormatObj, StringFormat } from '@/core/mqttData/type';
import { DeviceStatInfo, StatOption, DeviceFormatStat, DisplayTypeEnum, FilterTypeEnum, JsonStatData } from '@/core/stat/type';

// { showLevel = STAT_SHOW_LEVEL_ALL, typeStatCof = {} } = { showLevel: STAT_SHOW_LEVEL_ALL, typeStatCof: {} }
export default function DataFormat(data: Array<DeviceStatInfo>, option: StatOption): DeviceFormatStat {
  // // 获取不同类型统计图的个性化配置（目前主要用来判断首页上是否显示对应的统计图）
  // const cof = $store.state.$userConfig[USERCONFIG_STATS_KEY] || {};
  const { statShowCof, showLevel, typeStatCof } = option;

  // 按照时间进行排序
  data = data.sort(function (o1, o2) {
    return new Date(o1.Date).getTime() - new Date(o2.Date).getTime();
  });
  const rData: DeviceFormatStat = {};
  // 遍历 data
  for (const i of data) {
    // 直接通过截取字符串获取年月日(必须确保 i.Date 的格式为 YYYY-MM-DD)，不通过 Moment 库进行格式化获取（数据量过多时很耗时间）
    const _date = i.Date.substr(0, 10); // Format.dayConvert(i.Date)
    const _year = i.Date.substr(0, 4); // Format.yearConvert(i.Date)
    const _month = i.Date.substr(0, 7); // Format.monthConvert(i.Date)
    // 解析 data 数据中的 Data 属性（包含各种类型的统计数据）
    if (Validate.isJsonString(i.Data)) {
      const typeStat = typeStatCof[i.TypeId] || { _StatisticsInfo: {} }; // 类型配置
      const statData: JsonStatData = JSON.parse(i.Data);
      // 遍历data数据中的Data属性，按统计类型（电量、水量...）划分
      for (const j of statData.Data) {
        // 过滤掉“类型统计配置”中不存在的统计项目（主要是因为旧数据中保留旧配置）
        if (typeStat._StatisticsInfo[j.Key]) {
          const { ShowState, FilterType, Filter } = typeStat._StatisticsInfo[j.Key]; // 从类型配置中获取每个数据定义的展示层级(ShowState), 过滤方案(FilterType), 过滤内容(Filter)
          j.ShowState = ShowState;
          // 隐藏不在当前层级的数据
          if (j.ShowState >= showLevel) {
            // ======================= 1、划分不同统计类 =======================
            rData[j.Key] = rData[j.Key] || {
              id: j.Key,
              data: {},
              yearData: {},
              monthData: {},
              station: {},
              statName: j.Name,
              _baseUnit: '', // 基本单位
              _isShow: statShowCof[j.Key] === undefined ? true : statShowCof[j.Key],
              displayType: DisplayTypeEnum.STAT_TYPE_CHECK,
            };
            // ======================= 2、以最新的统计数据覆盖旧数据的部分属性 =======================
            rData[j.Key].statName = j.Name; // 以最新的名称，重新覆盖统计名称属性
            rData[j.Key]._baseUnit = $mqttData.getBaseUnit(j.SUnit); // 以最新的单位，覆盖基本单位
            rData[j.Key].displayType = j.DisplayType || DisplayTypeEnum.STAT_TYPE_CHECK; // 重新覆盖区分统计类型属性
            // ======================= 2-1、在不同的统计类型划中再根据年月日进行划分 =======================
            // 在不同的统计类中，按每一天划分
            rData[j.Key].data[_date] = rData[j.Key].data[_date] || {
              Date: _date,
              Values: '0.00',
              Standard: '0.00',
            };
            // 在不同的统计类中，按每一个月划分
            rData[j.Key].monthData[_month] = rData[j.Key].monthData[_month] || {
              Date: _month,
              Values: '0.00',
              Standard: '0.00',
            };
            // 在不同的统计类中，按每一年划分
            rData[j.Key].yearData[_year] = rData[j.Key].yearData[_year] || {
              Date: _year,
              Values: '0.00',
              Standard: '0.00',
            };
            // ======================= 2-2、在不同的统计类型划中再根据站场进行划分 =======================
            // 在不同的统计类中，再按不同的站场进行划分
            rData[j.Key].station[i.ProjectId] = rData[j.Key].station[i.ProjectId] || {
              data: {},
              yearData: {},
              monthData: {},
              _deviceObj: {},
            };
            // ======================= 2-2-1、在不同的统计类型的不同站场再根据年月日进行划分 =======================
            // 在不同的统计类的不同站场中，再按每一天进行划分
            rData[j.Key].station[i.ProjectId].data[_date] = rData[j.Key].station[i.ProjectId].data[_date] || {
              Date: _date,
              Device: {},
              Values: '0.00',
              Standard: '0.00',
            };
            // 在不同的统计类的不同站场中，再按每一月进行划分
            rData[j.Key].station[i.ProjectId].monthData[_month] = rData[j.Key].station[i.ProjectId].monthData[_month] || {
              Date: _month,
              Device: {},
              Values: '0.00',
              Standard: '0.00',
            };
            // 在不同的统计类的不同站场中，再按每一年进行划分
            rData[j.Key].station[i.ProjectId].yearData[_year] = rData[j.Key].station[i.ProjectId].yearData[_year] || {
              Date: _year,
              Device: {},
              Values: '0.00',
              Standard: '0.00',
            };
            // ======================= 2-2-1-1、在不同的统计类型的不同站场的年月日中根据设备进行划分 =======================
            rData[j.Key].station[i.ProjectId].data[_date].Device[i.DeviceSn] = rData[j.Key].station[i.ProjectId].data[_date].Device[i.DeviceSn] || {
              ...j,
              Values: '0.00',
              Standard: '0.00',
            };
            rData[j.Key].station[i.ProjectId].monthData[_month].Device[i.DeviceSn] = rData[j.Key].station[i.ProjectId].monthData[_month].Device[i.DeviceSn] || {
              ...j,
              Values: '0.00',
              Standard: '0.00',
            };
            rData[j.Key].station[i.ProjectId].yearData[_year].Device[i.DeviceSn] = rData[j.Key].station[i.ProjectId].yearData[_year].Device[i.DeviceSn] || {
              ...j,
              Values: '0.00',
              Standard: '0.00',
            };

            // ======================= 3、统计数据处理 =======================
            // 最大最小值过滤
            if (FilterType === FilterTypeEnum.STAT_FILTER_MAX_MIN) {
              const maxMin = String(Filter).split(',');
              const _min = Number(maxMin[0]) || 0;
              const _max = Number(maxMin[1]) || 0;
              if (_min > _max) {
                console.error(`FilterType=${FilterType},Filter=${Filter} had Error`);
              }
              if (Number(j.Values) > _max || Number(j.Values) < _min) {
                // console.warn(`过滤[${i.Date}]${i.DeviceName}(${i.DeviceSn}),${j.Name}(${j.Key}),values:${j.Values}, min: ${_min}, max: ${_max} `)
                j.Values = '0.00';
              }
            }
            // Format 转换：部分设备上传来的数据是经过 Format 转换的（例如：放大了100倍），需要重新转换为正常的数据
            j.Values = String($mqttData.outFormat({ Format: j.Format, DataType: DataTypeEnum.DATA_TYPE_STRING }, j.Values));
            // 实际值单位转换：不同单位的数据进行合计时候，要转换为同一基础单位 （例如：把 m3/H 转换为 m3）
            const unitFormatObj: StringFormat = $mqttData.unitFormat(j.Unit, 'format') as FormatObj;
            if (unitFormatObj && unitFormatObj.step) {
              j.Values = String(Number(j.Values) * unitFormatObj.step);
            }
            // 标准值单位转换
            const sunitFormatObj: StringFormat = $mqttData.unitFormat(j.SUnit, 'format') as FormatObj;
            if (sunitFormatObj && sunitFormatObj.step) {
              j.Standard = String(Number(j.Standard) * sunitFormatObj.step);
            }
            // ======================= 4、数据合并 =======================
            // 过滤掉异常的数据（实际值大于标准值(标准值不能为0)100倍说明数据有误）
            if (!Number(j.Standard) || Number(j.Values) < Number(j.Standard) * 100) {
              // console.log(i.Date, i.DeviceName, j.Key, j.Values)
              rData[j.Key].station[i.ProjectId]._deviceObj[i.DeviceSn] = { ...i }; // 保存当前站场下的设备统计信息
              // ======================= 4-1、合计同一天不同设备的值 =======================
              // 累计每日实际值
              rData[j.Key].data[_date].Values = Format.keepDecimal(Number(rData[j.Key].data[_date].Values) + Number(j.Values));
              // 累计每日理论值
              rData[j.Key].data[_date].Standard = Format.keepDecimal(Number(rData[j.Key].data[_date].Standard) + Number(j.Standard));
              // 累计各站场中每日实际值
              rData[j.Key].station[i.ProjectId].data[_date].Values = Format.keepDecimal(Number(rData[j.Key].station[i.ProjectId].data[_date].Values) + Number(j.Values));
              // 累计各站场中每日理论值
              rData[j.Key].station[i.ProjectId].data[_date].Standard = Format.keepDecimal(Number(rData[j.Key].station[i.ProjectId].data[_date].Standard) + Number(j.Standard));
              // 保存各站场中每日的各个设备
              rData[j.Key].station[i.ProjectId].data[_date].Device[i.DeviceSn].Values = Format.keepDecimal(
                Number(rData[j.Key].station[i.ProjectId].data[_date].Device[i.DeviceSn].Values) + Number(j.Values)
              );
              // ======================= 4-2、合计同一月不同设备的值 =======================
              // 累计每月实际j.Values值
              rData[j.Key].monthData[_month].Values = Format.keepDecimal(Number(rData[j.Key].monthData[_month].Values) + Number(j.Values));
              // 累计每月理论值
              rData[j.Key].monthData[_month].Standard = Format.keepDecimal(Number(rData[j.Key].monthData[_month].Standard) + Number(j.Standard));
              // 累计各站场每月实际值
              rData[j.Key].station[i.ProjectId].monthData[_month].Values = Format.keepDecimal(
                Number(rData[j.Key].station[i.ProjectId].monthData[_month].Values) + Number(j.Values)
              );
              // 累计各站场每月理论值
              rData[j.Key].station[i.ProjectId].monthData[_month].Standard = Format.keepDecimal(
                Number(rData[j.Key].station[i.ProjectId].monthData[_month].Standard) + Number(j.Standard)
              );
              // 保存各站场每月中的各个设备
              rData[j.Key].station[i.ProjectId].monthData[_month].Device[i.DeviceSn].Values = Format.keepDecimal(
                Number(rData[j.Key].station[i.ProjectId].monthData[_month].Device[i.DeviceSn].Values) + Number(j.Values)
              );
              // ======================= 4-3、合计同一年不同设备的值 =======================
              // 累计每年实际值
              rData[j.Key].yearData[_year].Values = Format.keepDecimal(Number(rData[j.Key].yearData[_year].Values) + Number(j.Values));
              // 累计每年理论值
              rData[j.Key].yearData[_year].Standard = Format.keepDecimal(Number(rData[j.Key].yearData[_year].Standard) + Number(j.Standard));
              // 累计各站场每年实际值
              rData[j.Key].station[i.ProjectId].yearData[_year].Values = Format.keepDecimal(Number(rData[j.Key].station[i.ProjectId].yearData[_year].Values) + Number(j.Values));
              // 累计各站场每年理论值
              rData[j.Key].station[i.ProjectId].yearData[_year].Standard = Format.keepDecimal(
                Number(rData[j.Key].station[i.ProjectId].yearData[_year].Standard) + Number(j.Standard)
              );
              // 保存各站场中每年的各个设备
              rData[j.Key].station[i.ProjectId].yearData[_year].Device[i.DeviceSn].Values = Format.keepDecimal(
                Number(rData[j.Key].station[i.ProjectId].yearData[_year].Device[i.DeviceSn].Values) + Number(j.Values)
              );
              //   {
              //   ...j,
              //   Values: j.Values,
              //   Standard: j.Standard
              // }
              // if (rData[j.Key].data[_date].Values !== undefined) {
              // }
              // else {
              //   rData[j.Key].data[_date] = { Date: _date, DeviceSn: i.DeviceSn, ...j }
              //   rData[j.Key].station[i.ProjectId].data[_date] = { Date: _date, DeviceSn: i.DeviceSn, ...j }
              // }
            }
          }
        }
      }
    }
  }
  return rData;
}
