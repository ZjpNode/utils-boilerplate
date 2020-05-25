/*
 * @Author       : jiapeng.Zheng
 * @Date         : 2020-04-24 10:04:17
 * @LastEditors  : jiapeng.Zheng
 * @LastEditTime : 2020-05-11 11:28:38
 * @Description  :
 */
import assert from 'assert';
import { StatOption, DeviceStatInfo } from '@/core/stat/type';
import DataFormat from '@/core/stat/dataFormat';

describe('src/core/stat/dataFormat', () => {
  const Data: Array<DeviceStatInfo> = [
    {
      Id: '29981e7a49814b5ba57442c248e80c5f',
      DeviceSn: 'c05e8535fcc74098a244933460646141',
      DeviceName: '异龙镇狮子湾村30T贝斯',
      ProjectId: 234,
      Date: '2020-04-17T01:10:00.41',
      Data:
        '{"DeviceSn":"c05e8535fcc74098a244933460646141","Date":"2020-04-17T01:10:00.4084493+08:00","Data":[{"Key":"0F1761","Values":"0.00","StaticsType":1,"Standard":"125","SUnit":"[\\"Flow\\",\\"m3\\"]","Name":"进水量","Unit":"[\\"Flow\\",\\"m3/H\\"]","Format":"{\\"step\\":100}","DisplayType":0,"ShowState":3}]}',
      TypeId: 64,
    },
    {
      Id: '360598cdf3dc44149323d4395f02ad53',
      DeviceSn: 'c05e8535fcc74098a244933460646141',
      DeviceName: '异龙镇狮子湾村30T贝斯',
      ProjectId: 234,
      Date: '2020-04-21T01:10:00.683',
      Data:
        '{"DeviceSn":"c05e8535fcc74098a244933460646141","Date":"2020-04-21T01:10:00.6847332+08:00","Data":[{"Key":"0F1761","Values":"0.00","StaticsType":1,"Standard":"125","SUnit":"[\\"Flow\\",\\"m3\\"]","Name":"进水量","Unit":"[\\"Flow\\",\\"m3/H\\"]","Format":"{\\"step\\":100}","DisplayType":0,"ShowState":3}]}',
      TypeId: 64,
    },
    {
      Id: '419d7542f1be4de7a9abb2c7cd57f563',
      DeviceSn: 'c05e8535fcc74098a244933460646141',
      DeviceName: '异龙镇狮子湾村30T贝斯',
      ProjectId: 234,
      Date: '2020-04-18T01:10:00.583',
      Data:
        '{"DeviceSn":"c05e8535fcc74098a244933460646141","Date":"2020-04-18T01:10:00.5831181+08:00","Data":[{"Key":"0F1761","Values":"0.00","StaticsType":1,"Standard":"125","SUnit":"[\\"Flow\\",\\"m3\\"]","Name":"进水量","Unit":"[\\"Flow\\",\\"m3/H\\"]","Format":"{\\"step\\":100}","DisplayType":0,"ShowState":3}]}',
      TypeId: 64,
    },
    {
      Id: '51fcfdfd59f746009628af6158a84387',
      DeviceSn: 'c05e8535fcc74098a244933460646141',
      DeviceName: '异龙镇狮子湾村30T贝斯',
      ProjectId: 234,
      Date: '2020-04-15T01:10:00.893',
      Data:
        '{"DeviceSn":"c05e8535fcc74098a244933460646141","Date":"2020-04-15T01:10:00.8926702+08:00","Data":[{"Key":"0F1761","Values":"0.00","StaticsType":1,"Standard":"125","SUnit":"[\\"Flow\\",\\"m3\\"]","Name":"进水量","Unit":"[\\"Flow\\",\\"m3/H\\"]","Format":"{\\"step\\":100}","DisplayType":0,"ShowState":3}]}',
      TypeId: 64,
    },
    {
      Id: '635a48d6348d4d9c944fd600d3f971e2',
      DeviceSn: 'c05e8535fcc74098a244933460646141',
      DeviceName: '异龙镇狮子湾村30T贝斯',
      ProjectId: 234,
      Date: '2020-04-16T01:10:00.967',
      Data:
        '{"DeviceSn":"c05e8535fcc74098a244933460646141","Date":"2020-04-16T01:10:00.9681015+08:00","Data":[{"Key":"0F1761","Values":"0.00","StaticsType":1,"Standard":"125","SUnit":"[\\"Flow\\",\\"m3\\"]","Name":"进水量","Unit":"[\\"Flow\\",\\"m3/H\\"]","Format":"{\\"step\\":100}","DisplayType":0,"ShowState":3}]}',
      TypeId: 64,
    },
    {
      Id: 'ef3bf51493074e4aa70ed04802a13172',
      DeviceSn: 'c05e8535fcc74098a244933460646141',
      DeviceName: '异龙镇狮子湾村30T贝斯',
      ProjectId: 234,
      Date: '2020-04-20T01:10:00.547',
      Data:
        '{"DeviceSn":"c05e8535fcc74098a244933460646141","Date":"2020-04-20T01:10:00.5463626+08:00","Data":[{"Key":"0F1761","Values":"0.00","StaticsType":1,"Standard":"125","SUnit":"[\\"Flow\\",\\"m3\\"]","Name":"进水量","Unit":"[\\"Flow\\",\\"m3/H\\"]","Format":"{\\"step\\":100}","DisplayType":0,"ShowState":3}]}',
      TypeId: 64,
    },
    {
      Id: 'efb580af7daa4909ad74e9c1055857f3',
      DeviceSn: 'c05e8535fcc74098a244933460646141',
      DeviceName: '异龙镇狮子湾村30T贝斯',
      ProjectId: 234,
      Date: '2020-04-19T01:10:00.79',
      Data:
        '{"DeviceSn":"c05e8535fcc74098a244933460646141","Date":"2020-04-19T01:10:00.7896527+08:00","Data":[{"Key":"0F1761","Values":"0.00","StaticsType":1,"Standard":"125","SUnit":"[\\"Flow\\",\\"m3\\"]","Name":"进水量","Unit":"[\\"Flow\\",\\"m3/H\\"]","Format":"{\\"step\\":100}","DisplayType":0,"ShowState":3}]}',
      TypeId: 64,
    },
  ];
  it('TEST DataFormat', () => {
    const option: StatOption = {
      showLevel: 3,
      statShowCof: { '010101': false },
      typeStatCof: {
        '64': {
          _StatisticsInfo: {
            '0F1761': {
              ShowState: 3,
              Filter: '0,250',
              FilterType: 1,
            },
          },
        },
      },
    };
    const _data = DataFormat(Data, option);
    assert(_data['0F1761'] !== undefined);
    assert(_data['0F1761'].id === '0F1761');
    assert(_data['0F1761']._baseUnit === 'm3');
    assert(_data['0F1761']._isShow === true);
    assert(_data['0F1761'].statName === '进水量');
    assert(_data['0F1761'].displayType === 0);
    assert(_data['0F1761'].data !== undefined);
    assert(_data['0F1761'].data['2020-04-15'] !== undefined);
    assert(_data['0F1761'].data['2020-04-15'].Date === '2020-04-15');
    assert(_data['0F1761'].data['2020-04-15'].Standard !== undefined);
    assert(_data['0F1761'].data['2020-04-15'].Values !== undefined);
    assert(_data['0F1761'].monthData !== undefined);
    assert(_data['0F1761'].monthData['2020-04'] !== undefined);
    assert(_data['0F1761'].monthData['2020-04'].Date === '2020-04');
    assert(
      Number(_data['0F1761'].monthData['2020-04'].Standard) ===
        Number(_data['0F1761'].data['2020-04-15'].Standard) +
          Number(_data['0F1761'].data['2020-04-16'].Standard) +
          Number(_data['0F1761'].data['2020-04-17'].Standard) +
          Number(_data['0F1761'].data['2020-04-18'].Standard) +
          Number(_data['0F1761'].data['2020-04-19'].Standard) +
          Number(_data['0F1761'].data['2020-04-20'].Standard) +
          Number(_data['0F1761'].data['2020-04-21'].Standard)
    );
    assert(
      Number(_data['0F1761'].monthData['2020-04'].Values) ===
        Number(_data['0F1761'].data['2020-04-15'].Values) +
          Number(_data['0F1761'].data['2020-04-16'].Values) +
          Number(_data['0F1761'].data['2020-04-17'].Values) +
          Number(_data['0F1761'].data['2020-04-18'].Values) +
          Number(_data['0F1761'].data['2020-04-19'].Values) +
          Number(_data['0F1761'].data['2020-04-20'].Values) +
          Number(_data['0F1761'].data['2020-04-21'].Values)
    );
    assert(_data['0F1761'].monthData['2020-04'].Values !== undefined);
    assert(_data['0F1761'].yearData !== undefined);
    assert(_data['0F1761'].yearData['2020'] !== undefined);
    assert(_data['0F1761'].yearData['2020'].Date === '2020');
    assert(_data['0F1761'].yearData['2020'].Standard === _data['0F1761'].monthData['2020-04'].Standard);
    assert(_data['0F1761'].yearData['2020'].Values === _data['0F1761'].monthData['2020-04'].Values);
    assert(_data['0F1761'].station !== undefined);
    assert(_data['0F1761'].station['234'] !== undefined);
    assert(_data['0F1761'].station['234']._deviceObj !== undefined);
    assert(_data['0F1761'].station['234']._deviceObj['c05e8535fcc74098a244933460646141'] !== undefined);
    assert(_data['0F1761'].station['234']._deviceObj['c05e8535fcc74098a244933460646141'].TypeId === 64);
    assert(_data['0F1761'].station['234']._deviceObj['c05e8535fcc74098a244933460646141'].ProjectId === 234);
    assert(_data['0F1761'].station['234']._deviceObj['c05e8535fcc74098a244933460646141'].DeviceSn === 'c05e8535fcc74098a244933460646141');
    assert(_data['0F1761'].station['234']._deviceObj['c05e8535fcc74098a244933460646141'].Id === '360598cdf3dc44149323d4395f02ad53');
    assert(_data['0F1761'].station['234']._deviceObj['c05e8535fcc74098a244933460646141'].Date !== undefined);
    assert(_data['0F1761'].station['234']._deviceObj['c05e8535fcc74098a244933460646141'].Data !== undefined);
    assert(_data['0F1761'].station['234']._deviceObj['c05e8535fcc74098a244933460646141'].DeviceName === '异龙镇狮子湾村30T贝斯');
    assert(_data['0F1761'].station['234'].data !== undefined);
    assert(_data['0F1761'].station['234'].monthData !== undefined);
    assert(_data['0F1761'].station['234'].yearData !== undefined);
  });
  it('TEST DataFormat if typeStatCof === {}', () => {
    const option: StatOption = {
      showLevel: 3,
      statShowCof: { '010101': false },
      typeStatCof: {},
    };
    const _data = DataFormat(Data, option);
    assert(Object.keys(_data).length === 0);
  });
  it('TEST DataFormat if typeStatCof === { "64": { _StatisticsInfo: {} } }', () => {
    const option: StatOption = {
      showLevel: 3,
      statShowCof: { '010101': false },
      typeStatCof: { '64': { _StatisticsInfo: {} } },
    };
    const _data = DataFormat(Data, option);
    assert(Object.keys(_data).length === 0);
  });
  it('TEST DataFormat if statShowCof === {}', () => {
    const option: StatOption = {
      showLevel: 3,
      statShowCof: {},
      typeStatCof: {
        '64': {
          _StatisticsInfo: {
            '0F1761': {
              ShowState: 3,
              Filter: '0,250',
              FilterType: 1,
            },
          },
        },
      },
    };
    const _data = DataFormat(Data, option);
    assert(_data['0F1761']._isShow === true);
  });
  it('TEST DataFormat if statShowCof === { "0F1761": true }', () => {
    const option: StatOption = {
      showLevel: 3,
      statShowCof: { '0F1761': true },
      typeStatCof: {
        '64': {
          _StatisticsInfo: {
            '0F1761': {
              ShowState: 3,
              Filter: '0,250',
              FilterType: 1,
            },
          },
        },
      },
    };
    const _data = DataFormat(Data, option);
    assert(_data['0F1761']._isShow === true);
  });
  it('TEST DataFormat if statShowCof === { "0F1761": false }', () => {
    const option: StatOption = {
      showLevel: 3,
      statShowCof: { '0F1761': false },
      typeStatCof: {
        '64': {
          _StatisticsInfo: {
            '0F1761': {
              ShowState: 3,
              Filter: '0,250',
              FilterType: 1,
            },
          },
        },
      },
    };
    const _data = DataFormat(Data, option);
    assert(_data['0F1761']._isShow === false);
  });
  it('TEST DataFormat if FilterType === 1 but Filter === ""', () => {
    const option: StatOption = {
      showLevel: 3,
      statShowCof: { '010101': false },
      typeStatCof: {
        '64': {
          _StatisticsInfo: {
            '0F1761': {
              ShowState: 3,
              Filter: '',
              FilterType: 1,
            },
          },
        },
      },
    };
    const _data = DataFormat(Data, option);
    assert(_data['0F1761'].monthData['2020-04'].Values === '0.00' );
    assert(_data['0F1761'].yearData['2020'].Values === '0.00');
    
    // _data['0F1761'].data[];
  });
});
